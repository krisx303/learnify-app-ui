import React from 'react';
import {View} from 'react-native';
import TopBar from './main/TopBar';
import styles from './CardPage.scss';
import {version} from "canvaskit-wasm/package.json";
import {WithSkiaWeb} from "@shopify/react-native-skia/lib/module/web";
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
    CardPage: { workspaceId: string; noteId: string };
};

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage: React.FC = () => {
    const user = {
        username: 'JohnDoe',
        avatarUrl: 'https://cdn2.iconfinder.com/data/icons/people-round-icons/128/man_avatar-512.png',
    };

    const route = useRoute<CardPageRouteProp>();
    const { workspaceId, noteId } = route.params;

    return (
        <View style={styles.container}>
            <TopBar username={user.username} avatarUrl={user.avatarUrl} text={noteId}/>
            <WithSkiaWeb
                opts={{
                    locateFile: (file) =>
                        `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${version}/bin/full/${file}`,
                }}
                // @ts-ignore
                getComponent={() => import("./notes/Drawing")}
            />
        </View>
    );
};


export default CardPage;