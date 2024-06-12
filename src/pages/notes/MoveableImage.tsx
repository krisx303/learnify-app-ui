import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Canvas, Image, rect, rrect, useImage, useTouchHandler} from '@shopify/react-native-skia';

interface MovableImageProps {
    src: string;
    imageWidth: number;
    imageHeight: number;
    imagePosition: { x: number, y: number };
    isEditingMode: boolean;
}

const MovableImage = ({
                          src, imageWidth, imageHeight,
                          imagePosition,
                          isEditingMode
                      }: MovableImageProps) => {
    const image = useImage(src);

    if (!image) {
        return null; // Return null if the image is not yet loaded
    }

    return (
       <>
            {isEditingMode && <Box
                box={rrect(rect(imagePosition.x - 5, imagePosition.y - 5, imageWidth + 10, imageHeight + 10), 0, 0)}
                color="#14188f"/>}
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

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
        backgroundColor: 'aqua',
    },
    image: {
        borderWidth: 0,
    },
    imageWithBorder: {
        borderWidth: 2,
        borderColor: 'blue',
    }
});

export default MovableImage;
