export interface CleanComment {
    id: string;
    body: string;
    author: string | undefined;
    created: string;
    updated: string;
    mentions: NonNullable<CleanJiraIssue["relatedIssues"]>;
}
export interface CleanJiraIssue {
    id: string;
    key: string;
    summary: string | undefined;
    status: string | undefined;
    created: string | undefined;
    updated: string | undefined;
    description: string;
    comments?: CleanComment[];
    parent?: {
        id: string;
        key: string;
        summary?: string;
    };
    children?: {
        id: string;
        key: string;
        summary?: string;
    }[];
    epicLink?: {
        id: string;
        key: string;
        summary?: string;
    };
    relatedIssues: {
        key: string;
        summary?: string;
        type: "mention" | "link";
        relationship?: string;
        source: "description" | "comment";
        commentId?: string;
    }[];
}
export interface SearchIssuesResponse {
    total: number;
    issues: CleanJiraIssue[];
}
export interface AdfDoc {
    version: 1;
    type: "doc";
    content: AdfNode[];
}
export type AdfNodeType = "paragraph" | "text";
export interface AdfNode {
    type: AdfNodeType;
    content?: AdfNode[];
    text?: string;
}
export interface JiraCommentResponse {
    id: string;
    self: string;
    author: {
        displayName: string;
    };
    body: AdfDoc;
    created: string;
    updated: string;
}
export interface AddCommentResponse {
    id: string;
    author: string;
    created: string;
    updated: string;
    body: string;
}
