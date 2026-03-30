# Jira MCP

Connect Kiro to your Jira Cloud or Jira Server (Data Center) instance. Search, create, update, and manage issues without leaving your IDE.

## What it does

- **Search issues** using JQL queries
- **Get issue details** with comments, relationships, and epic children
- **Create and update issues** with custom fields
- **Transition statuses** (e.g., move from "To Do" to "In Progress")
- **Add comments** and **attach files** to issues

## Setup

You'll need to set these environment variables in the MCP server config:

| Variable | Description |
|---|---|
| `JIRA_API_TOKEN` | API token (Cloud) or PAT/password (Server) |
| `JIRA_BASE_URL` | e.g., `https://your-domain.atlassian.net` |
| `JIRA_USER_EMAIL` | Your Jira account email |
| `JIRA_TYPE` | `cloud` (default) or `server` |
| `JIRA_AUTH_TYPE` | `basic` (default) or `bearer` |

## Available Tools

| Tool | Description |
|---|---|
| `search_issues` | Search issues with JQL (max 50 results) |
| `get_issue` | Get full issue details with comments and relationships |
| `get_epic_children` | Get all children of an epic (max 100) |
| `create_issue` | Create a new issue |
| `update_issue` | Update issue fields |
| `get_transitions` | List available status transitions |
| `transition_issue` | Change issue status |
| `add_comment` | Add a comment to an issue |
| `add_attachment` | Attach a base64-encoded file |
