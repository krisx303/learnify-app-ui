import React, {useState} from 'react';
import {View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import TopBar from './main/TopBar';
import styles from './CardPage.scss';
import {version} from "canvaskit-wasm/package.json";
import {WithSkiaWeb} from "@shopify/react-native-skia/lib/module/web";

type RootStackParamList = {
    CardPage: { workspaceId: string; noteId: string };
};

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage: React.FC = () => {
    const [backgroundImage, setBackgroundImage] = useState('');

    const route = useRoute<CardPageRouteProp>();
    const {workspaceId, noteId} = route.params;

    return (
        <View style={styles.container}>
            <TopBar/>
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