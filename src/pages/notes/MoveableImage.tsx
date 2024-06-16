import React from 'react';
import {Box, Image, rect, rrect, useImage} from '@shopify/react-native-skia';
import {Position} from "./types";

interface MovableImageProps {
    src: string;
    imageWidth: number;
    imageHeight: number;
    imagePosition: Position;
    isEditingMode: boolean;
    isMoving: boolean;
}

const MovableImage = ({
      src, imageWidth, imageHeight,
      imagePosition,
      isEditingMode,
      isMoving
}: MovableImageProps) => {
    const image = useImage(src);

    if (!image) {
        return null;
    }

    return (
        <>
            {(isEditingMode || isMoving) && <Box
                box={rrect(rect(imagePosition.x - 5, imagePosition.y - 5, imageWidth + 10, imageHeight + 10), 0, 0)}
                color={isEditingMode ? "#14188f" : "#13d27a"}/>}
            <Image
                image={image}
                x={imagePosition.x}
                y={imagePosition.y}
                width={imageWidth}
                height={imageHeight}
            />
        </>
    );
};

export default MovableImage;
