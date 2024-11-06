import React, {useEffect, useState} from "react";
import {QuizSummary} from "../main/Types";
import {useHttpClient} from "../../transport/HttpClient";
import {useFocusEffect} from "@react-navigation/native";
import {StyleSheet, Text, View} from "react-native";
import {Button, IconButton, Menu, PaperProvider} from "react-native-paper";

function ConnectedQuizzesTabContent({noteId, navigateToQuizInternal}: {
    noteId: string,
    navigateToQuizInternal: (workspaceId: string, quizId: string) => void,
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [boundQuizzes, setBoundQuizzes] = useState<QuizSummary[]>([]);
    const [recentQuizzes, setRecentQuizzes] = useState<QuizSummary[]>([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [availableQuizzes, setAvailableQuizzes] = useState<QuizSummary[]>([]);
    const httpClient = useHttpClient();

    useEffect(() => {
        const boundQuizIds = boundQuizzes.map(quiz => quiz.id);
        if (boundQuizzes && recentQuizzes) {
            setAvailableQuizzes(recentQuizzes.filter(quiz => !boundQuizIds.includes(quiz.id)));
        }
    }, [boundQuizzes, recentQuizzes]);

    useFocusEffect(
        React.useCallback(() => {
            httpClient.getBoundedQuizzes(noteId).then(setBoundQuizzes);
            httpClient.getRecentQuizzes().then(setRecentQuizzes);
        }, [noteId, httpClient, shouldRefresh])
    );
    return <View style={styles.content}>
        {boundQuizzes.map((quiz) => (
            <View key={quiz.id} style={styles.card}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <View>
                        <Text style={styles.title}>{quiz.title}</Text>
                        <Text style={styles.author}>{quiz.author.displayName}</Text>
                        <Text style={styles.workspace}>{quiz.workspace.displayName}</Text>
                    </View>
                    <View>
                        <IconButton size={35} iconColor="green" icon={'chevron-right-circle-outline'} onPress={() => {
                            navigateToQuizInternal(quiz.workspace.id, quiz.id);
                        }}/>
                    </View>
                </View>
            </View>
        ))}
        <PaperProvider>
            <Menu
                style={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    width: 'max-content',
                }}
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    (<Button mode="contained" onPress={() => {
                        setMenuVisible(true)
                    }}>
                        Attach New Quiz
                    </Button>)
                }>
                {availableQuizzes.map((quiz) => (
                    <Menu.Item key={quiz.id} onPress={() => {
                        httpClient.createNewBinding(quiz.id, noteId)
                            .then(() => {
                                setShouldRefresh(true);
                                setMenuVisible(false);
                            });

                    }} title={quiz.title}/>
                ))}
            </Menu>
        </PaperProvider>
    </View>
}

const styles = StyleSheet.create({
    content: {
        flex: 1, // Allow content to fill remaining space
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 14,
        color: 'gray',
    },
    workspace: {
        fontSize: 14,
        color: '#007bff',
    },
});

export default ConnectedQuizzesTabContent;