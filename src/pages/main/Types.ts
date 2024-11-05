export type NoteType = 'document' | 'board';
export type AccessType = 'PUBLIC' | 'PRIVATE';
export type ResourceType = 'NOTE' | ' QUIZ' | 'WORKSPACE';
export type UserPermissionLevel = 'RO' | 'RW';
export type UserPermission = { user: User; accessLevel: UserPermissionLevel };
export type FullPermissionModel = {
    resourceType: ResourceType;
    resourceId: string;
    accessType: AccessType;
    permissions: UserPermission[]
};

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