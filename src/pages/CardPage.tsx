import React from 'react';
import {View} from 'react-native';
import TopBar from './main/TopBar';
import styles from './CardPage.scss';
import {version} from "canvaskit-wasm/package.json";
import {WithSkiaWeb} from "@shopify/react-native-skia/lib/module/web";

const CardPage: React.FC = () => {
    return (
        <View style={styles.container}>
            <TopBar/>
            <WithSkiaWeb
                opts={{
                    locateFile: (file) =>
                        `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${version}/bin/full/${file}`,
                }}
                // @ts-ignore
                getComponent={() => import("./notes/asd")}
            />
        </View>
    );
};


export default CardPage;