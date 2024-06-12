import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MovableImage from "./MoveableImage";
import { Canvas, useTouchHandler } from "@shopify/react-native-skia";

const App = () => {
    const [elements, setElements] = useState([]);
    const imageWidth = 200;
    const imageHeight = 300;
    const movingElement = useRef(null);

    const createMoveableImage = () => {
        const id = Math.random().toString(36).substr(2, 9); // unique ID for each element
        const element = {
            id,
            imagePosition: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
            isMoving: false,
            isEditingMode: false,
            setImagePosition: (position) => {
                setElements((prevElements) => prevElements.map((el) => el.id === id ? { ...el, imagePosition: position } : el));
            },
            setIsMoving: (isMoving) => {
                setElements((prevElements) => prevElements.map((el) => el.id === id ? { ...el, isMoving } : el));
            },
            setIsEditingMode: (isEditingMode) => {
                setElements((prevElements) => prevElements.map((el) => el.id === id ? { ...el, isEditingMode } : el));
            },
        };
        setElements((prevElements) => [...prevElements, element]);
    };

    useEffect(() => {
        createMoveableImage();
        createMoveableImage();
    }, []);

    const touchHandler = useTouchHandler({
        onStart: ({ x: touchX, y: touchY }) => {
            const element = elements.find(el =>
                touchX >= el.imagePosition.x && touchX <= el.imagePosition.x + imageWidth &&
                touchY >= el.imagePosition.y && touchY <= el.imagePosition.y + imageHeight
            );
            if (element) {
                movingElement.current = element;

                elements.filter(el => el.id !== element.id).forEach(el => {
                    el.setIsEditingMode(false);
                    el.setIsMoving(false);
                });
                element.setImagePosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
                element.setIsMoving(true);
                element.setIsEditingMode(true);
            }
        },
        onActive: ({ x: touchX, y: touchY, force }) => {
            if (movingElement.current && force > 0) {
                movingElement.current.setImagePosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
            }
        },
        onEnd: () => {
            elements.forEach(element => {
                if (element.isMoving) {
                    element.setIsMoving(false);
                } else if (element.isEditingMode) {
                    element.setIsEditingMode(false);
                }
            });
        }
    }, [elements]);

    return (
        <View style={styles.container}>
            <Button title="Add Movable Image" onPress={createMoveableImage} />
            <Canvas style={styles.canvas} onTouch={touchHandler}>
                {elements.map((element, index) => (
                    <MovableImage
                        key={element.id}
                        src="https://picsum.photos/200/300"
                        imageWidth={imageWidth}
                        imageHeight={imageHeight}
                        imagePosition={element.imagePosition}
                        isEditingMode={element.isEditingMode}
                    />
                ))}
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    canvas: {
        flex: 1,
        backgroundColor: 'aqua',
    },
});

export default App;
