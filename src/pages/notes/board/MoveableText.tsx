import React from 'react';
import {BlurMask, Box, rect, rrect, Text} from '@shopify/react-native-skia';
import {Position} from "./types";

interface MovableTextProps {
    font: any;
    text: string;
    position: Position;
    isEditingMode: boolean;
    isMoving: boolean;
}

const MovableText = ({
      font, text,
      position,
      isEditingMode,
      isMoving
}: MovableTextProps) => {

    return (
        <>
            {(isEditingMode || isMoving) && <Box
                box={rrect(rect(position.x - 4, position.y - 2, text.length*10, 30), 0, 0)}
                color={isEditingMode ? "#14188f" : "#13d27a"}>
                <BlurMask blur={5} style="outer" />
            </Box>}
            <Text
                x={position.x}
                y={position.y + 20}
                text={text}
                font={font!!}/>
        </>
    );
};

export default MovableText;
