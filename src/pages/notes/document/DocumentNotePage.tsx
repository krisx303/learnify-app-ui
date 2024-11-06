import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import styles from '../../CardPage.scss';
import TopBar from "../../main/TopBar";
import {useHttpClient} from "../../../transport/HttpClient";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import DrawerProvider, {DrawerContext} from "../DrawerProvider";
import NoteDrawer from "../NoteDrawer";
import {StackNavigationProp} from "@react-navigation/stack";
import {NoteSummary} from "../../main/Types";
import {useAuth} from "../../auth/AuthProvider";

type NotePageRouteProp = RouteProp<RootStackParamList, "DocumentNotePage">;
type NavigationProps = StackNavigationProp<RootStackParamList, 'DocumentNotePage'>;


const DocumentNotePage: React.FC = () => {
    const iframeRef = useRef(null);
    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;
    const httpClient = useHttpClient();
    const [confirmed, setConfirmed] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    const { toggleDrawer, setDrawerContent, drawerVisible } = useContext(DrawerContext);
    const [noteDetails, setNoteDetails] = useState<NoteSummary | undefined>(undefined);
    const { user } = useAuth();



    useEffect(() => {
        setDrawerContent(
            <NoteDrawer
                noteId={noteId}
                onClose={toggleDrawer}
                navigateToQuiz={(workspaceId, quizId) => navigation.navigate('QuizPage', {workspaceId, quizId})}
                isOwner={noteDetails?.author.id === user?.uid}
                ownerId={noteDetails?.author.id ?? ""}
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
        const handleEvent = (event) => {
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleEvent);

        return () => {
            window.removeEventListener("keydown", handleEvent);
        };
    }, []);

    useEffect(() => {
        httpClient
            .getNoteDetails(workspaceId, noteId)
            .then(setNoteDetails)
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
            if (event.data === 'CONFIRMED') {
                setConfirmed(true);
            }
            else if (event.data.startsWith('SAVE ')) {
                const content = event.data.substring(5);
                httpClient
                    .putDocumentNotePageUpdate(workspaceId, noteId, content)
                    .then(() => {console.log('Content saved');})
                    .catch(console.error);
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
                text={noteDetails?.title}
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