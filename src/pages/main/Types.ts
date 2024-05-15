export interface User {
    username: string;
    avatarUrl: string;
}

export interface NoteSummary {
    id: string;
    workspaceId: string;
    title: string;
    summary: string;
    author: string | undefined;
    date: string | undefined;
}

export interface QuizSummary {
    id: number;
    workspaceId: string;
    title: string;
    score: string;
    author: string | undefined;
    date: string | undefined;
}

export interface QuizDetails {
    id: string;
    name: string;
    description: string;
    numberOfExercises: number;
    lastScore: {
        correct: number;
        incorrect: number;
        unanswered: number;
    };
}