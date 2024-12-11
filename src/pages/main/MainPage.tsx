import React, {useEffect, useState} from 'react';
import {ImageBackground, TouchableWithoutFeedback, useWindowDimensions, View, StyleSheet} from 'react-native';
import {Title} from 'react-native-paper';
import NoteCard from '../../components/main/NoteCard';
import QuizCard from '../../components/main/QuizCard';
import {useHttpClient} from '../../transport/HttpClient';
import {NoteSummary, QuizSummary} from './Types';
import CreateNoteModal, {NoteCreateDetails} from "../../components/modals/CreateNoteModal";
import CreateQuizModal, {QuizCreateDetails} from "../../components/modals/CreateQuizModal";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import CreateWorkspaceModal, {WorkspaceCreateProps} from "../../components/modals/CreateWorkspaceModal";
import {ModularTopBar, UserDetailsWithMenu, DropdownButton} from "../../components/topbar";

type Modal = 'Note' | 'Quiz' | 'Workspace' | null;

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const MainPage = () => {
    const {width: windowWidth} = useWindowDimensions();
    const httpClient = useHttpClient();
    const [recentViewedNotes, setRecentViewedNotes] = useState<NoteSummary[]>([]);
    const [recentAttemptedQuizzes, setRecentAttemptedQuizzes] = useState<QuizSummary[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [openedModal, setOpenedModal] = useState<Modal>(null);
    const navigation = useNavigation<NavigationProps>();
    const fetchRecent = () => {
        httpClient.getRecentNotes()
            .then(setRecentViewedNotes)
            .catch(console.error);
        httpClient.getRecentQuizzes()
            .then(setRecentAttemptedQuizzes)
            .catch(console.error);
    }

    useEffect(() => {
        fetchRecent();
    }, [httpClient, openedModal]);

    useFocusEffect(
        React.useCallback(() => {
            fetchRecent();
        }, [httpClient.getRecentQuizzes, httpClient.getRecentNotes])
    );

    const onCreateDropdownSelected = (item: string) => {
        switch (item) {
            case "Workspace":
                setOpenedModal('Workspace');
                break;
            case "Note":
                setOpenedModal('Note');
                break;
            case "Quiz":
                setOpenedModal('Quiz');
                break;
            default:
                console.error("Unknown dropdown item selected");
        }
    };

    const navigateToQuizEditor = (quiz: QuizSummary) => {
        fetchRecent();
        navigation.navigate('QuizEditor', {quizId: quiz.id, workspaceId: quiz.workspace.id});
    };

    const navigateToNotePage = (parse: NoteSummary) => {
        fetchRecent();
        if (parse.type === 'DOCUMENT') {
            navigation.navigate('DocumentNotePage', {noteId: parse.id, workspaceId: parse.workspace.id});
        } else if (parse.type === 'BOARD') {
            navigation.navigate('BoardNotePage', {noteId: parse.id, workspaceId: parse.workspace.id});
        }
    }

    const createNewNote = (note: NoteCreateDetails) => {
        httpClient.createNewNote(note)
            .then(navigateToNotePage)
            .catch(console.error);
    };

    const createWorkspace = (workspace: WorkspaceCreateProps) => {
        httpClient.createNewWorkspace(workspace.title, workspace.resourceAccessTypeDto)
            .then(console.log)
            .catch(console.error);
    };
    const createNewQuiz = (details: QuizCreateDetails) => {
        httpClient.createNewQuiz(details)
            .then(navigateToQuizEditor)
            .catch(console.error);
    };
    return (
        <TouchableWithoutFeedback
            onPress={() => setIsDropdownVisible(false)}
            style={{flex: 1}}
        >
            <ImageBackground style={{flex: 1, width: "100%"}} source={require("../../../assets/purple_background.png")}
                             imageStyle={{resizeMode: "cover"}}>
                <ModularTopBar
                    leftContent={
                        <DropdownButton setDropdownVisible={setIsDropdownVisible} dropdownVisible={isDropdownVisible}
                                        onItemSelected={onCreateDropdownSelected}/>
                    }
                    rightContent={<UserDetailsWithMenu displayUsername/>}
                />
                <View style={windowWidth < 700 ? styles.contentVertical : styles.contentHorizontal}>
                    <View style={windowWidth < 700 ? styles.sectionVertical : styles.sectionHorizontal}>
                        <Title style={styles.sectionTitle}>Recent Viewed Notes</Title>
                        <View style={styles.cardContainer}>
                            {recentViewedNotes.map((note) => (
                                <NoteCard note={note} key={note.id}/>
                            ))}
                        </View>
                    </View>
                    <View style={windowWidth < 700 ? styles.sectionVertical : styles.sectionHorizontal}>
                        <Title style={styles.sectionTitle}>Recent Attempted Tests</Title>
                        <View style={styles.cardContainer}>
                            {recentAttemptedQuizzes.map((quiz) => (
                                <QuizCard quiz={quiz} key={quiz.id}/>
                            ))}
                        </View>
                    </View>
                </View>

                <CreateNoteModal
                    isVisible={openedModal === 'Note'}
                    onClose={() => setOpenedModal(null)}
                    onSubmit={createNewNote}
                />
                <CreateQuizModal
                    isVisible={openedModal === 'Quiz'}
                    onClose={() => setOpenedModal(null)}
                    onSubmit={createNewQuiz}
                />
                <CreateWorkspaceModal
                    isVisible={openedModal === 'Workspace'}
                    onClose={() => setOpenedModal(null)}
                    onSubmit={createWorkspace}
                />
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};
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

export default MainPage;
