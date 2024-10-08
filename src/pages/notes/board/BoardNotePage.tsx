import React from 'react';
import {ImageBackground} from 'react-native';
import styles from '../../CardPage.scss';
import {version} from "canvaskit-wasm/package.json";
import {WithSkiaWeb} from "@shopify/react-native-skia/lib/module/web";

const BoardNotePage: React.FC = () => {
    return (
        <ImageBackground source={require('../../../../assets/purple_background.png')} style={styles.container}>
            <WithSkiaWeb
                opts={{
                    locateFile: (file) =>
                        `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${version}/bin/full/${file}`,
                }}
                // @ts-ignore
                getComponent={() => import("./BoardWrapper")}
            />
        </ImageBackground>
    );
};


export default BoardNotePage;