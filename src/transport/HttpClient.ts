import {useMemo} from "react";
import {NoteSummary, QuizDetails, QuizSummary} from "../pages/main/Types";

/** Interface representing base HTTP client */
interface HttpClientBase {
    getRecentNotes(): Promise<NoteSummary[]>;

    getRecentQuizzes(): Promise<QuizSummary[]>;

    getQuizDetails(workspaceId: string, quizId: number): Promise<QuizDetails>;
}

class StubHttpClient implements HttpClientBase {
    getRecentNotes(): Promise<NoteSummary[]> {
        return new Promise((resolve) => {
            resolve([
                {id: 'algebra', title: 'Note 1', summary: 'Summary of Note 1', workspaceId: 'semestr1'},
                {id: 'dyskretna', title: 'Note 2', summary: 'Summary of Note 2', workspaceId: 'semestr1'},
                {id: 'analiza', title: 'Note 3', summary: 'Summary of Note 3', workspaceId: 'semestr1'},
                {id: 'wdi', title: 'Note 4', summary: 'Summary of Note 4', workspaceId: 'semestr1'},
            ]);
        });
    }

    getRecentQuizzes(): Promise<QuizSummary[]> {
        return Promise.resolve([
            {id: 1, title: 'Test 1', score: '80%', workspaceId: 'semestr1'},
            {id: 2, title: 'Test 2', score: '75%', workspaceId: 'semestr1'},
            {id: 3, title: 'Test 3', score: '90%', workspaceId: 'semestr1'},
        ]);
    }

    getQuizDetails(workspaceId: any, quizId: any): Promise<QuizDetails> {
        return Promise.resolve({
            id: 'agh_sieci_komputerowe_lab_1',
            name: 'Sieci komputerowe - lab 1',
            description: 'Warstwy modelu OSI/ISO',
            numberOfExercises: 20,
            lastScore: {
                incorrect: 6,
                correct: 12,
                unanswered: 2,
            }
        });
    }
}

/** Hook to provide an instance of the HTTP client */
export const useHttpClient = () => useMemo(() => new StubHttpClient(), []);