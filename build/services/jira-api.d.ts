import { AddCommentResponse, CleanComment, CleanJiraIssue, SearchIssuesResponse } from '../types/jira.js';
export declare class JiraApiService {
    protected baseUrl: string;
    protected headers: Headers;
    constructor(baseUrl: string, email: string, apiToken: string, authType?: 'basic' | 'bearer');
    protected handleFetchError(response: Response, url?: string): Promise<never>;
    /**
     * Extracts issue mentions from Atlassian document content
     * Looks for nodes that were auto-converted to issue links
     */
    protected extractIssueMentions(content: any[], source: "description" | "comment", commentId?: string): CleanJiraIssue["relatedIssues"];
    protected cleanComment(comment: {
        id: string;
        body?: {
            content?: any[];
        };
        author?: {
            displayName?: string;
        };
        created: string;
        updated: string;
    }): CleanComment;
    /**
     * Recursively extracts text content from Atlassian Document Format nodes
     */
    protected extractTextContent(content: any[]): string;
    protected cleanIssue(issue: any): CleanJiraIssue;
    protected fetchJson<T>(url: string, init?: RequestInit): Promise<T>;
    searchIssues(searchString: string): Promise<SearchIssuesResponse>;
    getEpicChildren(epicKey: string): Promise<CleanJiraIssue[]>;
    getIssueWithComments(issueId: string): Promise<CleanJiraIssue>;
    createIssue(projectKey: string, issueType: string, summary: string, description?: string, fields?: Record<string, any>): Promise<{
        id: string;
        key: string;
    }>;
    updateIssue(issueKey: string, fields: Record<string, any>): Promise<void>;
    getTransitions(issueKey: string): Promise<Array<{
        id: string;
        name: string;
        to: {
            name: string;
        };
    }>>;
    transitionIssue(issueKey: string, transitionId: string, comment?: string): Promise<void>;
    addAttachment(issueKey: string, file: Buffer, filename: string): Promise<{
        id: string;
        filename: string;
    }>;
    /**
     * Converts plain text to a basic Atlassian Document Format (ADF) structure.
     */
    private createAdfFromBody;
    /**
     * Adds a comment to a JIRA issue.
     */
    addCommentToIssue(issueIdOrKey: string, body: string): Promise<AddCommentResponse>;
}
