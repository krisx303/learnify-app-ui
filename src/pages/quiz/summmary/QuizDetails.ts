import {User, Workspace} from "../../main/Types";

/** Interface representing the structure of a quiz */
export interface QuizDetails {
    /** The unique ID of quiz */
    id: string;
    /** The unique ID of workspace */
    workspace: Workspace;
    /** The name of quiz */
    title: string;
    /** Description of the quiz */
    description: string;
    /** Number of exercises in the quiz */
    numberOfQuestions: number;
    /** Last score details for the quiz */
    lastScore: QuizSimpleResult;
    /** Best score details for the quiz */
    bestScore: QuizSimpleResult;
    /** Author */
    author: User;
    /** Date of last try */
    lastTryDate: string;
}

/** Interface representing the structure of the last score */
export interface QuizSimpleResult {
    /** Number of incorrect answers */
    incorrect: number;
    /** Number of correct answers */
    correct: number;
}