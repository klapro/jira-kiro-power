#!/usr/bin/env bun
import { Server as g } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport as w } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema as A, CallToolRequestSchema as b, McpError as c, ErrorCode as d } from "@modelcontextprotocol/sdk/types.js";
class f {
  baseUrl;
  headers;
  constructor(t, e, s, i = "basic") {
    this.baseUrl = t.replace(/\/+$/, "");
    let r;
    i === "bearer" ? r = `Bearer ${s}` : r = `Basic ${Buffer.from(`${e}:${s}`).toString("base64")}`, this.headers = new Headers({
      Authorization: r,
      Accept: "application/json",
      "Content-Type": "application/json"
    });
  }
  async handleFetchError(t, e) {
    if (!t.ok) {
      let s = t.statusText, i = {};
      try {
        i = await t.json(), Array.isArray(i.errorMessages) && i.errorMessages.length > 0 ? s = i.errorMessages.join("; ") : i.message ? s = i.message : i.errorMessage && (s = i.errorMessage);
      } catch {
        console.warn("Could not parse JIRA error response body as JSON.");
      }
      const r = JSON.stringify(i, null, 2);
      console.error("JIRA API Error Details:", r);
      const n = s ? `: ${s}` : "";
      throw new Error(
        `JIRA API Error${n} (Status: ${t.status})`
      );
    }
    throw new Error("Unknown error occurred during fetch operation.");
  }
  /**
   * Extracts issue mentions from Atlassian document content
   * Looks for nodes that were auto-converted to issue links
   */
  extractIssueMentions(t, e, s) {
    const i = [], r = (n) => {
      if (n.type === "inlineCard" && n.attrs?.url) {
        const o = n.attrs.url.match(/\/browse\/([A-Z]+-\d+)/);
        o && i.push({
          key: o[1],
          type: "mention",
          source: e,
          commentId: s
        });
      }
      n.type === "text" && n.text && (n.text.match(/[A-Z]+-\d+/g) || []).forEach((a) => {
        i.push({
          key: a,
          type: "mention",
          source: e,
          commentId: s
        });
      }), n.content && n.content.forEach(r);
    };
    return t.forEach(r), [...new Map(i.map((n) => [n.key, n])).values()];
  }
  cleanComment(t) {
    const e = t.body?.content ? this.extractTextContent(t.body.content) : "", s = t.body?.content ? this.extractIssueMentions(t.body.content, "comment", t.id) : [];
    return {
      id: t.id,
      body: e,
      author: t.author?.displayName,
      created: t.created,
      updated: t.updated,
      mentions: s
    };
  }
  /**
   * Recursively extracts text content from Atlassian Document Format nodes
   */
  extractTextContent(t) {
    return Array.isArray(t) ? t.map((e) => e.type === "text" ? e.text || "" : e.content ? this.extractTextContent(e.content) : "").join("") : "";
  }
  cleanIssue(t) {
    const e = t.fields?.description?.content ? this.extractTextContent(t.fields.description.content) : "", s = {
      id: t.id,
      key: t.key,
      summary: t.fields?.summary,
      status: t.fields?.status?.name,
      created: t.fields?.created,
      updated: t.fields?.updated,
      description: e,
      relatedIssues: []
    };
    if (t.fields?.description?.content) {
      const i = this.extractIssueMentions(
        t.fields.description.content,
        "description"
      );
      i.length > 0 && (s.relatedIssues = i);
    }
    if (t.fields?.issuelinks?.length > 0) {
      const i = t.fields.issuelinks.map((r) => {
        const n = r.inwardIssue || r.outwardIssue, o = r.type.inward || r.type.outward;
        return {
          key: n.key,
          summary: n.fields?.summary,
          type: "link",
          relationship: o,
          source: "description"
        };
      });
      s.relatedIssues = [
        ...s.relatedIssues || [],
        ...i
      ];
    }
    return t.fields?.parent && (s.parent = {
      id: t.fields.parent.id,
      key: t.fields.parent.key,
      summary: t.fields.parent.fields?.summary
    }), t.fields?.customfield_10014 && (s.epicLink = {
      id: t.fields.customfield_10014,
      key: t.fields.customfield_10014,
      summary: void 0
    }), t.fields?.subtasks?.length > 0 && (s.children = t.fields.subtasks.map((i) => ({
      id: i.id,
      key: i.key,
      summary: i.fields?.summary
    }))), s;
  }
  async fetchJson(t, e) {
    const s = await fetch(this.baseUrl + t, {
      ...e,
      headers: this.headers
    });
    return s.ok || await this.handleFetchError(s, t), s.json();
  }
  async searchIssues(t) {
    const e = new URLSearchParams({
      jql: t,
      maxResults: "50",
      fields: [
        "id",
        "key",
        "summary",
        "description",
        "status",
        "created",
        "updated",
        "parent",
        "subtasks",
        "customfield_10014",
        "issuelinks"
      ].join(","),
      expand: "names,renderedFields"
    }), s = await this.fetchJson(`/rest/api/3/search/jql?${e}`);
    return {
      total: s.total,
      issues: s.issues.map((i) => this.cleanIssue(i))
    };
  }
  async getEpicChildren(t) {
    const e = new URLSearchParams({
      jql: `"Epic Link" = ${t}`,
      maxResults: "100",
      fields: [
        "id",
        "key",
        "summary",
        "description",
        "status",
        "created",
        "updated",
        "parent",
        "subtasks",
        "customfield_10014",
        "issuelinks"
      ].join(","),
      expand: "names,renderedFields"
    }), s = await this.fetchJson(`/rest/api/3/search/jql?${e}`);
    return await Promise.all(
      s.issues.map(async (r) => {
        const n = await this.fetchJson(
          `/rest/api/3/issue/${r.key}/comment`
        ), o = this.cleanIssue(r), a = n.comments.map(
          (p) => this.cleanComment(p)
        ), I = a.flatMap(
          (p) => p.mentions
        );
        return o.relatedIssues = [
          ...o.relatedIssues,
          ...I
        ], o.comments = a, o;
      })
    );
  }
  async getIssueWithComments(t) {
    const e = new URLSearchParams({
      fields: [
        "id",
        "key",
        "summary",
        "description",
        "status",
        "created",
        "updated",
        "parent",
        "subtasks",
        "customfield_10014",
        "issuelinks"
      ].join(","),
      expand: "names,renderedFields"
    });
    let s, i;
    try {
      [s, i] = await Promise.all([
        this.fetchJson(`/rest/api/3/issue/${t}?${e}`),
        this.fetchJson(`/rest/api/3/issue/${t}/comment`)
      ]);
    } catch (a) {
      throw a instanceof Error && a.message.includes("(Status: 404)") ? new Error(`Issue not found: ${t}`) : a;
    }
    const r = this.cleanIssue(s), n = i.comments.map(
      (a) => this.cleanComment(a)
    ), o = n.flatMap(
      (a) => a.mentions
    );
    if (r.relatedIssues = [...r.relatedIssues, ...o], r.comments = n, r.epicLink)
      try {
        const a = await this.fetchJson(
          `/rest/api/3/issue/${r.epicLink.key}?fields=summary`
        );
        r.epicLink.summary = a.fields?.summary;
      } catch (a) {
        console.error("Failed to fetch epic details:", a);
      }
    return r;
  }
  async createIssue(t, e, s, i, r) {
    const n = {
      fields: {
        project: {
          key: t
        },
        summary: s,
        issuetype: {
          name: e
        },
        ...i && { description: i },
        ...r
      }
    };
    return this.fetchJson("/rest/api/3/issue", {
      method: "POST",
      body: JSON.stringify(n)
    });
  }
  async updateIssue(t, e) {
    await this.fetchJson(`/rest/api/3/issue/${t}`, {
      method: "PUT",
      body: JSON.stringify({ fields: e })
    });
  }
  async getTransitions(t) {
    return (await this.fetchJson(
      `/rest/api/3/issue/${t}/transitions`
    )).transitions;
  }
  async transitionIssue(t, e, s) {
    const i = {
      transition: { id: e }
    };
    s && (i.update = {
      comment: [
        {
          add: {
            body: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: s
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    }), await this.fetchJson(`/rest/api/3/issue/${t}/transitions`, {
      method: "POST",
      body: JSON.stringify(i)
    });
  }
  async addAttachment(t, e, s) {
    const i = new FormData();
    i.append("file", new Blob([e]), s);
    const r = new Headers(this.headers);
    r.delete("Content-Type"), r.set("X-Atlassian-Token", "no-check");
    const n = await fetch(
      `${this.baseUrl}/rest/api/3/issue/${t}/attachments`,
      {
        method: "POST",
        headers: r,
        body: i
      }
    );
    n.ok || await this.handleFetchError(n);
    const a = (await n.json())[0];
    return {
      id: a.id,
      filename: a.filename
    };
  }
  /**
   * Converts plain text to a basic Atlassian Document Format (ADF) structure.
   */
  createAdfFromBody(t) {
    return {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: t
            }
          ]
        }
      ]
    };
  }
  /**
   * Adds a comment to a JIRA issue.
   */
  async addCommentToIssue(t, e) {
    const i = {
      body: this.createAdfFromBody(e)
    }, r = await this.fetchJson(
      `/rest/api/3/issue/${t}/comment`,
      {
        method: "POST",
        body: JSON.stringify(i)
      }
    );
    return {
      id: r.id,
      author: r.author.displayName,
      created: r.created,
      updated: r.updated,
      body: this.extractTextContent(r.body.content)
    };
  }
}
class J extends f {
  constructor(t, e, s, i = "basic") {
    super(t, e, s, i);
  }
  // Example: Override fetchJson to use /rest/api/2/ instead of /rest/api/3/
  overrideApiPath(t) {
    return t.replace("/rest/api/3/", "/rest/api/2/");
  }
  // Override fetchJson to use the correct API path
  async fetchJson(t, e) {
    const s = this.overrideApiPath(t);
    return super.fetchJson(s, e);
  }
  // You may need to override other methods for Jira Server quirks (e.g., ADF support, field names)
  // Add overrides here as needed
}
const u = process.env.JIRA_API_TOKEN, l = process.env.JIRA_BASE_URL, y = process.env.JIRA_USER_EMAIL, S = process.env.JIRA_TYPE === "server" ? "server" : "cloud", h = process.env.JIRA_AUTH_TYPE === "bearer" ? "bearer" : "basic";
if (!u || !l || !y)
  throw new Error(
    "JIRA_API_TOKEN, JIRA_USER_EMAIL and JIRA_BASE_URL environment variables are required"
  );
class T {
  server;
  jiraApi;
  constructor() {
    this.server = new g(
      {
        name: "jira-mcp",
        version: "0.2.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    ), S === "server" ? this.jiraApi = new J(
      l,
      y,
      u,
      h
    ) : this.jiraApi = new f(
      l,
      y,
      u,
      h
    ), this.setupToolHandlers(), this.server.onerror = (t) => {
    }, process.on("SIGINT", async () => {
      await this.server.close(), process.exit(0);
    });
  }
  setupToolHandlers() {
    this.server.setRequestHandler(A, async () => ({
      tools: [
        {
          name: "search_issues",
          description: "Search JIRA issues using JQL",
          inputSchema: {
            type: "object",
            properties: {
              searchString: {
                type: "string",
                description: "JQL search string"
              }
            },
            required: ["searchString"],
            additionalProperties: !1
          }
        },
        {
          name: "get_epic_children",
          description: "Get all child issues in an epic including their comments",
          inputSchema: {
            type: "object",
            properties: {
              epicKey: {
                type: "string",
                description: "The key of the epic issue"
              }
            },
            required: ["epicKey"],
            additionalProperties: !1
          }
        },
        {
          name: "get_issue",
          description: "Get detailed information about a specific JIRA issue including comments",
          inputSchema: {
            type: "object",
            properties: {
              issueId: {
                type: "string",
                description: "The ID or key of the JIRA issue"
              }
            },
            required: ["issueId"],
            additionalProperties: !1
          }
        },
        {
          name: "create_issue",
          description: "Create a new JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              projectKey: {
                type: "string",
                description: "The project key where the issue will be created"
              },
              issueType: {
                type: "string",
                description: 'The type of issue to create (e.g., "Bug", "Story", "Task")'
              },
              summary: {
                type: "string",
                description: "The issue summary/title"
              },
              description: {
                type: "string",
                description: "The issue description"
              },
              fields: {
                type: "object",
                description: "Additional fields to set on the issue",
                additionalProperties: !0
              }
            },
            required: ["projectKey", "issueType", "summary"],
            additionalProperties: !1
          }
        },
        {
          name: "update_issue",
          description: "Update an existing JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to update"
              },
              fields: {
                type: "object",
                description: "Fields to update on the issue",
                additionalProperties: !0
              }
            },
            required: ["issueKey", "fields"],
            additionalProperties: !1
          }
        },
        {
          name: "get_transitions",
          description: "Get available status transitions for a JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to get transitions for"
              }
            },
            required: ["issueKey"],
            additionalProperties: !1
          }
        },
        {
          name: "transition_issue",
          description: "Change the status of a JIRA issue by performing a transition",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to transition"
              },
              transitionId: {
                type: "string",
                description: "The ID of the transition to perform"
              },
              comment: {
                type: "string",
                description: "Optional comment to add with the transition"
              }
            },
            required: ["issueKey", "transitionId"],
            additionalProperties: !1
          }
        },
        {
          name: "add_attachment",
          description: "Add a file attachment to a JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to add attachment to"
              },
              fileContent: {
                type: "string",
                description: "Base64 encoded content of the file"
              },
              filename: {
                type: "string",
                description: "Name of the file to be attached"
              }
            },
            required: ["issueKey", "fileContent", "filename"],
            additionalProperties: !1
          }
        },
        {
          name: "add_comment",
          description: "Add a comment to a JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueIdOrKey: {
                type: "string",
                description: "The ID or key of the issue to add the comment to"
              },
              body: {
                type: "string",
                description: "The content of the comment (plain text)"
              }
            },
            required: ["issueIdOrKey", "body"],
            additionalProperties: !1
          }
        }
      ]
    })), this.server.setRequestHandler(b, async (t) => {
      try {
        const e = t.params.arguments;
        switch (t.params.name) {
          case "search_issues": {
            if (!e.searchString || typeof e.searchString != "string")
              throw new c(
                d.InvalidParams,
                "Search string is required"
              );
            const s = await this.jiraApi.searchIssues(e.searchString);
            return {
              content: [
                { type: "text", text: JSON.stringify(s, null, 2) }
              ]
            };
          }
          case "get_epic_children": {
            if (!e.epicKey || typeof e.epicKey != "string")
              throw new c(
                d.InvalidParams,
                "Epic key is required"
              );
            const s = await this.jiraApi.getEpicChildren(e.epicKey);
            return {
              content: [
                { type: "text", text: JSON.stringify(s, null, 2) }
              ]
            };
          }
          case "get_issue": {
            if (!e.issueId || typeof e.issueId != "string")
              throw new c(
                d.InvalidParams,
                "Issue ID is required"
              );
            const s = await this.jiraApi.getIssueWithComments(
              e.issueId
            );
            return {
              content: [
                { type: "text", text: JSON.stringify(s, null, 2) }
              ]
            };
          }
          case "create_issue": {
            if (!e.projectKey || typeof e.projectKey != "string" || !e.issueType || typeof e.issueType != "string" || !e.summary || typeof e.summary != "string")
              throw new c(
                d.InvalidParams,
                "projectKey, issueType, and summary are required"
              );
            const s = await this.jiraApi.createIssue(
              e.projectKey,
              e.issueType,
              e.summary,
              e.description,
              e.fields
            );
            return {
              content: [
                { type: "text", text: JSON.stringify(s, null, 2) }
              ]
            };
          }
          case "update_issue": {
            if (!e.issueKey || typeof e.issueKey != "string" || !e.fields || typeof e.fields != "object")
              throw new c(
                d.InvalidParams,
                "issueKey and fields object are required"
              );
            return await this.jiraApi.updateIssue(e.issueKey, e.fields), {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    { message: `Issue ${e.issueKey} updated successfully` },
                    null,
                    2
                  )
                }
              ]
            };
          }
          case "get_transitions": {
            if (!e.issueKey || typeof e.issueKey != "string")
              throw new c(
                d.InvalidParams,
                "Issue key is required"
              );
            const s = await this.jiraApi.getTransitions(e.issueKey);
            return {
              content: [
                { type: "text", text: JSON.stringify(s, null, 2) }
              ]
            };
          }
          case "transition_issue": {
            if (!e.issueKey || typeof e.issueKey != "string" || !e.transitionId || typeof e.transitionId != "string")
              throw new c(
                d.InvalidParams,
                "issueKey and transitionId are required"
              );
            return await this.jiraApi.transitionIssue(
              e.issueKey,
              e.transitionId,
              e.comment
            ), {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      message: `Issue ${e.issueKey} transitioned successfully${e.comment ? " with comment" : ""}`
                    },
                    null,
                    2
                  )
                }
              ]
            };
          }
          case "add_attachment": {
            if (!e.issueKey || typeof e.issueKey != "string" || !e.fileContent || typeof e.fileContent != "string" || !e.filename || typeof e.filename != "string")
              throw new c(
                d.InvalidParams,
                "issueKey, fileContent, and filename are required"
              );
            const s = Buffer.from(e.fileContent, "base64"), i = await this.jiraApi.addAttachment(
              e.issueKey,
              s,
              e.filename
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      message: `File ${e.filename} attached successfully to issue ${e.issueKey}`,
                      attachmentId: i.id,
                      filename: i.filename
                    },
                    null,
                    2
                  )
                }
              ]
            };
          }
          case "add_comment": {
            if (!e.issueIdOrKey || typeof e.issueIdOrKey != "string" || !e.body || typeof e.body != "string")
              throw new c(
                d.InvalidParams,
                "issueIdOrKey and body are required"
              );
            const s = await this.jiraApi.addCommentToIssue(
              e.issueIdOrKey,
              e.body
            );
            return {
              content: [
                { type: "text", text: JSON.stringify(s, null, 2) }
              ]
            };
          }
          default:
            throw new c(
              d.MethodNotFound,
              `Unknown tool: ${t.params.name}`
            );
        }
      } catch (e) {
        throw e instanceof c ? e : new c(
          d.InternalError,
          e instanceof Error ? e.message : "Unknown error occurred"
        );
      }
    });
  }
  async run() {
    const t = new w();
    await this.server.connect(t);
  }
}
const _ = new T();
_.run().catch(() => {
});
//# sourceMappingURL=index.js.map
