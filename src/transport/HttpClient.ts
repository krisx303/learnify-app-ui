import { useMemo } from "react";
import {QuizInfo} from "../models/QuizInfo";
import {Question} from "../models/Question";

/** Abstract class or interface representing an HTTP client */
abstract class HttpClientBase {
    /** Returns the list of available quizzes */
    abstract getListOfQuizzes(): Promise<QuizInfo[]>;

    /** Returns the list of questions for given quiz */
    abstract getQuizQuestions(quizId: string): Promise<Question[]>;
}

/** Concrete implementation of the HTTP client (can be swapped with other implementations) */
class RealHttpClient extends HttpClientBase {
    getListOfQuizzes(): Promise<QuizInfo[]> {
        return new Promise((resolve) => {
            resolve([
                {
                    id: "agh_sieci_komputerowe_lab_1",
                    name: "Sieci komputerowe - lab 1",
                    description: "Warstwy modelu OSI/ISO",
                    numberOfExercises: 20,
                    lastScore: {
                        incorrect: 5,
                        correct: 5,
                        unanswered: 10,
                    },
                },
                {
                    id: "agh_tw_egzamin",
                    name: "Egzamin z TW",
                    description: "Zestaw pytań na egzamin (Drill)",
                    numberOfExercises: 10,
                    lastScore: {
                        incorrect: 0,
                        correct: 9,
                        unanswered: 1
                    }
                }
            ]);
        });
    }

    getQuizQuestions(quizId: string): Promise<Question[]> {
        return new Promise((resolve) => resolve([
            {
                question: "Posortuj warstwy modelu OSI/ISO (od dołu do góry)",
                type: "sort",
                weight: 1,
                answer: [
                    "Warstwa aplikacji",
                    "Wartswa prezentacji",
                    "Warstwa sesji",
                    "Warstwa sieciowa",
                    "Warstwa transportowa",
                    "Warstwa łącza danych",
                    "Warstwa fizyczna",
                ],
            },
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
        ]));
    }
}

/** Hook to provide an instance of the HTTP client */
export const useHttpClient = () => useMemo(() => new RealHttpClient(), []);
