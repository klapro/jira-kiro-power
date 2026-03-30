# JIRA MCP Power

Access Jira Cloud and Jira Server (Data Center) directly from Kiro. Search, create, update, and manage Jira issues through MCP without leaving your editor.

## Setup

### 1. Get an API Token

**Jira Cloud:**
1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Copy the generated token

**Jira Server/Data Center:**
- **Basic auth:** Use your username and password, or an API token
- **Bearer auth:** Use a Personal Access Token (PAT, available in Data Center 8.14.0+)

### 2. Configure Your Credentials

After installing the power, add your credentials to `~/.kiro/settings/mcp.json` under the `powers.mcpServers` section. You only need to provide the environment variables — the power handles the server command automatically:

```json
{
  "powers": {
    "mcpServers": {
      "jira-mcp": {
        "env": {
          "JIRA_API_TOKEN": "<your-api-token>",
          "JIRA_BASE_URL": "https://your-domain.atlassian.net",
          "JIRA_USER_EMAIL": "you@example.com",
          "JIRA_TYPE": "cloud",
          "JIRA_AUTH_TYPE": "basic"
        }
      }
    }
  }
}
```

> **Note:** Place this under `powers.mcpServers`, not the top-level `mcpServers`. If the server fails to start with "must specify a command or URL", add `"command": "node"` and `"args": ["./build/index.js"]` alongside the `env` block — this can happen if Kiro's config merge doesn't preserve the power's defaults.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `JIRA_API_TOKEN` | Yes | API token (Cloud), PAT or password (Server/DC) |
| `JIRA_BASE_URL` | Yes | Your Jira instance URL (e.g., `https://your-domain.atlassian.net`) |
| `JIRA_USER_EMAIL` | Yes | Your Jira account email |
| `JIRA_TYPE` | No | `cloud` (default) or `server` |
| `JIRA_AUTH_TYPE` | No | `basic` (default) or `bearer` |

## Available Tools

### search_issues
Search Jira issues using JQL.
- `searchString` (required) — JQL query string

### get_issue
Get detailed information about a specific issue including comments.
- `issueId` (required) — The issue key or ID (e.g., `PROJ-123`)

### get_epic_children
Get all child issues of an epic including their comments.
- `epicKey` (required) — The epic issue key (e.g., `PROJ-100`)

### create_issue
Create a new Jira issue.
- `projectKey` (required) — Project key (e.g., `PROJ`)
- `issueType` (required) — Issue type (e.g., `Bug`, `Story`, `Task`)
- `summary` (required) — Issue title
- `description` (optional) — Issue description (plain text)
- `fields` (optional) — Additional fields as key-value pairs

### update_issue
Update an existing Jira issue.
- `issueKey` (required) — The issue key (e.g., `PROJ-123`)
- `fields` (required) — Fields to update as key-value pairs

### get_transitions
Get available status transitions for an issue.
- `issueKey` (required) — The issue key

### transition_issue
Change the status of an issue.
- `issueKey` (required) — The issue key
- `transitionId` (required) — The transition ID (use `get_transitions` first)
- `comment` (optional) — Comment to add with the transition

### add_comment
Add a comment to an issue.
- `issueIdOrKey` (required) — The issue key or ID
- `body` (required) — Comment text (plain text, auto-converted to Atlassian Document Format)

### add_attachment
Attach a file to an issue.
- `issueKey` (required) — The issue key
- `fileContent` (required) — Base64-encoded file content
- `filename` (required) — Name of the file

## Example Prompts

- "Search for all open bugs in project MYPROJ"
- "Show me issue PROJ-123"
- "Create a new task in PROJ: Fix login timeout"
- "What are the children of epic PROJ-100?"
- "Move PROJ-123 to In Progress"
- "Add a comment to PROJ-456: Deployed to staging"

## Limits

- `search_issues`: max 50 results per request
- `get_epic_children`: max 100 issues per request

## Tips

- Use JQL syntax for searches (e.g., `project = PROJ AND status = "In Progress"`)
- To transition an issue, first call `get_transitions` to discover available transition IDs
- Results are cleaned and optimized for AI context windows — unnecessary metadata is stripped automatically
