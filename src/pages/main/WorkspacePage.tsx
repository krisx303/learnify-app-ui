import React, {useContext, useEffect, useState} from 'react';
import {ImageBackground, useWindowDimensions, View} from 'react-native';
import {Title} from 'react-native-paper';
import styles from './MainPage.scss';
import NoteCard from './NoteCard';
import QuizCard from './QuizCard';
import TopBar from './TopBar';
import {useHttpClient} from '../../transport/HttpClient';
import {NoteSummary, QuizSummary, Workspace} from './Types';
import {RootStackParamList} from "../../../App";
import {RouteProp, useRoute} from "@react-navigation/native";
import DrawerProvider, {DrawerContext} from "../notes/DrawerProvider";
import AuthorizedResource from "../AuthorizedResource";
import WorkspaceDrawer from "../notes/WorkspaceDrawer";
import {useAuth} from "../auth/AuthProvider";

type RouteProps = RouteProp<RootStackParamList, 'WorkspacePage'>

const WorkspacePage = ({workspaceId}: {workspaceId: string}) => {
    const {width: windowWidth} = useWindowDimensions();
    const httpClient = useHttpClient();
    const [workspaceDetails, setWorkspaceDetails] = useState<Workspace | undefined>(undefined);
    const [notes, setNotes] = useState<NoteSummary[]>([]);
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const { toggleDrawer, setDrawerContent, drawerVisible } = useContext(DrawerContext);
    const { user } = useAuth();

    useEffect(() => {
        setDrawerContent(
            <WorkspaceDrawer
                workspaceId={workspaceId}
                onClose={toggleDrawer}
                isOwner={workspaceDetails?.author.id === user?.uid}
                ownerId={workspaceDetails?.author.id ?? ""}
            />);
    }, [drawerVisible]);

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
            .then(setWorkspaceDetails)
            .catch(console.error);
    }, [httpClient, workspaceId]);

    return (
        <>
            <TopBar
                text={workspaceDetails?.displayName}
                withAdvancedMenu={workspaceDetails?.author.id === user?.uid}
                optionsButtonText="Options"
                onAdvancedMenuPress={toggleDrawer}
            />
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
        </>
    );
};

const WorkspacePageWrapper: React.FC = () => {
    const route = useRoute<RouteProps>();
    const {workspaceId} = route.params;

    return <ImageBackground style={{flex: 1, width: "100%"}} source={require("../../../assets/purple_background.png")}
                            imageStyle={{resizeMode: "cover"}}>
        <DrawerProvider>
            <AuthorizedResource resourceId={workspaceId} resourceType="WORKSPACE">
                <WorkspacePage workspaceId={workspaceId}/>
            </AuthorizedResource>
        </DrawerProvider>
    </ImageBackground>
}

export default WorkspacePageWrapper;
