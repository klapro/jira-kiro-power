# Jira MCP Power

This power provides access to Jira Cloud and Jira Server (Data Center) through an MCP server. It enables searching, creating, updating, and managing Jira issues directly from Kiro.

## Capabilities

- Search issues using JQL
- Get detailed issue information with comments and relationships
- Get all children of an epic
- Create and update issues
- Transition issue statuses
- Add comments to issues
- Attach files to issues

## Setup

### Environment Variables

The following environment variables must be configured in the MCP server config:

| Variable | Required | Description |
|---|---|---|
| `JIRA_API_TOKEN` | Yes | API token (Cloud), PAT or password (Server/DC) |
| `JIRA_BASE_URL` | Yes | Your Jira instance URL (e.g., `https://your-domain.atlassian.net`) |
| `JIRA_USER_EMAIL` | Yes | Your Jira account email |
| `JIRA_TYPE` | No | `cloud` (default) or `server` |
| `JIRA_AUTH_TYPE` | No | `basic` (default) or `bearer` |

### Authentication

- **Jira Cloud**: Create an API token at https://id.atlassian.com/manage-profile/security/api-tokens and use `basic` auth.
- **Jira Server/DC (Basic)**: Use username/password or API token with `basic` auth.
- **Jira Server/DC (Bearer)**: Use a Personal Access Token (PAT, available in DC 8.14.0+) with `bearer` auth.

## Usage Tips

- Use JQL syntax for `search_issues` (e.g., `project = MYPROJ AND status = "In Progress"`).
- When creating issues, `projectKey`, `issueType`, and `summary` are required. Use the `fields` parameter for additional fields.
- To change an issue's status, first call `get_transitions` to discover available transitions, then use `transition_issue` with the transition ID.
- File attachments must be base64-encoded.
- Results are cleaned and optimized for AI context windows — unnecessary metadata is stripped automatically.

## Limits

- `search_issues`: max 50 results per request
- `get_epic_children`: max 100 issues per request
