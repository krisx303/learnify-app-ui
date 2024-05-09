export interface User {
    username: string;
    avatarUrl: string;
}

export interface Note {
    id: number;
    title: string;
    summary: string;
    author: string | undefined;
    date: string | undefined;
}

export interface Quiz {
    id: number;
    title: string;
    score: string;
}