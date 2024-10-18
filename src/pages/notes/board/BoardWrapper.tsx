import React, {useContext, useEffect, useState} from 'react';
import {RouteProp, useFocusEffect, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import Board from "./Board";
import Drawer from "../Drawer";
import {useHttpClient} from "../../../transport/HttpClient";
import {QuizSummary} from "../../main/Types";
import DrawerProvider, {DrawerContext} from "../DrawerProvider";

type NotePageRouteProp = RouteProp<RootStackParamList, 'BoardNotePage'>;

const BoardWrapper: React.FC = () => {
    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;
    const httpClient = useHttpClient();
    const [boundQuizzes, setBoundQuizzes] = useState<QuizSummary[]>([]);
    const [recentQuizzes, setRecentQuizzes] = useState<QuizSummary[]>([]);
    const [availableQuizzes, setAvailableQuizzes] = useState<QuizSummary[]>([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const { toggleDrawer, setDrawerContent } = useContext(DrawerContext);

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
            setDrawerContent(<Drawer
                noteId={noteId}
                setShouldRefresh={setShouldRefresh}
                quizzes={boundQuizzes}
                onClose={toggleDrawer}
                availableQuizzes={availableQuizzes}
            />);
        }, [workspaceId, noteId, httpClient, shouldRefresh])
    );
    return (
        <DrawerProvider>
            <Board onMenuOpen={toggleDrawer}/>
        </DrawerProvider>
    );
};


export default BoardWrapper;
