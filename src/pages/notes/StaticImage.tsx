import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {Box, Canvas, Image, rect, rrect, useImage, useTouchHandler} from '@shopify/react-native-skia';

const MovableImage = () => {
    const image = useImage("https://picsum.photos/200/300");
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isMoving, setIsMoving] = useState(false);
    const imageWidth = 200;
    const imageHeight = 300;
    const [isEditingMode, setIsEditingMode] = useState(false);

    const touchHandler = useTouchHandler({
        onStart: ({ x: touchX, y: touchY, force }) => {
            if (
                touchX >= imagePosition.x && touchX <= imagePosition.x + imageWidth &&
                touchY >= imagePosition.y && touchY <= imagePosition.y + imageHeight
            ) {
                setImagePosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
                setIsMoving(true);
                setIsEditingMode(true)
            }
        },
        onActive: ({ x: touchX, y: touchY, force }) => {
            if (
                force > 0 &&
                touchX >= imagePosition.x && touchX <= imagePosition.x + imageWidth &&
                touchY >= imagePosition.y && touchY <= imagePosition.y + imageHeight
            ) {
                setImagePosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
                setIsMoving(true);
                setIsEditingMode(true)
            }
        },
        onEnd: () => {
            console.log('end')
            if(isMoving) {
                setIsMoving(false);
            }else if(isEditingMode) {
                setIsEditingMode(false);
            }
        }
    }, [imagePosition, isMoving, isEditingMode]);

    if (!image) {
        return null; // Return null if the image is not yet loaded
    }

    return (
        <Canvas style={styles.canvas} onTouch={touchHandler}>
            {isEditingMode && <Box box={rrect(rect(imagePosition.x - 5, imagePosition.y - 5, imageWidth+10, imageHeight+10), 0, 0)} color="#14188f"/>}
            <Image
                image={image}
                x={imagePosition.x}
                y={imagePosition.y}
                width={imageWidth}
                height={imageHeight}
            />
        </Canvas>
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
