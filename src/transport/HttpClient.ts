import {useMemo} from "react";
import {
    AccessType,
    FullPermissionModel,
    NoteSummary,
    QuizSummary,
    ResourceType,
    User, UserPermission,
    UserPermissionLevel,
    Workspace
} from "../pages/main/Types";
import {QuizDetails} from "../pages/quiz/summmary/QuizDetails";
import {Question} from "../pages/quiz/solving/Question";
import {NoteCreateDetails} from "../pages/main/modals/CreateNoteModal";
import {QuizCreateDetails} from "../pages/main/modals/CreateQuizModal";
import {ElementType, Position} from "../components/notes/board/types";
import {useAuth} from "../pages/auth/AuthProvider";

export type PathDto = { strokeWidth: number; path: string; color: string; blendMode: string };
export type ElementDto = { width: number; id: string; position: Position; content: string; height: number; type: ElementType };
type BoardNotePageContent = { elements: ElementDto[]; paths: PathDto[] };
type BoardNotePageContentWithVersion = { content: BoardNotePageContent; version: number };
type DocumentNotePageContentWithVersion = { content: string; version: number };
export type PermissionDto = { user: User; access: string }

/** Interface representing base HTTP client */
interface HttpClientBase {
    getRecentNotes(): Promise<NoteSummary[]>;

    getRecentQuizzes(): Promise<QuizSummary[]>;

    getQuizDetails(workspaceId: string, quizId: string): Promise<QuizDetails>;

    getQuizQuestions(quizId: string): Promise<Question[]>;

    getWorkspaces(): Promise<Workspace[]>;

    putBoardNotePageUpdate(workspaceId: string, noteId: string, pageNumber: number, version: number, content: BoardNotePageContent): Promise<void>;

    putDocumentNotePageUpdate(workspaceId: string, noteId: string, pageNumber: number, version: number, content: string): Promise<void>;

    createNewNote(note: NoteCreateDetails): Promise<NoteSummary>;

    getNoteDetails(workspaceId: string, noteId: string): Promise<NoteSummary>;

    getBoardPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<BoardNotePageContentWithVersion>;

    getDocumentPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<DocumentNotePageContentWithVersion>;

    createNewWorkspace(title: string, resourceAccessTypeDto: string): Promise<Workspace>;

    createNewQuiz(quiz: QuizCreateDetails): Promise<QuizSummary>;

    registerUser(email: string, displayName: string): Promise<void>;

    searchUsers(email: string, displayName: string): Promise<User[]>;

    getFullPermissionModel(resourceType: ResourceType, resourceId: string): Promise<FullPermissionModel>;

    getUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<UserPermission>;

    addUserPermission(resourceType: ResourceType, resourceId: string, userId: string, level: UserPermissionLevel): Promise<void>;

    editUserPermission(resourceType: ResourceType, resourceId: string, userId: string, level: UserPermissionLevel): Promise<void>;

    removeUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<void>;

    getWorkspace(workspaceId: string): Promise<Workspace>;

    getNotesWithinWorkspace(workspaceId: string): Promise<NoteSummary[]>;

    getQuizzesWithinWorkspace(workspaceId: string): Promise<QuizSummary[]>;

    getAllNotes(): Promise<NoteSummary[]>;

    getAllQuizzes(): Promise<QuizSummary[]>;

    getBoundedQuizzes(noteId: string): Promise<any>;

    getBoundNotes(quizId: string): Promise<NoteSummary[]>;

    createNewBoardPage(workspaceId: string, noteId: string): Promise<void>;

    createNewDocumentPage(workspaceId: string, noteId: string): Promise<void>;

    updateResourcePermissionLevel(resourceType: ResourceType, resourceId: string, value: AccessType): Promise<void>;
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
        const workspace1 = {id: 'semestr1', displayName: 'Semestr 1'};
        const author1 = {id: '1', displayName: 'Krzysztof Usnarski', email: "abc@gmail.com"}
        return Promise.resolve([
            {
                id: '1', title: 'Test 1', score: '15%', workspace: workspace1, author: author1
            },
            {
                id: '2', title: 'Test 2', score: '75%', workspace: workspace1, author: author1
            },
            {
                id: '3', title: 'Test 3', score: '90%', workspace: workspace1, author: author1
            },
        ]);
    }

    getQuizDetails(workspaceId: any, quizId: any): Promise<QuizDetails> {
        const workspace1 = {id: 'semestr1', displayName: 'Semestr 1'};
        const author1 = {id: '1', displayName: 'Krzysztof Usnarski', email: "abc@gmail.com"}
        return Promise.resolve({
            id: 'agh_sieci_komputerowe_lab_1',
            title: 'Sieci komputerowe - lab 1',
            workspace: workspace1,
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
            author: author1,
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

    putBoardNotePageUpdate(workspaceId: string, noteId: string, pageNumber: number, version: number, content: BoardNotePageContent) {
        return Promise.resolve();
    }

    createNewNote(note: NoteCreateDetails): Promise<NoteSummary> {
        return Promise.resolve({} as NoteSummary);
    }

    getNoteDetails(workspaceId: string, noteId: string): Promise<NoteSummary> {
        return Promise.resolve({} as NoteSummary);
    }

    getBoardPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<BoardNotePageContentWithVersion> {
        return Promise.resolve({} as BoardNotePageContentWithVersion);
    }

    createNewWorkspace(title: string): Promise<Workspace> {
        return Promise.resolve({
            id: '123',
            displayName: title,
        });
    }

    createNewQuiz(quiz: QuizCreateDetails): Promise<QuizSummary> {
        return Promise.resolve({} as QuizSummary);
    }

    getDocumentPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<DocumentNotePageContentWithVersion> {
        return Promise.resolve({} as DocumentNotePageContentWithVersion);
    }

    putDocumentNotePageUpdate(workspaceId: string, noteId: string, pageNumber: number, version: number, content: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    registerUser(email: string, displayName: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    addUserPermission(resourceType: ResourceType, resourceId: string, userId: string, level: UserPermissionLevel): Promise<void> {
        return Promise.resolve(undefined);
    }

    editUserPermission(resourceType: ResourceType, resourceId: string, userId: string, level: UserPermissionLevel): Promise<void> {
        return Promise.resolve(undefined);
    }

    getFullPermissionModel(resourceType: ResourceType, resourceId: string): Promise<FullPermissionModel> {
        return Promise.resolve([]);
    }

    removeUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    searchUsers(email: string, displayName: string): Promise<User[]> {
        return Promise.resolve([]);
    }

    getUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<UserPermission> {
        return Promise.resolve({} as UserPermission);
    }

    getNotesWithinWorkspace(workspaceId: string): Promise<NoteSummary[]> {
        return Promise.resolve([]);
    }

    getQuizzesWithinWorkspace(workspaceId: string): Promise<QuizSummary[]> {
        return Promise.resolve([]);
    }

    getWorkspace(workspaceId: string): Promise<Workspace> {
        return Promise.resolve(undefined);
    }

    getAllNotes(): Promise<NoteSummary[]> {
        return Promise.resolve([]);
    }

    getAllQuizzes(): Promise<QuizSummary[]> {
        return Promise.resolve([]);
    }

    getBoundNotes(quizId: string): Promise<NoteSummary[]> {
        return Promise.resolve([]);
    }

    getBoundedQuizzes(noteId: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    updateResourcePermissionLevel(resourceType: ResourceType, resourceId: string, value: AccessType): Promise<void> {
        return Promise.resolve(undefined);
    }

    createNewBoardPage(workspaceId: string, noteId: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    createNewDocumentPage(workspaceId: string, noteId: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}

type TokenSupplier = () => Promise<string | null>;

class RealHttpClient implements HttpClientBase {
    private baseUrl: string;
    private tokenSupplier: TokenSupplier;

    constructor(baseUrl: string, tokenSupplier: TokenSupplier) {
        this.baseUrl = baseUrl;
        this.tokenSupplier = tokenSupplier;
    }

    getQuizDetails(workspaceId: string, quizId: string): Promise<QuizDetails> {
        return this.get(`/quizzes/${quizId}/details`)
    }

    getQuizQuestions(quizId: string): Promise<Question[]> {
        return this.get(`/quizzes/${quizId}/questions`)
            .then((questions: any[]) => {
                return questions.map(this.fromGenericQuestion);
            })
    }

    getRecentNotes(): Promise<NoteSummary[]> {
        return this.get('/notes/recent');
    }

    getRecentQuizzes(): Promise<QuizSummary[]> {
        return this.get('/quizzes/recent');
    }

    getWorkspaces(): Promise<Workspace[]> {
        return this.get('/workspaces');
    }

    putBoardNotePageUpdate(workspaceId: string, noteId: string, pageNumber: number, version: number, content: BoardNotePageContent): Promise<void> {
        return this.put(`/notes/${noteId}/board/pages/${pageNumber}`, {version: version, content: JSON.stringify(content)});
    }

    putDocumentNotePageUpdate(workspaceId: string, noteId: string, pageNumber: number, version: number, content: string): Promise<void> {
        return this.put(`/notes/${noteId}/document/pages/${pageNumber}`, {content: content, version: version});
    }

    createNewNote(note: NoteCreateDetails): Promise<NoteSummary> {
        return this.post('/notes', note);
    }

    getNoteDetails(workspaceId: string, noteId: string): Promise<NoteSummary> {
        return this.get(`/notes/${noteId}`);
    }

    getBoardPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<BoardNotePageContentWithVersion> {
        return this.get(`/notes/${noteId}/board/pages/${pageNumber}`).then(res => {
            return {
                content: res.content ? JSON.parse(res.content) : {},
                version: res.version
            } as BoardNotePageContentWithVersion
        });
    }

    getDocumentPageContent(workspaceId: string, noteId: string, pageNumber: number): Promise<DocumentNotePageContentWithVersion> {
        return this.get(`/notes/${noteId}/document/pages/${pageNumber}`).then(res => {
            return {
                content: res.content ? JSON.parse(res.content) : undefined,
                version: res.version
            } as DocumentNotePageContentWithVersion
        });
    }

    createNewWorkspace(title: string, resourceAccessTypeDto: string) {
        return this.post('/workspaces', {displayName: title, resourceAccessTypeDto: resourceAccessTypeDto});
    }

    createNewQuiz(quiz: QuizCreateDetails): Promise<QuizSummary> {
        return this.post('/quizzes', quiz);
    }

    updateQuestion(quizId: string, editableQuestion: Question) {
        return this.put(`/quizzes/${quizId}/questions/${editableQuestion.questionId}`, this.asGenericQuestion(editableQuestion));
    }

    updateQuizResult(quizId: string, correct: number, incorrect: number) {
        return this.put(`/quizzes/${quizId}/results`, this.asEditableQuestion(correct, incorrect));
    }

    saveQuestion(quizId: string, editableQuestion: Question) {
        return this.post(`/quizzes/${quizId}/questions`, [
            this.asGenericQuestion(editableQuestion)
        ]).then((response: any) => {
            return this.fromGenericQuestion(response[0])
        });
    }

    getBoundedQuizzes(noteId: string) {
        return this.get(`/bindings/notes/${noteId}`);
    }

    createNewBinding(quizId: string, noteId: string): Promise<any> {
        return this.post(`/bindings`, {
            quizId,
            noteId
        });
    }

    registerUser(email: string, displayName: string): Promise<void> {
        return this.post('/users', {email, displayName});
    }

    addUserPermission(resourceType: ResourceType, resourceId: string, userId: string, level: UserPermissionLevel): Promise<void> {
        return this.post(`/permissions/resources/${resourceType}/${resourceId}/users`, {
            "accessTypeDto": level,
            "userId": userId
        });
    }

    editUserPermission(resourceType: ResourceType, resourceId: string, userId: string, level: UserPermissionLevel): Promise<void> {
        return this.put(`/permissions/resources/${resourceType}/${resourceId}/users/${userId}`, {
            "accessTypeDto": level,
        });
    }

    getFullPermissionModel(resourceType: ResourceType, resourceId: string): Promise<FullPermissionModel> {
        return this.get(`/permissions/resources/${resourceType}/${resourceId}`);
    }

    removeUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<void> {
        return this.delete(`/permissions/resources/${resourceType}/${resourceId}/users/${userId}`).then(() => {
        });
    }

    searchUsers(email: string, displayName: string): Promise<User[]> {
        return this.get(`/users?email=${email}&displayName=${displayName}`);
    }

    getUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<UserPermission> {
        return this.get(`/permissions/resources/${resourceType}/${resourceId}/users/${userId}`);
    }

    getNotesWithinWorkspace(workspaceId: string): Promise<NoteSummary[]> {
        return this.get(`/notes?workspaceId=${workspaceId}`);
    }

    getQuizzesWithinWorkspace(workspaceId: string): Promise<QuizSummary[]> {
        return this.get(`/quizzes?workspaceId=${workspaceId}`);
    }

    getWorkspace(workspaceId: string): Promise<Workspace> {
        return this.get(`/workspaces/${workspaceId}`);
    }

    getAllNotes(): Promise<NoteSummary[]> {
        return this.get(`/notes`);
    }
    getAllQuizzes(): Promise<QuizSummary[]> {
        return this.get(`/quizzes`);
    }

    getBoundNotes(quizId: string): Promise<NoteSummary[]> {
        return this.get(`/bindings/quizzes/${quizId}`);
    }

    createNewBoardPage(workspaceId: string, noteId: string): Promise<void> {
        return this.post(`/notes/${noteId}/board/pages`, {}, true);
    }

    createNewDocumentPage(workspaceId: string, noteId: string): Promise<void> {
        return this.post(`/notes/${noteId}/document/pages`, {}, true);
    }

    updateResourcePermissionLevel(resourceType: ResourceType, resourceId: string, value: AccessType) {
        return this.put(`/permissions/resources/${resourceType}/${resourceId}`, {accessType: value});
    }

    private asGenericQuestion(question: Question): any {
        const answer = question.type === 'single-choice' ?
            question.answer.toString() :
            question.answer.map((val: boolean) => val.toString()).join("\u001f");
        return {
            question: question.question,
            type: question.type,
            weight: question.weight,
            choices: question.choices.join("\u001f"),
            otherProperties: answer,
            feedback: question.feedback.join('\u001f'),
        };
    }

    private fromGenericQuestion(question: any) {
        let answer = null;
        if (question.type === 'single-choice') {
            // how to convert string to number
            answer = parseInt(question.otherProperties);
        } else if (question.type === 'multiple-choice') {
            answer = question.otherProperties.split('\u001f').map((val: string) => val === 'true');
        }
        return {
            questionId: question.questionId,
            question: question.question,
            type: question.type,
            weight: question.weight,
            choices: question.choices.split('\u001f'),
            answer: answer,
            feedback: question.feedback.split('\u001f'),
        };
    }

    private asEditableQuestion(correct: number, incorrect: number) {
        return {
            correct: correct,
            incorrect: incorrect
        }
    }


    private async get(path: string): Promise<any> {
        const token = await this.tokenSupplier();  // Get the token from tokenSupplier

        return fetch(`${this.baseUrl}/api/v1${path}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Attach the token here
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json());
    }

    private async post(path: string, body: any, expectEmptyResponse: boolean = false) {
        const token = await this.tokenSupplier();  // Get the token from tokenSupplier

        return fetch(`${this.baseUrl}/api/v1${path}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  // Attach the token here
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(response => expectEmptyResponse ? response : response.json());
    }

    private async put(path: string, body: any) {
        const token = await this.tokenSupplier();  // Get the token from tokenSupplier

        return fetch(`${this.baseUrl}/api/v1${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,  // Attach the token here
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(response => response.json());
    }

    private async delete(path: string) {
        const token = await this.tokenSupplier();  // Get the token from tokenSupplier

        return fetch(`${this.baseUrl}/api/v1${path}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,  // Attach the token here
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }
}

/** Hook to provide an instance of the HTTP client */
export const useHttpClient = () => {
    const {user, getToken} = useAuth();  // Get the authenticated user from context

    // TokenSupplier function that retrieves the token each time
    const tokenSupplier: TokenSupplier = async () => {
        return await getToken() // Get ID token from Firebase user
    };

    return useMemo(() => {
        return new RealHttpClient("http://localhost:8080", tokenSupplier);
    }, [user]);
};