export interface NoteSummary {
    id: string;
    workspace: Workspace;
    title: string;
    description: string;
    author?: User | undefined;
    updatedAt?: string | undefined;
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
    displayName: string;
}

export interface User {
    id: string;
    displayName: string;
    email: string;
}