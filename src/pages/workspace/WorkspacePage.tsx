import React, {useContext, useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Title} from 'react-native-paper';
import NoteCard from '../../components/main/NoteCard';
import QuizCard from '../../components/main/QuizCard';
import {useHttpClient} from '../../transport/HttpClient';
import {NoteSummary, QuizSummary, Workspace} from '../main/Types';
import {RootStackParamList} from "../../../App";
import {RouteProp, useRoute} from "@react-navigation/native";
import DrawerProvider, {DrawerContext} from "../../components/drawer/DrawerProvider";
import AuthorizedResource from "../../components/AuthorizedResource";
import WorkspaceDrawer from "../../components/drawer/WorkspaceDrawer";
import {useAuth} from "../auth/AuthProvider";
import {ModularTopBar, OptionsButtons, UserDetailsWithMenu} from "../../components/topbar";

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
            <ModularTopBar
                breadcrumbs={[{text: workspaceDetails?.displayName || "Workspace"}]}
                rightContent={
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <OptionsButtons onPress={toggleDrawer}/>
                        <UserDetailsWithMenu/>
                    </View>
                }
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginLeft: 40,
        color: '#fff',
    },
    sectionHorizontal: {
        marginBottom: 10,
        width: '50%',
    },
    sectionVertical: {
        marginBottom: 20,
        width: '100%',
    },
    cardContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    contentHorizontal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    contentVertical: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
})


export default WorkspacePageWrapper;
