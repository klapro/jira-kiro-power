#!/usr/bin/env bun
declare module "bun" {
    interface Env {
        JIRA_API_TOKEN: string;
        JIRA_BASE_URL: string;
        JIRA_USER_EMAIL: string;
        JIRA_TYPE: string;
        JIRA_AUTH_TYPE: string;
    }
}
export {};
