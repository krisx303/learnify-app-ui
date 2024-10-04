export type NoteType = 'document' | 'board';

export interface NoteSummary {
    id: string;
    workspace: Workspace;
    title: string;
    description: string;
    author: User;
    updatedAt: string;
    type: NoteType;
}

export interface QuizSummary {
    id: string;
    workspace: Workspace;
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