/** Interface representing the structure of a quiz */
export interface QuizDetails {
    /** The unique ID of quiz */
    id: string;
    /** The name of quiz */
    name: string;
    /** Description of the quiz */
    description: string;
    /** Number of exercises in the quiz */
    numberOfExercises: number;
    /** Last score details for the quiz */
    lastScore: QuizSimpleResult;
}

/** Interface representing the structure of the last score */
export interface QuizSimpleResult {
    /** Number of incorrect answers */
    incorrect: number;
    /** Number of correct answers */
    correct: number;
    /** Number of unanswered questions */
    unanswered: number;
}