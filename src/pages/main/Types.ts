export interface NoteSummary {
    id: string;
    workspaceId: string;
    title: string;
    summary: string;
    author?: string | undefined;
    date?: string | undefined;
}

export interface QuizSummary {
    id: string;
    workspaceId: string;
    title: string;
    score: string;
    author?: string | undefined;
    date?: string | undefined;
}

export interface Workspace {
    id: string;
    name: string;
}