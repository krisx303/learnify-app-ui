export interface NoteSummary {
    id: string;
    workspace: Workspace;
    title: string;
    description: string;
    author: User;
    updatedAt: string;
}

export interface QuizSummary {
    id: string;
    workspaceId: string;
    title: string;
    score: string;
    author: User;
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