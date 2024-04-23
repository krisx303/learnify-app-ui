import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Title } from 'react-native-paper';
import styles from './MainPage.scss';
import NoteCard from "./NoteCard";
import QuizCard from "./QuizCard";
const MainPage = () => {
    // Sample user information
    const user = {
        username: 'JohnDoe',
        avatarUrl: 'https://cdn2.iconfinder.com/data/icons/people-round-icons/128/man_avatar-512.png',
    };

    // Sample data for recent viewed notes
    const recentViewedNotes = [
        { id: 1, title: 'Note 1', summary: 'Summary of Note 1' },
        { id: 2, title: 'Note 2', summary: 'Summary of Note 2' },
        { id: 3, title: 'Note 3', summary: 'Summary of Note 3' },
        { id: 4, title: 'Note 4', summary: 'Summary of Note 4' },
    ];

    // Sample data for recent attempted tests
    const recentAttemptedTests = [
        { id: 1, title: 'Test 1', score: '80%' },
        { id: 2, title: 'Test 2', score: '75%' },
        { id: 3, title: 'Test 3', score: '90%' },
    ];

    return (
        <View style={styles.container}>
            {/* Top bar with information */}
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>Learnify</Text>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{user.username}</Text>
                    <Avatar.Image size={40} source={{ uri: user.avatarUrl }} />
                </View>
            </View>
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
                        {recentAttemptedTests.map((test) => (
                            <QuizCard quiz={test} key={test.id} />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default MainPage;
