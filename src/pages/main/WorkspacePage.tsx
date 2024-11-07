import React, {useEffect, useState} from 'react';
import {ImageBackground, useWindowDimensions, View} from 'react-native';
import {Title} from 'react-native-paper';
import styles from './MainPage.scss';
import NoteCard from './NoteCard';
import QuizCard from './QuizCard';
import TopBar from './TopBar';
import {useHttpClient} from '../../transport/HttpClient';
import {NoteSummary, QuizSummary} from './Types';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";

type NavigationProps = StackNavigationProp<RootStackParamList, 'WorkspacePage'>;
type RouteProps = RouteProp<RootStackParamList, 'WorkspacePage'>

const WorkspacePage = () => {
    const { width: windowWidth } = useWindowDimensions();
    const route = useRoute<RouteProps>();
    const {workspaceId} = route.params;
    const httpClient = useHttpClient();
    const [workspaceName, setWorkspaceName] = useState<string>('');
    const [notes, setNotes] = useState<NoteSummary[]>([]);
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const navigation = useNavigation<NavigationProps>();
    const fetchResources = () => {
        httpClient.getNotesWithinWorkspace(workspaceId)
            .then(setNotes)
            .catch(console.error);
        httpClient.getQuizzesWithinWorkspace(workspaceId)
            .then(setQuizzes)
            .catch(console.error);
    }

    useEffect(() => {
        fetchResources();
        httpClient.getWorkspace(workspaceId)
            .then(workspace => setWorkspaceName(workspace.displayName))
            .catch(console.error);
    }, [httpClient, workspaceId]);

    const navigateToQuizEditor = (quiz: QuizSummary) => {
        fetchResources();
        //TODO save base quiz details to backend
        navigation.navigate('QuizEditor', {quizId: quiz.id, workspaceId: quiz.workspace.id});
    };

    const navigateToNotePage = (parse: NoteSummary) => {
        fetchResources();
        if (parse.type === 'document') {
            navigation.navigate('DocumentNotePage', {noteId: parse.id, workspaceId: parse.workspace.id});
        }else if (parse.type === 'board') {
            navigation.navigate('BoardNotePage', {noteId: parse.id, workspaceId: parse.workspace.id});
        }
    }

    return (
        <ImageBackground style={{flex: 1, width: "100%"}} source={require("../../../assets/purple_background.png")} imageStyle={{resizeMode: "cover"}}>
            <TopBar text={workspaceName}/>
            <View style={windowWidth < 700 ? styles.contentVertical : styles.contentHorizontal}>
                <View style={windowWidth < 700 ? styles.sectionVertical : styles.sectionHorizontal}>
                    <Title style={styles.sectionTitle}>Notes</Title>
                    <View style={styles.cardContainer}>
                        {notes.map((note) => (
                            <NoteCard note={note} key={note.id}/>
                        ))}
                    </View>
                </View>
                <View style={windowWidth < 700 ? styles.sectionVertical : styles.sectionHorizontal}>
                    <Title style={styles.sectionTitle}>Tests</Title>
                    <View style={styles.cardContainer}>
                        {quizzes.map((quiz) => (
                            <QuizCard quiz={quiz} key={quiz.id}/>
                        ))}
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

export default WorkspacePage;
