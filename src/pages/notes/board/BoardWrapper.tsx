import React from 'react';
import Board from "./Board";
import DrawerProvider from "../DrawerProvider";

const BoardWrapper: React.FC = () => {

    return (
        <DrawerProvider>
            <link
                rel="preload"
                href="/assets/Roboto-Medium.ttf"
                as="font"
                crossOrigin=""
            />
            <Board/>
        </DrawerProvider>
    );
};


export default BoardWrapper;
