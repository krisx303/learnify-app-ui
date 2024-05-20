import {useMemo} from "react";
import {NoteSummary, QuizDetails, QuizSummary, Workspace} from "../pages/main/Types";

/** Interface representing base HTTP client */
interface HttpClientBase {
    getRecentNotes(): Promise<NoteSummary[]>;

    getRecentQuizzes(): Promise<QuizSummary[]>;

    getQuizDetails(workspaceId: string, quizId: number): Promise<QuizDetails>;

    getQuizQuestions(quizId: string): Promise<Question[]>;

    getWorkspaces(): Promise<Workspace[]>;

    verifyNoteIdIdentity(workspaceId: string, noteId: string): Promise<boolean>;

    verifyQuizIdIdentity(quizId: string): Promise<boolean>;
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

    getQuizQuestions(quizId: string): Promise<Question[]> {
        return new Promise((resolve) => resolve([
            {
                question: "Zadaniem warstwy drugiej modelu OSI/ISO jest:",
                type: "multiple-choice",
                weight: 1,
                choices: [
                    "wykrywanie błędów transmisji",
                    "nadawanie adresacji fizycznej",
                    "wybór kodowania danych",
                    "komunikacja w ramach segmentu fizycznego sieci",
                    "taktowanie wysyłania danych",
                    "budowa drzewa rozpinającego",
                ],
                answer: [true, true, false, true, false, true],
                feedback: [
                    "tak - bo to tutaj są np. ramki Ethernet z polami kontrolnymi, sumami kontrolnymi",
                    "tak - adresacja fizyczna jest tutaj, logiczna wyżej",
                    "nie - to warstwa 1",
                    "tak - bo ta sama sieć (fizycznie)",
                    "nie - to warstwa 1",
                    "tak - STP buduje swoje drzewo na urządzeniach warstwy 2",
                ],
            },
            {
                question: "Ile żyrafa ma nóg",
                type: "multiple-choice",
                weight: 1,
                choices: [
                    "na pewno więcej niż 1",
                    "mniej niż 5",
                    "dokładnie 4",
                    "czasem 3",
                    "prawie 2",
                    "2 + 2",
                ],
                answer: [true, true, true, false, false, true],
                feedback: [
                    "tak - 4>1",
                    "tak - 4<5",
                    "tak - 4=4",
                    "nie - czasem to i ślepej kurze się trafi ziarno",
                    "nie - prawie za mało",
                    "tak - 2 + 2 = 4 (jeszcze)",
                ],
            }
        ]));
    }

    getWorkspaces(): Promise<Workspace[]> {
        return Promise.resolve([
            {id: 'semestr1', name: 'Semestr 1'},
            {id: 'semestr2', name: 'Semestr 2'},
            {id: 'semestr3', name: 'Semestr 3'},
            {id: 'semestr4', name: 'Semestr 4'},
            {id: 'semestr5', name: 'Semestr 5'},
        ]);
    }

    verifyNoteIdIdentity(workspaceId : string, noteId: string): Promise<boolean> {
        return Promise.resolve(noteId != 'note1');
    }

    verifyQuizIdIdentity(quizId: string): Promise<boolean> {
        return Promise.resolve(quizId != 'quiz1');
    }
}

/** Hook to provide an instance of the HTTP client */
export const useHttpClient = () => useMemo(() => new StubHttpClient(), []);