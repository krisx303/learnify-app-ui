import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import styles from '../../CardPage.scss';
import TopBar from "../../main/TopBar";
import {useHttpClient} from "../../../transport/HttpClient";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";

type NotePageRouteProp = RouteProp<RootStackParamList, "DocumentNotePage">;

const DocumentNotePage: React.FC = () => {
    const iframeRef = useRef(null);
    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;
    const [noteName, setNoteName] = useState<string>("");
    const httpClient = useHttpClient();
    const [confirmed, setConfirmed] = useState(false);

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
            />
            <iframe src="./../../../../assets/dist/index.html" height={'100%'} width={'100%'} ref={iframeRef} style={{border: 'none'}}/>
        </View>
    );
};


export default DocumentNotePage;