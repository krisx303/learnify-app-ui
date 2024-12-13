import {RouteProp, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, ImageBackground, Text, View, StyleSheet} from "react-native";
import PieChart from "react-native-pie-chart";
import {Button, IconButton} from "react-native-paper";
import {Question} from "../solving/Question";
import {QuizDetails} from "./QuizDetails";
import {useHttpClient} from "../../../transport/HttpClient";
import {RootStackParamList} from "../../../../App";
import {StackNavigationProp} from "@react-navigation/stack";
import DrawerProvider, {DrawerContext} from "../../../components/drawer/DrawerProvider";
import QuizDrawer from "../../../components/drawer/QuizDrawer";
import {useAuth} from "../../../components/auth/AuthProvider";
import {ModularTopBar, OptionsButtons, UserDetailsWithMenu} from "../../../components/topbar";
import AuthorizedResource from "../../../components/AuthorizedResource";
import StartQuizModal, {StartQuizDetails} from "../../../components/modals/StartQuizModal";

type NavigationProps = StackNavigationProp<RootStackParamList, 'QuizPage'>;
type RouteProps = RouteProp<RootStackParamList, 'QuizPage'>;

const DEFAULT_START_OPTIONS: StartQuizDetails = {
    shuffleQuestions: false,
    shuffleAnswers: false,
    repeatOnFailure: false,
    repeatOnlyFailedQuestions: false,
};

function shuffle(array: any[]) {
    array.sort(() => Math.random() - 0.5);
}

export function shuffleAnswers(questions: Question[]): Question[] {
    return questions.map((question) => {
        if (question.type === "multiple-choice") {
            // Combine choices, answers, and feedback into a single array
            const combined = question.choices.map((choice, index) => ({
                choice,
                answer: question.answer[index],
                feedback: question.feedback[index],
            }));

            shuffle(combined);

            const shuffledChoices = combined.map(item => item.choice);
            const shuffledAnswers = combined.map(item => item.answer);
            const shuffledFeedback = combined.map(item => item.feedback);

            return {
                ...question,
                choices: shuffledChoices,
                answer: shuffledAnswers,
                feedback: shuffledFeedback,
            };
        }
        else if (question.type === "single-choice") {
            // Combine choices and feedback into a single array
            const combined = question.choices.map((choice, index) => ({
                choice,
                feedback: question.feedback[index],
                isAnswer: index === question.answer,
            }));

            shuffle(combined);

            const shuffledChoices = combined.map(item => item.choice);
            const shuffledFeedback = combined.map(item => item.feedback);
            const newAnswerIndex = combined.findIndex(item => item.isAnswer);

            return {
                ...question,
                choices: shuffledChoices,
                feedback: shuffledFeedback,
                answer: newAnswerIndex,
            };
        }
        return question;
    });
}


const QuizPage = ({quizId, workspaceId}: { quizId: string, workspaceId: string }) => {
    const [quiz, setQuizDetails] = useState<QuizDetails | undefined>();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]);
    const httpClient = useHttpClient();
    const navigation = useNavigation<NavigationProps>();
    const {toggleDrawer, setDrawerContent, drawerVisible} = useContext(DrawerContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {user} = useAuth();

    useEffect(() => {
        setDrawerContent(
            <QuizDrawer
                quizId={quizId}
                onClose={toggleDrawer}
                navigateToNote={(workspaceId, noteId, noteType) => {
                    if (noteType === 'DOCUMENT') {
                        navigation.navigate('DocumentNotePage', {noteId, workspaceId});
                    } else {
                        navigation.navigate('BoardNotePage', {noteId, workspaceId});
                    }
                }}
                isOwner={quiz?.author.id === user?.uid}
                ownerId={quiz?.author.id ?? ""}
            />);
    }, [drawerVisible]);

    useEffect(() => {
        httpClient.getQuizDetails(workspaceId, quizId)
            .then(onLoadedDetails)
            .catch(console.error);
        httpClient.getQuizQuestions(quizId)
            .then(setQuestions)
            .catch(console.error);
        httpClient.getIncorrectQuizQuestions(quizId)
            .then(setIncorrectQuestions)
            .catch(console.error);
    }, [httpClient, workspaceId, quizId]);

    useEffect(() => {
        if (quiz != undefined) {
            setLoading(false);
        }
    }, [quiz, questions]);

    const onLoadedDetails = (quizDetails: QuizDetails) => {
        setQuizDetails(quizDetails);
    }

    useFocusEffect(
        React.useCallback(() => {
            httpClient.getQuizDetails(workspaceId, quizId)
                .then(onLoadedDetails)
                .catch(console.error);
            httpClient.getIncorrectQuizQuestions(quizId)
                .then(setIncorrectQuestions)
                .catch(console.error);
        }, [httpClient.getQuizDetails])
    );

    const asPercentage = (num: number) => {
        const percentage = (num / (quiz!!.numberOfQuestions)) * 100;
        return parseFloat(percentage.toFixed(2));
    };

    const navigateToEditor = () => {
        navigation.navigate("QuizEditor", {quizId, workspaceId})
    };

    const navigateToQuestionsScreenWithOptions = (options: StartQuizDetails) => {
        const quizDetails = quiz!!;
        const questionsToUse = options.repeatOnlyFailedQuestions ? incorrectQuestions : questions;
        const previouslyCorrect = options.repeatOnlyFailedQuestions ? quizDetails.lastScore.correct : 0;
        if (options.shuffleQuestions) {
            shuffle(questionsToUse);
        }
        const shuffledAnswers = options.shuffleAnswers ? shuffleAnswers(questionsToUse) : questionsToUse;
        navigation.navigate("QuestionsScreen", {
            quizId: quizId,
            questions: shuffledAnswers,
            quiz: quizDetails,
            previouslyCorrect: previouslyCorrect,
            options: options
        });
    };

    const QuizDetailsContent = ({quiz}: { quiz: QuizDetails }) => {
        return (
            <View style={styles.container2}>
                <View style={styles.row}>
                    <Text style={styles.title}>{quiz.title}</Text>
                    <IconButton icon={"pencil"} size={30} iconColor="white" onPress={navigateToEditor}/>
                </View>
                <Text style={styles.description}>{quiz.description}</Text>
                <Text style={styles.info}>Number of questions: {quiz.numberOfQuestions} </Text>
                <Text style={styles.info}>Best
                    result: {quiz.bestScore == null ? "0" : asPercentage(quiz.bestScore.correct)}% </Text>
                <Text style={styles.subtitle}>Last score</Text>
                {quiz.lastScore ? (
                    <View style={styles.chartContainer}>
                        <PieChart
                            widthAndHeight={250}
                            series={[quiz.lastScore.correct, quiz.lastScore.incorrect]}
                            sliceColor={["#109e16", "#ff3c00"]}
                            coverRadius={0.5}
                            coverFill={"#FFF"}
                        />
                        <View style={styles.percentageContainer}>
                            <Text
                                style={[styles.percentageText, {color: "#109e16"}]}>Correct: {asPercentage(quiz.lastScore.correct)}%</Text>
                            <Text
                                style={[styles.percentageText, {color: "#ff3c00"}]}>Incorrect: {asPercentage(quiz.lastScore.incorrect)}%</Text>
                        </View>
                    </View>
                ) : <Text style={styles.info}>No data available</Text>}
                <Button style={styles.button} onPress={() => {navigateToQuestionsScreenWithOptions(DEFAULT_START_OPTIONS)}}>
                    <Text style={styles.buttonText}>Start quiz</Text>
                </Button>
                <Button style={styles.button} onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.buttonText}>Start quiz with options</Text>
                </Button>
            </View>
        );
    }

    return <>
        <ModularTopBar
            breadcrumbs={[
                {
                    text: quiz?.workspace.displayName ?? "Workspace",
                    onPress: () => navigation.navigate('WorkspacePage', {workspaceId})
                },
                {text: quiz?.title ?? "Quiz"}
            ]}
            rightContent={
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <OptionsButtons onPress={toggleDrawer}/>
                    <UserDetailsWithMenu/>
                </View>
            }
        />
        <StartQuizModal repeatOnlyFailedQuestionsPossible={incorrectQuestions.length != 0}
                        isVisible={isModalVisible}
                        onClose={() => {setIsModalVisible(false)}}
                        onSubmit={navigateToQuestionsScreenWithOptions}
        />
        {loading ? (
            <ActivityIndicator size="large" color="#fff" style={styles.spinner}/>
        ) : quiz && quiz.id === undefined ? (
            <Text style={styles.error}>Error loading quiz details</Text>
        ) : (
            <QuizDetailsContent quiz={quiz!!}/>
        )}
    </>
};

const styles = StyleSheet.create({
    error: {
        color: "white",
    },
    button: {
        backgroundColor: "white",
        marginTop: 20,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: "#590d82",
        fontSize: 20,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 28,
        marginTop: 10,
        marginBottom: 10,
        color: "white",
    },
    percentageText: {
        fontSize: 18,
    },
    percentageContainer: {
        flexDirection: "column",
        marginTop: 30,
    },
    chartContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 30,
    },
    description: {
        fontSize: 22,
        color: "white",
    },
    info: {
        fontSize: 18,
        color: "white",
        marginVertical: 10
    },

    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    title: {
        fontSize: 33,
        fontWeight: "bold",
        marginBottom: 10,
        color: "white",
    },
    container2: {
        flex: 1,
        padding: 30,
        alignItems: "center",
    },
    container: {
        width: "100%",
        height: "100%",
    },
    spinner: {
        marginTop: 100,
    },
    content: {
        flex: 1,
        padding: 40,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
});


const QuizPageWrapper: React.FC = () => {
    const route = useRoute<RouteProps>();
    const {workspaceId, quizId} = route.params;

    return (
        <ImageBackground style={{flex: 1, width: "100%", height: "100%"}} source={require("../../../../assets/purple_background.png")}
                         imageStyle={{resizeMode: "cover"}}>
            <DrawerProvider>
                <AuthorizedResource resourceId={quizId} resourceType="QUIZ">
                    <QuizPage quizId={quizId} workspaceId={workspaceId}/>
                </AuthorizedResource>
            </DrawerProvider>
        </ImageBackground>
    );
};


export default QuizPageWrapper;