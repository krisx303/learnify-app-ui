import React, {useEffect, useState} from 'react';
import {View, TouchableWithoutFeedback, useWindowDimensions} from 'react-native';
import {Title} from 'react-native-paper';
import styles from './MainPage.scss';
import NoteCard from './NoteCard';
import QuizCard from './QuizCard';
import TopBar from './TopBar';
import {useHttpClient} from '../../transport/HttpClient';
import {NoteSummary, QuizSummary} from './Types';
import DropdownButton from './DropdownButton';
import CreateNoteModal, {NoteCreateDetails} from "./modals/CreateNoteModal";
import CreateQuizModal, {QuizCreateDetails} from "./modals/CreateQuizModal";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {useNavigation} from "@react-navigation/native";

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const MainPage = () => {
    const { width: windowWidth } = useWindowDimensions();
    const httpClient = useHttpClient();
    const [recentViewedNotes, setRecentViewedNotes] = useState<NoteSummary[]>([]);
    const [recentAttemptedQuizzes, setRecentAttemptedQuizzes] = useState<QuizSummary[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        httpClient.getRecentNotes()
            .then(setRecentViewedNotes)
            .catch(console.error);
        httpClient.getRecentQuizzes()
            .then(setRecentAttemptedQuizzes)
            .catch(console.error);
    }, [httpClient]);

    const onCreateDropdownSelected = (item: string) => {
        if(item === "HandWrittenNote") {
            setIsNoteModalVisible(true);
        }else if(item === "Quiz") {
            setIsQuizModalVisible(true);
        }
    };

    const navigateToQuizEditor = (details: QuizCreateDetails) => {
        //TODO save base quiz details to backend
        navigation.navigate('QuizEditor', {quizId: details.id, workspaceId: details.workspaceId});
    };

    const navigateToNotePage = (parse: NoteSummary) => {
        navigation.navigate('CardPage', {noteId: parse.id, workspaceId: parse.workspace.id});
    }

    const createNewNote = (note: NoteCreateDetails) => {
        httpClient.createNewNote(note)
            .then(navigateToNotePage)
            .catch(console.error);
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => setIsDropdownVisible(false)}
            style={{flex: 1}}
        >
            <View style={styles.container}>
                <TopBar>
                    <DropdownButton setDropdownVisible={setIsDropdownVisible} dropdownVisible={isDropdownVisible} onItemSelected={onCreateDropdownSelected}/>
                </TopBar>
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

                <CreateNoteModal isVisible={isNoteModalVisible} onClose={() => setIsNoteModalVisible(false)}
                                 onSubmit={createNewNote}
                />
                <CreateQuizModal
                    isVisible={isQuizModalVisible}
                    onClose={() => setIsQuizModalVisible(false)}
                    onSubmit={navigateToQuizEditor}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default MainPage;
