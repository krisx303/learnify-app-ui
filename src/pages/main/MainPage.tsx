import React, {useEffect, useState} from 'react';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import styles from './MainPage.scss';
import NoteCard from "./NoteCard";
import QuizCard from "./QuizCard";
import TopBar from "./TopBar";
import {useHttpClient} from "../../transport/HttpClient";
import {NoteSummary, QuizSummary} from "./Types";

const MainPage = () => {
    const httpClient = useHttpClient();
    const [recentViewedNotes, setRecentViewedNotes] = useState<NoteSummary[]>([]);
    const [recentAttemptedQuizzes, setRecentAttemptedQuizzes] = useState<QuizSummary[]>([]);

    useEffect(() => {
        httpClient.getRecentNotes()
            .then(setRecentViewedNotes)
            .catch(console.error);
        httpClient.getRecentQuizzes()
            .then(setRecentAttemptedQuizzes)
            .catch(console.error);
    }, [httpClient])

    return (
        <View style={styles.container}>
            <TopBar />
            <View style={styles.content}>
                <View style={styles.section}>
                    <Title style={styles.sectionTitle}>Recent Viewed Notes</Title>
                    <View style={styles.cardContainer}>
                        {recentViewedNotes.map((note) => (
                            <NoteCard note={note} key={note.id} />
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Title style={styles.sectionTitle}>Recent Attempted Tests</Title>
                    <View style={styles.cardContainer}>
                        {recentAttemptedQuizzes.map((quiz) => (
                            <QuizCard quiz={quiz} key={quiz.id} />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default MainPage;
