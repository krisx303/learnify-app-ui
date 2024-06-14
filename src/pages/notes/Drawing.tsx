import {
    Canvas,
    Path,
    Skia,
    TouchInfo,
    useTouchHandler,
} from "@shopify/react-native-skia";
import React, {useEffect, useRef, useState} from "react";
import {ImageBackground, StyleSheet, View} from "react-native";
import Two from "two.js";
import styles from "../CardPage.scss";
import MovableImage from "./MoveableImage";
import {Color, Colors, PathWithColorAndWidth, Position, strokes} from "./types";
import {Toolbar} from "./Toolbar";

type GenericElement = {
    id: string;
    position: Position;
    isMoving: boolean;
    isEditingMode: boolean;
    setPosition: (position: Position) => void;
    setIsMoving: (isMoving: boolean) => void;
    setIsEditingMode: (isEditingMode: boolean) => void;
}

const Drawing = () => {
    const [backgroundImage, setBackgroundImage] = useState('');

    const [elements, setElements] = useState<GenericElement[]>([]);
    const imageWidth = 200;
    const imageHeight = 300;
    const movingElement = useRef<GenericElement>(null);

    const createMoveableImage = () => {
        const id = Math.random().toString(36).substr(2, 9); // unique ID for each element
        const element = {
            id,
            position: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
            isMoving: false,
            isEditingMode: false,
            setPosition: (position: Position) => {
                element.position = position;
                setElements((prevElements) => prevElements.map((el) => el.id === id ? { ...el, position: position } : el));
            },
            setIsMoving: (isMoving: boolean) => {
                element.isMoving = isMoving;
                setElements((prevElements) => prevElements.map((el) => el.id === id ? { ...el, isMoving } : el));
            },
            setIsEditingMode: (isEditingMode: boolean) => {
                element.isEditingMode = isEditingMode;
                setElements((prevElements) => prevElements.map((el) => el.id === id ? { ...el, isEditingMode } : el));
            },
        } as GenericElement;
        setElements((prevElements) => [...prevElements, element]);
    };

    useEffect(() => {
        createMoveableImage();
        createMoveableImage();
    }, []);

    const createGrid = (s: number) => {
        const size = s || 30;
        const two = new Two({
            type: Two.Types.canvas,
            width: size,
            height: size
        });

        // Create grid lines
        const a = two.makeLine(two.width / 2, 0, two.width / 2, two.height);
        const b = two.makeLine(0, two.height / 2, two.width, two.height / 2);
        a.stroke = b.stroke = '#6dcff6';
        two.update();
        const imageData = two.renderer.domElement.toDataURL('image/png');
        console.log(imageData)
        setBackgroundImage(imageData);
    };

    useEffect(() => {
        createGrid(30);
    }, [])

    const [paths, setPaths] = useState<PathWithColorAndWidth[]>([]);
    const [color, setColor] = useState<Color>(Colors[0]);
    const [active, setActive] = useState(false);

    const [strokeWidth, setStrokeWidth] = useState(strokes[0]);

    const onDrawingStart =
        (touchInfo: TouchInfo) => {
            setActive(true);
            setPaths((currentPaths) => {
                const {x, y} = touchInfo;
                const newPath = Skia.Path.Make();
                newPath.moveTo(x, y);
                return [
                    ...currentPaths,
                    {
                        path: newPath,
                        color,
                        strokeWidth,
                    },
                ];
            });
        };

    const onDrawingActive = (touchInfo: TouchInfo) => {
        if (touchInfo.force == 0) {
            setActive(false);
            return;
        }else if(!active) {
            onDrawingStart(touchInfo);
        }
        setPaths((currentPaths) => {
            if (!active || currentPaths.length === 0) return currentPaths;
            const {x, y} = touchInfo;
            const currentPath = currentPaths[currentPaths.length - 1];
            const lastPoint = currentPath.path.getLastPt();
            const xMid = (lastPoint.x + x) / 2;
            const yMid = (lastPoint.y + y) / 2;

            currentPath.path.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
            return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
        });
    };

    const touchHandler = useTouchHandler({
        onStart: (touchInfo) => {
            elements.forEach(element => {
                if (element.isMoving) {
                    element.setIsMoving(false);
                } else if (element.isEditingMode) {
                    element.setIsEditingMode(false);
                }
            });
            setActive(false);
            movingElement.current = null;
            const { x: touchX, y: touchY } = touchInfo;
            const element = elements.find(el =>
                touchX >= el.position.x && touchX <= el.position.x + imageWidth &&
                touchY >= el.position.y && touchY <= el.position.y + imageHeight
            );
            if (element) {
                movingElement.current = element;

                elements.filter(el => el.id !== element.id).forEach(el => {
                    el.setIsEditingMode(false);
                    el.setIsMoving(false);
                });
                movingElement.current.setPosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
                movingElement.current.setIsMoving(true);
                movingElement.current.setIsEditingMode(true);
            }else {
                onDrawingStart(touchInfo);
            }
        },
        onActive: (touchInfo) => {
            const { x: touchX, y: touchY, force } = touchInfo;
            if (movingElement.current && force > 0) {
                movingElement.current.setPosition({ x: touchX - imageWidth / 2, y: touchY - imageHeight / 2 });
            }else {
                onDrawingActive(touchInfo);
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
            setActive(false);
            movingElement.current = null;
        }
    }, [elements, onDrawingActive, onDrawingStart]);

    return (
        <View style={styles.content}>
            <View style={style.container}>
                <ImageBackground
                    source={{uri: backgroundImage}}
                    style={styles.imageBackground}
                    resizeMode="repeat"
                >
                    <Canvas style={style.container} onTouch={touchHandler}>
                        {paths.map((path, index) => (
                            <Path
                                key={index}
                                path={path.path}
                                color={path.color}
                                style={"stroke"}
                                strokeWidth={path.strokeWidth}
                            />
                        ))}
                        {elements.map((element, index) => (
                            <MovableImage
                                key={element.id}
                                src="https://picsum.photos/200/300"
                                imageWidth={imageWidth}
                                imageHeight={imageHeight}
                                imagePosition={element.position}
                                isMoving={element.isMoving}
                                isEditingMode={element.isEditingMode}
                            />
                        ))}
                    </Canvas>
                </ImageBackground>
            </View>
            <View style={styles.toolPanel}>
                <Toolbar
                    color={color}
                    strokeWidth={strokeWidth}
                    setColor={setColor}
                    setStrokeWidth={setStrokeWidth}
                />
            </View>
        </View>
    );
};

export default Drawing;

const style = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
});