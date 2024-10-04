import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import styles from '../../CardPage.scss';
import TopBar from "../../main/TopBar";

const DocumentNotePage: React.FC = () => {
    const iframeRef = useRef(null);

    const sendMessageToIframe = (message) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(message, '*');
        }
    };

    useEffect(() => {
        const receiveMessage = (event) => {
            console.log('Received message from iframe:', event.data);
            // Handle the message received from the iframe
        };

        window.addEventListener('message', receiveMessage);

        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, []);

    return (
        <View style={styles.container}>
            <TopBar text="Sieci komputerowe - lab 1" />
            <iframe src="http://localhost:3000" height={'100%'} width={'100%'} ref={iframeRef} style={{border: 'none'}}/>
        </View>
    );
};


export default DocumentNotePage;