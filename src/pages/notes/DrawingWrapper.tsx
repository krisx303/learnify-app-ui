import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {RouteProp, useFocusEffect, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../App";
import Drawing from "./Drawing";
import Drawer from "./Drawer";
import {useHttpClient} from "../../transport/HttpClient";
import {QuizSummary} from "../main/Types";

type NotePageRouteProp = RouteProp<RootStackParamList, 'HandWrittenNotePage'>;

const HandWrittenNotePage: React.FC = () => {
    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;
    const [drawerVisible, setDrawerVisible] = useState(false);
    const httpClient = useHttpClient();
    const [boundQuizzes, setBoundQuizzes] = useState<QuizSummary[]>([]);
    const [recentQuizzes, setRecentQuizzes] = useState<QuizSummary[]>([]);
    const [availableQuizzes, setAvailableQuizzes] = useState<QuizSummary[]>([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    useEffect(() => {
        const boundQuizIds = boundQuizzes.map(quiz => quiz.id);
        if(boundQuizzes && recentQuizzes) {
            setAvailableQuizzes(recentQuizzes.filter(quiz => !boundQuizIds.includes(quiz.id)));
        }
    }, [boundQuizzes, recentQuizzes]);

    useFocusEffect(
        React.useCallback(() => {
            httpClient.getBoundedQuizzes(noteId).then(setBoundQuizzes);
            httpClient.getRecentQuizzes().then(setRecentQuizzes);
        }, [workspaceId, noteId, httpClient, shouldRefresh])
    );
    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };
    return (
        <View style={styles.container}>
            <Drawing onMenuOpen={toggleDrawer}/>

            {drawerVisible && (
                <>
                    <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
                    <View style={[styles.drawer, { width: 'max(25%, 400px)' }]}>
                        <Drawer
                            noteId={noteId}
                            setShouldRefresh={setShouldRefresh}
                            quizzes={boundQuizzes}
                            onClose={toggleDrawer}
                            availableQuizzes={availableQuizzes}
                        />
                    </View>
                </>
            )}

        </View>
    );
};


export default HandWrittenNotePage;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    menuButton: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    menuButtonText: {
        color: 'white',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 2,
    },
});
