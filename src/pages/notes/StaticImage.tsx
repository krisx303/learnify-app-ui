import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Image, useImage, useTouchHandler } from '@shopify/react-native-skia';

const MovableImage = () => {
    const image = useImage("https://picsum.photos/200/300");
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const imageWidth = 200;
    const imageHeight = 300;

    const touchHandler = useTouchHandler({
        onStart: ({ x: touchX, y: touchY, force }) => {
            if (
                touchX >= imagePosition.x && touchX <= imagePosition.x + imageWidth &&
                touchY >= imagePosition.y && touchY <= imagePosition.y + imageHeight
            ) {
                setImagePosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
            }
        },
        onActive: ({ x: touchX, y: touchY, force }) => {
            if (
                force > 0 &&
                touchX >= imagePosition.x && touchX <= imagePosition.x + imageWidth &&
                touchY >= imagePosition.y && touchY <= imagePosition.y + imageHeight
            ) {
                setImagePosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
            }
        },
        onEnd: () => {}
    }, [imagePosition]);

    if (!image) {
        return null; // Return null if the image is not yet loaded
    }

    return (
        <Canvas style={styles.canvas} onTouch={touchHandler}>
            <Image image={image} x={imagePosition.x} y={imagePosition.y} width={imageWidth} height={imageHeight} />
        </Canvas>
    );
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
        backgroundColor: 'aqua',
    },
});

export default MovableImage;
