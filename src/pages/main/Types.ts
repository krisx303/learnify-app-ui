export interface User {
    username: string;
    avatarUrl: string;
}

export interface Note {
    id: number;
    title: string;
    summary: string;
    author: string | null;
    date: string | null;
}

export interface Quiz {
    id: number;
    title: string;
    score: string;
}