import React from 'react';
import Board from "./Board";
import DrawerProvider from "../DrawerProvider";

const BoardWrapper: React.FC = () => {

    return (
        <DrawerProvider>
            <Board/>
        </DrawerProvider>
    );
};


export default BoardWrapper;
