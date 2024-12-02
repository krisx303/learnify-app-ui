import {RouteProp, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, ImageBackground, Text, View} from "react-native";
import PieChart from "react-native-pie-chart";
import {Button, IconButton} from "react-native-paper";
import styles from './QuizPage.scss';
import {Question} from "../solving/Question";
import {QuizDetails} from "./QuizDetails";
import {useHttpClient} from "../../../transport/HttpClient";
import {RootStackParamList} from "../../../../App";
import {StackNavigationProp} from "@react-navigation/stack";
import DrawerProvider, {DrawerContext} from "../../notes/DrawerProvider";
import AuthorizedResource from "../../AuthorizedResource";
import QuizDrawer from "../../notes/QuizDrawer";
import {useAuth} from "../../auth/AuthProvider";
import {ModularTopBar, OptionsButtons, UserDetailsWithMenu} from "../../../components/topbar";
import {isDisabled} from "@expo/metro-runtime/build/error-overlay/Data/LogBoxData";


type NavigationProps = StackNavigationProp<RootStackParamList, 'QuizPage'>;
type RouteProps = RouteProp<RootStackParamList, 'QuizPage'>;


const QuizPage = ({quizId, workspaceId}: { quizId: string, workspaceId: string }) => {
    const [quiz, setQuizDetails] = useState<QuizDetails | undefined>();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]);
    const httpClient = useHttpClient();
    const navigation = useNavigation<NavigationProps>();
    const {toggleDrawer, setDrawerContent, drawerVisible} = useContext(DrawerContext);
    const {user} = useAuth();

    useEffect(() => {
        setDrawerContent(
            <QuizDrawer
                quizId={quizId}
                onClose={toggleDrawer}
                navigateToNote={(workspaceId, noteId, noteType) => {
                    if (noteType === 'document') {
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
        }, [httpClient.getQuizDetails])
    );

    const asPercentage = (num: number) => {
        const percentage = (num / (quiz!!.numberOfQuestions)) * 100;
        return parseFloat(percentage.toFixed(2));
    };

    const navigateToEditor = () => {
        navigation.navigate("QuizEditor", {quizId, workspaceId})
    };

    const QuizDetailsContent = ({quiz}: { quiz: QuizDetails }) => {
        const navigateToQuestionScreen = () => {
            navigation.navigate("QuestionsScreen", {
                quizId: quizId,
                questions: questions,
                quiz: quiz,
                previouslyCorrect: 0
            });
        };
        const navigateToOnlyIncorrectQuestionScreen = () => {
            navigation.navigate("QuestionsScreen", {
                quizId: quizId,
                questions: incorrectQuestions,
                quiz: quiz,
                previouslyCorrect: quiz.bestScore.correct
            });
        };
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
                <Button style={styles.button} onPress={navigateToQuestionScreen}>
                    <Text style={styles.buttonText}>Start quiz</Text>
                </Button>
                <Button disabled={incorrectQuestions.length == 0}
                        style={incorrectQuestions.length == 0 ? styles.incorrectButtonDisabled : styles.incorrectButton}
                        onPress={navigateToOnlyIncorrectQuestionScreen}>
                    <Text style={styles.buttonText}>Repeat only incorrect</Text>
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
        {loading ? (
            <ActivityIndicator size="large" color="#fff" style={styles.spinner}/>
        ) : quiz && quiz.id === undefined ? (
            <Text style={styles.error}>Error loading quiz details</Text>
        ) : (
            <QuizDetailsContent quiz={quiz!!}/>
        )}
    </>
};


const QuizPageWrapper: React.FC = () => {
    const route = useRoute<RouteProps>();
    const {workspaceId, quizId} = route.params;

    return (
        <ImageBackground style={{flex: 1, width: "100%"}} source={require("../../../../assets/purple_background.png")}
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