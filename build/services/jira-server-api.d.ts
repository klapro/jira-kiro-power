import { JiraApiService } from './jira-api.js';
export declare class JiraServerApiService extends JiraApiService {
    constructor(baseUrl: string, email: string, apiToken: string, authType?: 'basic' | 'bearer');
    protected overrideApiPath(path: string): string;
    protected fetchJson<T>(url: string, init?: RequestInit): Promise<T>;
}
