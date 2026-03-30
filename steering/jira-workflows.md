---
inclusion: manual
---

# Jira Workflow Guide

## Common Workflows

### Finding Issues
Use `search_issues` with JQL. Examples:
- All open bugs: `project = PROJ AND issuetype = Bug AND status != Done`
- Assigned to me: `assignee = currentUser() AND resolution = Unresolved`
- Recently updated: `project = PROJ AND updated >= -7d ORDER BY updated DESC`
- Sprint issues: `sprint in openSprints() AND project = PROJ`

### Creating an Issue
1. Call `create_issue` with `projectKey`, `issueType`, and `summary`.
2. Optionally pass `description` (plain text) and `fields` for custom fields.

### Transitioning an Issue
1. Call `get_transitions` with the `issueKey` to see available transitions.
2. Call `transition_issue` with the `issueKey` and the desired `transitionId`.
3. Optionally include a `comment` with the transition.

### Working with Epics
- Use `get_epic_children` to retrieve all child issues of an epic, including comments and relationships.
- Epic children are returned with full comment history and mention tracking.

### Adding Context
- Use `add_comment` to add plain text comments (auto-converted to Atlassian Document Format).
- Use `add_attachment` with base64-encoded file content.
