import {
    Canvas,
    Path,
    Skia,
    TouchInfo,
    useTouchHandler,
} from "@shopify/react-native-skia";
import React, {useEffect, useRef, useState} from "react";
import {ImageBackground, StyleSheet, View} from "react-native";
import styles from "../CardPage.scss";
import MovableImage from "./MoveableImage";
import {Action, Color, Colors, PathWithColorAndWidth, Position, strokes, Tool} from "./types";
import {Toolbar} from "./Toolbar";
import {createGrid} from "./utils";

type GenericElement = {
    id: string;
    position: Position;
    isMoving: boolean;
    isEditingMode: boolean;
    setPosition: (position: Position) => void;
    setIsMoving: (isMoving: boolean) => void;
    setIsEditingMode: (isEditingMode: boolean) => void;
    content: string;
    width: number;
    height: number;
}

const Drawing = () => {
    const [backgroundImage, setBackgroundImage] = useState('');
    const [elements, setElements] = useState<GenericElement[]>([]);
    const movingElement = useRef<GenericElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>('pen');
    const [paths, setPaths] = useState<PathWithColorAndWidth[]>([]);
    const [color, setColor] = useState<Color>(Colors[0]);
    const [active, setActive] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(strokes[0]);

    const createMoveableImage = () => {
        const id = Math.random().toString(36).substr(2, 9); // unique ID for each element
        const element = {
            id,
            position: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
            isMoving: false,
            isEditingMode: false,
            content: "https://picsum.photos/200/300",
            width: 200,
            height: 300,
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
        const gridImage = createGrid(30);
        setBackgroundImage(gridImage);
    }, [])

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
                        blendMode: selectedTool === "pen" ? "src" : "clear"
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

    const moveElement = (element: GenericElement, position: Position) => {
        element.setPosition({ x: position.x - element.width / 2, y: position.y - element.height / 2 });
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
            switch (selectedTool) {
                case "pointer":
                    const { x: touchX, y: touchY } = touchInfo;
                    const element = elements.find(el =>
                        touchX >= el.position.x && touchX <= el.position.x + el.width &&
                        touchY >= el.position.y && touchY <= el.position.y + el.height
                    );
                    if (element) {
                        movingElement.current = element;

                        elements.filter(el => el.id !== element.id).forEach(el => {
                            el.setIsEditingMode(false);
                            el.setIsMoving(false);
                        });
                        moveElement(movingElement.current, {x: touchX, y: touchY})

                        movingElement.current.setIsMoving(true);
                        movingElement.current.setIsEditingMode(true);
                    }
                    break;
                case "pen":
                    onDrawingStart(touchInfo);
                    break;
                case "eraser":
                    onDrawingStart(touchInfo);
                    break;
            }
        },
        onActive: (touchInfo) => {
            switch (selectedTool) {
                case "pointer":
                    const { x: touchX, y: touchY, force } = touchInfo;
                    if (movingElement.current && force > 0) {
                        moveElement(movingElement.current, { x: touchX, y: touchY })
                    }
                    break;
                case "pen":
                    onDrawingActive(touchInfo);
                    break;
                case "eraser":
                    onDrawingActive(touchInfo);
                    break;
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

    const performAction = (action: Action) => {
        switch (action) {
            case "add":
                createMoveableImage();
                break;
            case "undo":
                setPaths((currentPaths) => currentPaths.slice(0, currentPaths.length - 1));
                break;
            case "paste":
                break;
        }
    }

    useEffect(() => {
        const performPasteAction = (event) => {
            performAction("paste");
        }
        const performUndoAction = (event) => {
            if (event.ctrlKey && event.key === 'z') {
                performAction("undo");
            }
        };
        window.addEventListener("paste", performPasteAction);

        window.addEventListener('keydown', performUndoAction);

        return () => {
            window.removeEventListener('keydown', performUndoAction);
            window.removeEventListener("paste", performPasteAction);
        };
    }, []);


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
                                blendMode={path.blendMode}
                            />
                        ))}
                        {elements.map((element, index) => (
                            <MovableImage
                                key={element.id}
                                src={element.content}
                                imageWidth={element.width}
                                imageHeight={element.height}
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
                    selectedTool={selectedTool}
                    setSelectedTool={setSelectedTool}
                    onAction={performAction}
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