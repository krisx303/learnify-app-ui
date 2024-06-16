import {useMemo} from "react";
import {NoteSummary, QuizSummary, Workspace} from "../pages/main/Types";
import {QuizDetails} from "../pages/quiz/summmary/QuizDetails";
import {Question} from "../pages/quiz/solving/Question";
import {Position} from "../pages/notes/types";
import {NoteCreateDetails} from "../pages/main/modals/CreateNoteModal";

type Path = { strokeWidth: number; path: string; color: string; blendMode: string };
type Element = { width: number; id: string; position: Position; content: string; height: number };
type NotePageContent = { elements: Element[]; paths: Path[] };

/** Interface representing base HTTP client */
interface HttpClientBase {
    getRecentNotes(): Promise<NoteSummary[]>;

    getRecentQuizzes(): Promise<QuizSummary[]>;

    getQuizDetails(workspaceId: string, quizId: string): Promise<QuizDetails>;

    getQuizQuestions(quizId: string): Promise<Question[]>;

    getWorkspaces(): Promise<Workspace[]>;

    postNoteUpdate(workspaceId: string, noteId: string, content: NotePageContent): Promise<void>;

    createNewNote(note: NoteCreateDetails): Promise<NoteSummary>;

    getNoteDetails(workspaceId: string, noteId: string): Promise<NoteSummary>;

    getPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<NotePageContent>;

    createNewWorkspace(title: string): Promise<Workspace>;
}

class StubHttpClient implements HttpClientBase {
    getRecentNotes(): Promise<NoteSummary[]> {
        const workspace1 = {id: 'semestr1', displayName: 'Semestr 1'};
        return new Promise((resolve) => {
            resolve([
                {
                    id: 'agh_sieci_komputerowe_lab_1',
                    title: 'Sieci komputerowe - lab 1',
                    description: 'Warstwy modelu OSI/ISO',
                    workspace: workspace1,
                    author: {
                        id: '1',
                        displayName: 'Krzysztof Usnarski',
                        email: "abc@gmail.com"
                    },
                    updatedAt: '2024-04-28'
                },
                {
                    id: 'dyskretna', title: 'Note 2', description: 'Summary of Note 2', workspace: workspace1, author: {
                        id: '1',
                        displayName: 'Krzysztof Usnarski',
                        email: "abc@gmail.com"
                    },
                    updatedAt: '2024-04-28'
                },
                {
                    id: 'analiza', title: 'Note 3', description: 'Summary of Note 3', workspace: workspace1, author: {
                        id: '1',
                        displayName: 'Krzysztof Usnarski',
                        email: "abc@gmail.com"
                    },
                    updatedAt: '2024-04-28'
                },
                {
                    id: 'wdi', title: 'Note 4', description: 'Summary of Note 4', workspace: workspace1, author: {
                        id: '1',
                        displayName: 'Krzysztof Usnarski',
                        email: "abc@gmail.com"
                    },
                    updatedAt: '2024-04-28'
                },
            ]);
        });
    }

    getRecentQuizzes(): Promise<QuizSummary[]> {
        return Promise.resolve([
            {
                id: '1', title: 'Test 1', score: '15%', workspaceId: 'semestr1', author: {
                    id: '1',
                    displayName: 'Krzysztof Usnarski',
                    email: "abc@gmail.com"
                }
            },
            {
                id: '2', title: 'Test 2', score: '75%', workspaceId: 'semestr1', author: {
                    id: '1',
                    displayName: 'Krzysztof Usnarski',
                    email: "abc@gmail.com"
                }
            },
            {
                id: '3', title: 'Test 3', score: '90%', workspaceId: 'semestr1', author: {
                    id: '1',
                    displayName: 'Krzysztof Usnarski',
                    email: "abc@gmail.com"
                }
            },
        ]);
    }

    getQuizDetails(workspaceId: any, quizId: any): Promise<QuizDetails> {
        return Promise.resolve({
            id: 'agh_sieci_komputerowe_lab_1',
            title: 'Sieci komputerowe - lab 1',
            workspaceId: '123',
            description: 'Warstwy modelu OSI/ISO',
            numberOfQuestions: 18,
            lastScore: {
                incorrect: 6,
                correct: 12,
            },
            bestScore: {
                incorrect: 6,
                correct: 12,
            },
            author: {
                id: '1',
                displayName: 'Krzysztof Usnarski',
                email: "abc@gmail.com"
            },
            lastTryDate: '2024-04-28'
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
            },
            {
                question: "Ile to 4-2",
                type: "single-choice",
                weight: 1,
                choices: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                ],
                answer: 1,
                feedback: [
                    "nie",
                    "tak",
                    "nie",
                    "nie",
                    "nie",
                    "nie",
                ],
            }
        ]));
    }

    getWorkspaces(): Promise<Workspace[]> {
        return Promise.resolve([
            {id: 'semestr1', displayName: 'Semestr 1'},
            {id: 'semestr2', displayName: 'Semestr 2'},
            {id: 'semestr3', displayName: 'Semestr 3'},
            {id: 'semestr4', displayName: 'Semestr 4'},
            {id: 'semestr5', displayName: 'Semestr 5'},
        ]);
    }

    postNoteUpdate(workspaceId: string, noteId: string, content: NotePageContent) {
        return Promise.resolve();
    }

    createNewNote(note: NoteCreateDetails): Promise<NoteSummary> {
        return Promise.resolve({} as NoteSummary);
    }

    getNoteDetails(workspaceId: string, noteId: string): Promise<NoteSummary> {
        return Promise.resolve({} as NoteSummary);
    }

    getPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<NotePageContent> {
        return Promise.resolve({} as NotePageContent);
    }

    createNewWorkspace(title: string): Promise<Workspace> {
        return Promise.resolve({
            id: '123',
            displayName: title,
        });
    }
}

class RealHttpClient implements HttpClientBase {
    private baseUrl: string;
    private delegate: HttpClientBase;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.delegate = new StubHttpClient();
    }

    getQuizDetails(workspaceId: string, quizId: string): Promise<QuizDetails> {
        return this.delegate.getQuizDetails(workspaceId, quizId);
    }

    getQuizQuestions(quizId: string): Promise<Question[]> {
        return this.delegate.getQuizQuestions(quizId);
    }

    getRecentNotes(): Promise<NoteSummary[]> {
        return this.get('/notes/recent');
    }

    getRecentQuizzes(): Promise<QuizSummary[]> {
        return this.delegate.getRecentQuizzes();
    }

    getWorkspaces(): Promise<Workspace[]> {
        return this.get('/workspaces');
    }

    postNoteUpdate(workspaceId: string, noteId: string, content: NotePageContent): Promise<void> {
        return this.put(`/notes/${noteId}/content/1`, content);
    }

    createNewNote(note: NoteCreateDetails): Promise<NoteSummary> {
        return this.post('/notes', note);
    }

    getNoteDetails(workspaceId: string, noteId: string): Promise<NoteSummary> {
        return this.get(`/notes/${noteId}`);
    }

    getPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<NotePageContent> {
        return this.get(`/notes/${noteId}/content/${pageNumber}`);
    }

    createNewWorkspace(title: string) {
        return this.post('/workspaces', {displayName: title});
    }

    private get(path: string): Promise<any> {
        return fetch(`${this.baseUrl}${path}`)
            .then(response => response.json());
    }

    private post(path: string, body: any) {
        return fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(response => response.json());
    }

    private put(path: string, body: any) {
        return fetch(`${this.baseUrl}${path}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(response => response.json());
    }
}

/** Hook to provide an instance of the HTTP client */
export const useHttpClient = () => useMemo(() => new RealHttpClient("http://localhost:8080"), []);