import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import styles from '../../CardPage.scss';
import TopBar from "../../main/TopBar";
import {useHttpClient} from "../../../transport/HttpClient";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import DrawerProvider, {DrawerContext} from "../DrawerProvider";
import Board from "../board/Board";
import Drawer from "../Drawer";
import {StackNavigationProp} from "@react-navigation/stack";

type NotePageRouteProp = RouteProp<RootStackParamList, "DocumentNotePage">;
type NavigationProps = StackNavigationProp<RootStackParamList, 'DocumentNotePage'>;


const DocumentNotePage: React.FC = () => {
    const iframeRef = useRef(null);
    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;
    const [noteName, setNoteName] = useState<string>("");
    const httpClient = useHttpClient();
    const [confirmed, setConfirmed] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    const { toggleDrawer, setDrawerContent, drawerVisible } = useContext(DrawerContext);

    useEffect(() => {
        setDrawerContent(
            <Drawer
                noteId={noteId}
                onClose={toggleDrawer}
                navigateToQuiz={(workspaceId, quizId) => navigation.navigate('QuizPage', {workspaceId, quizId})}
            />);
    }, [drawerVisible]);

    const sendMessageToIframe = (message: string) => {
        if (iframeRef.current) {
            console.log('Sending message to iframe:', message);
            // @ts-ignore
            iframeRef.current.contentWindow.postMessage(message, '*');
        }else {
            setTimeout(() => {
                if(!confirmed)
                sendMessageToIframe(message);
            }, 100);
        }
    };

    useEffect(() => {
        httpClient
            .getNoteDetails(workspaceId, noteId)
            .then((note) => {
                setNoteName(note.title);
            })
            .catch(console.error);
        httpClient
            .getDocumentPageContent(workspaceId, noteId, 1)
            .then((content) => {
                setTimeout(() => {
                    sendMessageToIframe(content);
                }, 100);
            })
            .catch(console.error);
    }, [workspaceId, noteId, httpClient]);

    useEffect(() => {
        const receiveMessage = (event: any) => {
            console.log('Received message from iframe:', event.data);
            if (event.data === 'CONFIRMED') {
                setConfirmed(true);
            }
            // Handle the message received from the iframe
        };

        window.addEventListener('message', receiveMessage);

        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, []);

    return (
        <View style={styles.container}>
            <TopBar
                text={noteName}
                withAdvancedMenu
                onAdvancedMenuPress={toggleDrawer}
            />
            <iframe src="./../../../../assets/dist/index.html" height={'100%'} width={'100%'} ref={iframeRef} style={{border: 'none'}}/>
        </View>
    );
};

const DocumentNoteWrapper: React.FC = () => {

    return (
        <DrawerProvider>
            <DocumentNotePage/>
        </DrawerProvider>
    );
};


export default DocumentNoteWrapper;