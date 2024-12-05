import React, {useEffect, useState} from "react";
import {NoteSummary, NoteType, QuizSummary} from "../../pages/main/Types";
import {useHttpClient} from "../../transport/HttpClient";
import {useFocusEffect} from "@react-navigation/native";
import {StyleSheet, Text, View} from "react-native";
import {Button, IconButton, Menu, PaperProvider} from "react-native-paper";

function ConnectedNotesTabContent({quizId, navigateToNoteInternal}: {
    quizId: string,
    navigateToNoteInternal: (workspaceId: string, quizId: string, noteType: NoteType) => void,
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [boundNotes, setBoundNotes] = useState<NoteSummary[]>([]);
    const [allNotes, setAllNotes] = useState<NoteSummary[]>([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [availableNotes, setAvailableNotes] = useState<NoteSummary[]>([]);
    const httpClient = useHttpClient();

    useEffect(() => {
        const boundNoteIds = boundNotes.map(note => note.id);
        if (boundNotes && allNotes) {
            setAvailableNotes(allNotes.filter(note => !boundNoteIds.includes(note.id)));
        }
    }, [boundNotes, allNotes]);

    useFocusEffect(
        React.useCallback(() => {
            httpClient.getBoundNotes(quizId).then(setBoundNotes);
            httpClient.getAllNotes().then(setAllNotes);
        }, [quizId, httpClient, shouldRefresh])
    );
    return <View style={styles.content}>
        {boundNotes.map((note) => (
            <View key={note.id} style={styles.card}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <View>
                        <Text style={styles.title}>{note.title}</Text>
                        <Text style={styles.author}>{note.author.displayName}</Text>
                        <Text style={styles.workspace}>{note.workspace.displayName}</Text>
                    </View>
                    <View>
                        <IconButton size={35} iconColor="green" icon={'chevron-right-circle-outline'} onPress={() => {
                            navigateToNoteInternal(note.workspace.id, note.id, note.type);
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
                        Attach New Note
                    </Button>)
                }>
                {availableNotes.map((note) => (
                    <Menu.Item key={note.id} onPress={() => {
                        httpClient.createNewBinding(quizId, note.id)
                            .then(() => {
                                setShouldRefresh(true);
                                setMenuVisible(false);
                            });

                    }} title={note.title}/>
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

export default ConnectedNotesTabContent;