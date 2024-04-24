import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import TopBar from './main/TopBar'; // Assuming TopBar component exists
import styles from './CardPage.scss';
import Two from 'two.js';
type RootStackParamList = {
    CardPage: { workspaceId: string; noteId: string };
};

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage: React.FC = () => {
    const [backgroundImage, setBackgroundImage] = useState('');
    const user = {
        username: 'JohnDoe',
        avatarUrl: 'https://cdn2.iconfinder.com/data/icons/people-round-icons/128/man_avatar-512.png',
    };

    const createGrid = (s: number) => {
        const size = s || 30;
        const two = new Two({
            type: Two.Types.canvas,
            width: size,
            height: size
        });

        // Create grid lines
        const a = two.makeLine(two.width / 2, 0, two.width / 2, two.height);
        const b = two.makeLine(0, two.height / 2, two.width, two.height / 2);
        a.stroke = b.stroke = '#6dcff6';
        two.update();
        const imageData = two.renderer.domElement.toDataURL('image/png');
        console.log(imageData)
        setBackgroundImage(imageData);
    };

    useEffect(() => {
        createGrid(30);
    }, [])

    // Access route params
    const route = useRoute<CardPageRouteProp>();
    const { workspaceId, noteId } = route.params;

    return (
        <View style={styles.container}>
            <TopBar username={user.username} avatarUrl={user.avatarUrl} />
            <View style={styles.content}>
                <View style={styles.toolPanel}>
                    {/* Buttons for tool panel */}
                    <Text>Tool Panel</Text>
                </View>
                <ImageBackground
                    source={{ uri: backgroundImage }}
                    style={styles.imageBackground}
                    resizeMode="repeat"
                >
                    <View style={styles.whiteboard}>
                        {/* Whiteboard content */}
                        <Text>Workspace ID: {workspaceId}</Text>
                        <Text>Note ID: {noteId}</Text>
                        <Text>This is the Card Page!</Text>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
};


export default CardPage;