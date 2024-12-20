import {useMemo} from "react";
import {
    AccessType, DetailedWorkspace,
    FullPermissionModel,
    NoteSummary, NoteType,
    QuizSummary,
    ResourceType,
    User, UserPermission,
    UserPermissionLevel,
    Workspace
} from "../pages/main/Types";
import {QuizDetails} from "../pages/quiz/summmary/QuizDetails";
import {Question} from "../pages/quiz/solving/Question";
import {NoteCreateDetails} from "../components/modals/CreateNoteModal";
import {QuizCreateDetails} from "../components/modals/CreateQuizModal";
import {ElementType, Position} from "../components/notes/board/types";
import {useAuth} from "../components/auth/AuthProvider";

export type PathDto = { strokeWidth: number; path: string; color: string; blendMode: string };
export type ElementDto = { width: number; id: string; position: Position; content: string; height: number; type: ElementType };
type BoardNotePageContent = { elements: ElementDto[]; paths: PathDto[] };
type BoardNotePageContentWithVersion = { content: BoardNotePageContent; version: number };
type DocumentNotePageContentWithVersion = { content: string; version: number };
export type PermissionDto = { user: User; access: string }
export type RatingStats = { average: number; count: number; };
export type ResourceSummary = {
    viewedAt? : string;
    lastTryDate? : string;
    id: string;
    title: string;
    description: string;
    workspace: Workspace;
    author: User;
    resourceType: ResourceType;
    accessType: AccessType;
    pagesCount?: number;
    score?: string;
    type?: NoteType;
    ratingStats: RatingStats;
}

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

    createNewWorkspace(title: string, resourceAccessTypeDto: string, parentWorkspaceId: string | undefined): Promise<Workspace>;

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

    getIncorrectQuizQuestions(quizId: string): Promise<Question[]> {
        return this.get(`/quizzes/${quizId}/questions/incorrect`)
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

    createNewWorkspace(title: string, resourceAccessTypeDto: string, parentWorkspaceId: string | undefined): Promise<Workspace> {
        return this.post('/workspaces', {displayName: title, resourceAccessTypeDto: resourceAccessTypeDto, parentWorkspaceId: parentWorkspaceId});
    }

    createNewQuiz(quiz: QuizCreateDetails): Promise<QuizSummary> {
        return this.post('/quizzes', quiz);
    }

    updateQuestion(quizId: string, editableQuestion: Question) {
        return this.put(`/quizzes/${quizId}/questions/${editableQuestion.questionId}`, this.asGenericQuestion(editableQuestion));
    }

    updateQuizResult(quizId: string, correct: number, incorrect: number, incorrectIds: string[]) {
        return this.put(`/quizzes/${quizId}/results`, this.asEditableQuestion(correct, incorrect, incorrectIds));
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
        return this.post(`/resources/${resourceType}/${resourceId}/permissions/users`, {
            "accessTypeDto": level,
            "userId": userId
        });
    }

    editUserPermission(resourceType: ResourceType, resourceId: string, userId: string, level: UserPermissionLevel): Promise<void> {
        return this.put(`/resources/${resourceType}/${resourceId}/permissions/users/${userId}`, {
            "accessTypeDto": level,
        });
    }

    getFullPermissionModel(resourceType: ResourceType, resourceId: string): Promise<FullPermissionModel> {
        return this.get(`/resources/${resourceType}/${resourceId}/permissions`);
    }

    removeUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<void> {
        return this.delete(`/resources/${resourceType}/${resourceId}/permissions/users/${userId}`).then(() => {
        });
    }

    searchUsers(email: string, displayName: string): Promise<User[]> {
        return this.get(`/users?email=${email}&displayName=${displayName}`);
    }

    getUserPermission(resourceType: ResourceType, resourceId: string, userId: string): Promise<UserPermission> {
        return this.get(`/resources/${resourceType}/${resourceId}/permissions/users/${userId}`);
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
        return this.put(`/resources/${resourceType}/${resourceId}/permissions`, {accessType: value});
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

    private asEditableQuestion(correct: number, incorrect: number, incorrectIds: string[]) {
        return {
            correct: correct,
            incorrect: incorrect,
            incorrectIds: incorrectIds
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

    getComments(resourceType: ResourceType, resourceId: string) {
        return this.get(`/resources/${resourceType}/${resourceId}/comments`);
    }

    addComment(resourceType: ResourceType, resourceId: string, comment: any) {
        return this.post(`/resources/${resourceType}/${resourceId}/comments`, comment);
    }

    searchNotes(resourceName: string, selectedOwner: string | undefined, selectedWorkspace: string | undefined, isPublic: boolean | undefined, averageRating: number): Promise<NoteSummary[]> {
        let query = `?name=${resourceName}&averageRating=${averageRating}`;

        if (selectedWorkspace) {
            query += `&workspaceId=${selectedWorkspace}`;
        }

        if (selectedOwner) {
            query += `&ownerId=${selectedOwner}`;
        }

        if (isPublic !== undefined) {
            query += `&accessType=${isPublic ? 'PUBLIC' : 'PRIVATE'}`;
        }

        return this.get(`/notes${query}`);
    }

    searchQuizzes(resourceName: string, selectedOwner: string | undefined, selectedWorkspace: string | undefined, isPublic: boolean | undefined, averageRating: number): Promise<QuizSummary[]> {
        let query = `?name=${resourceName}&averageRating=${averageRating}`;

        if (selectedWorkspace) {
            query += `&workspaceId=${selectedWorkspace}`;
        }

        if (selectedOwner) {
            query += `&ownerId=${selectedOwner}`;
        }

        if (isPublic !== undefined) {
            query += `&accessType=${isPublic ? 'PUBLIC' : 'PRIVATE'}`;
        }

        return this.get(`/quizzes${query}`);
    }

    searchResources(
        resourceType: string | undefined,
        resourceName: string,
        ownerId: string | undefined,
        workspaceId: string | undefined,
        isPublic: undefined | boolean,
        averageRating: number
    ): Promise<ResourceSummary[]> {
        const notePromise = resourceType === 'Note' || resourceType === undefined
            ? this.searchNotes(resourceName, ownerId, workspaceId, isPublic, averageRating)
            : Promise.resolve([]);  // Return an empty array if we are not searching for notes

        const quizPromise = resourceType === 'Quiz' || resourceType === undefined
            ? this.searchQuizzes(resourceName, ownerId, workspaceId, isPublic, averageRating)
            : Promise.resolve([]);  // Return an empty array if we are not searching for quizzes

        return Promise.all([notePromise, quizPromise])
            .then(([notes, quizzes]) => {
                const results = [
                    ...notes.map(note => ({ ...note, resourceType: 'NOTE' })),
                    ...quizzes.map(quiz => ({ ...quiz, resourceType: 'QUIZ' }))
                ];
                return results as ResourceSummary[];
            });
    }

    deleteQuestion(quizId: string, questionId: string) {
        return this.delete(`/quizzes/${quizId}/questions/${questionId}`);
    }

    getWorkspaceDetails(workspaceId: string): Promise<DetailedWorkspace> {
        return this.get(`/workspaces/${workspaceId}/details`);
    }

    getLeaderboard(quizId: string) {
        return this.get(`/quizzes/${quizId}/results?numberOfTopResults=10`);
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