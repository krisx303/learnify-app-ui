/** Represents a multiple-choice question. */
export type MultipleChoiceQuestion = {
    /** The unique identifier of the question. */
    questionId?: string | undefined;
    /** The textual content of the question. */
    question: string;
    /** The type of the question, indicating it's a "multiple-choice" type. */
    type: "multiple-choice";
    /** The weight/importance of the question. */
    weight: number;
    /** The available choices for the question. */
    choices: string[];
    /** The correct answers represented as an array of booleans. */
    answer: boolean[];
    /** Feedback for each choice, explaining why it is correct or incorrect. */
    feedback: string[];
};

export type SingleChoiceQuestion = {
    /** The unique identifier of the question. */
    questionId?: string | undefined;
    /** The textual content of the question. */
    question: string;
    /** The type of the question, indicating it's a "single-choice" type. */
    type: "single-choice";
    /** The weight/importance of the question. */
    weight: number;
    /** The available choices for the question. */
    choices: string[];
    /** Index of the correct answer **/
    answer: number;
    /** Feedback for each choice, explaining why it is correct or incorrect. */
    feedback: string[];
};


/** Generic type of question */
export type Question = MultipleChoiceQuestion | SingleChoiceQuestion;