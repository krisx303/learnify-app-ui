import {Canvas, Group, Path, Skia, TouchInfo, useTouchHandler,} from "@shopify/react-native-skia";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {ImageBackground, StyleSheet, View,} from "react-native";
import styles from "../../CardPage.scss";
import MovableImage from "./MoveableImage";
import {Action, Color, Colors, PathWithColorAndWidth, Position, strokes, Tool,} from "./types";
import {Toolbar} from "./Toolbar";
import {createGrid} from "./Grid";
import {useHttpClient} from "../../../transport/HttpClient";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import TopBar from "../../main/TopBar";
import {createGenericMovableElement, GenericMovableElement} from "./GenericMovableElement";

type NotePageRouteProp = RouteProp<RootStackParamList, "BoardNotePage">;

const Board = ({onMenuOpen}: { onMenuOpen: () => void }) => {
    const [backgroundImage, setBackgroundImage] = useState("");
    const [elements, setElements] = useState<GenericMovableElement[]>([]);
    const movingElement = useRef<GenericMovableElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("pen");
    const [paths, setPaths] = useState<PathWithColorAndWidth[]>([]);
    const [color, setColor] = useState<Color>(Colors[0]);
    const [active, setActive] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(strokes[0]);
    const [shouldSendState, setShouldSendState] = useState(false);
    const httpClient = useHttpClient();
    const [noteName, setNoteName] = useState<string>("");
    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;
    const [canvasWidth, setCanvasWidth] = useState(0); // Current width of the canvas container
    const canvasFixedWidth= 1800; // Original canvas width (set only once)

    const createGenericElement = (
        id: string,
        startPosition: Position,
        content: string,
        width: number,
        height: number
    ) => {
        const element = createGenericMovableElement(id, startPosition, content, width, height, setElements);
        setElements((prevElements) => [...prevElements, element]);
    };

    const createMovableImage = () => {
        const id = Math.random().toString(36).substr(2, 9); // unique ID for each element
        createGenericElement(
            id,
            {
                x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100),
            },
            "https://miro.medium.com/v2/resize:fit:700/1*TtczOh1ZzrAsPLBaA5SxHg.png",
            560,
            480
        );
    };

    useEffect(() => {
        const gridImage = createGrid(30);
        setPaths([]);
        setElements([]);
        setBackgroundImage(gridImage);
        httpClient
            .getNoteDetails(workspaceId, noteId)
            .then((note) => {
                setNoteName(note.title);
            })
            .catch(console.error);
        httpClient
            .getPageContent(workspaceId, noteId, 1)
            .then((content) => {
                setPaths(
                    content.paths.map((path) => {
                        return {
                            path: Skia.Path.MakeFromSVGString(path.path),
                            color: path.color,
                            strokeWidth: path.strokeWidth,
                            blendMode: path.blendMode,
                        } as PathWithColorAndWidth;
                    })
                );
                content.elements.forEach((element) => {
                    createGenericElement(
                        element.id,
                        element.position,
                        element.content,
                        element.width,
                        element.height
                    );
                });
            })
            .catch(console.error);
    }, [workspaceId, noteId, httpClient]);

    const onDrawingStart = (touchInfo: TouchInfo) => {
        setActive(true);
        setPaths((currentPaths) => {
            const {x: xx, y: yy} = touchInfo;
            const x = xx * (1 / scale);
            const y = yy * (1 / scale);
            const newPath = Skia.Path.Make();
            newPath.moveTo(x, y);
            return [
                ...currentPaths,
                {
                    path: newPath,
                    color,
                    strokeWidth,
                    blendMode: selectedTool === "pen" ? "src" : "clear",
                },
            ];
        });
    };

    const onDrawingActive = (touchInfo: TouchInfo) => {
        if (touchInfo.force == 0) {
            setActive(false);
            return;
        } else if (!active) {
            onDrawingStart(touchInfo);
        }
        setPaths((currentPaths) => {
            if (!active || currentPaths.length === 0) return currentPaths;
            const {x: xx, y: yy} = touchInfo;
            const x = xx * (1 / scale);
            const y = yy * (1 / scale);
            const currentPath = currentPaths[currentPaths.length - 1];
            const lastPoint = currentPath.path.getLastPt();
            const xMid = (lastPoint.x + x) / 2;
            const yMid = (lastPoint.y + y) / 2;

            currentPath.path.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
            return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
        });
    };

    const moveElement = (element: GenericMovableElement, position: Position) => {
        element.setPosition({
            x: position.x - element.width / 2,
            y: position.y - element.height / 2,
        });
    };

    const touchHandler = useTouchHandler(
        {
            onStart: (touchInfo) => {
                elements.forEach((element) => {
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
                        const {x: xx, y: yy} = touchInfo;
                        const touchX = xx * (1 / scale);
                        const touchY = yy * (1 / scale);
                        const element = elements.find(
                            (el) =>
                                touchX >= el.position.x &&
                                touchX <= el.position.x + el.width &&
                                touchY >= el.position.y &&
                                touchY <= el.position.y + el.height
                        );
                        if (element) {
                            movingElement.current = element;

                            elements
                                .filter((el) => el.id !== element.id)
                                .forEach((el) => {
                                    el.setIsEditingMode(false);
                                    el.setIsMoving(false);
                                });
                            moveElement(movingElement.current, {x: touchX, y: touchY});

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
                        const {x: xx, y: yy} = touchInfo;
                        const touchX = xx * (1 / scale);
                        const touchY = yy * (1 / scale);
                        const {force} = touchInfo;
                        if (movingElement.current && force > 0) {
                            moveElement(movingElement.current, {x: touchX, y: touchY});
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
                elements.forEach((element) => {
                    if (element.isMoving) {
                        element.setIsMoving(false);
                    } else if (element.isEditingMode) {
                        element.setIsEditingMode(false);
                    }
                });
                setActive(false);
                movingElement.current = null;
            },
        },
        [workspaceId, noteId, elements, onDrawingActive, onDrawingStart]
    );

    const performAction = (action: Action) => {
        switch (action) {
            case "add":
                createMovableImage();
                break;
            case "undo":
                setPaths((currentPaths) =>
                    currentPaths.slice(0, currentPaths.length - 1)
                );
                break;
            case "paste":
                break;
            case "save":
                setShouldSendState(true);
                break;
        }
    };

    useEffect(() => {
        const performPasteAction = (event) => {
            performAction("paste");
        };
        const handleEvent = (event) => {
            if (event.ctrlKey && event.key === "z") {
                performAction("undo");
            } else if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                performAction("save");
            }
        };
        window.addEventListener("paste", performPasteAction);

        window.addEventListener("keydown", handleEvent);

        return () => {
            window.removeEventListener("keydown", handleEvent);
            window.removeEventListener("paste", performPasteAction);
        };
    }, []);

    useEffect(() => {
        if (shouldSendState) {
            httpClient
                .postNoteUpdate(workspaceId, noteId, {
                    elements: elements.map((element) => ({
                        id: element.id,
                        position: element.position,
                        content: element.content,
                        width: element.width,
                        height: element.height,
                    })),
                    paths: paths.map((path) => ({
                        path: path.path.toSVGString(),
                        color: path.color,
                        strokeWidth: path.strokeWidth,
                        blendMode: path.blendMode,
                    })),
                })
                .then(() => {
                    setShouldSendState(false);
                })
                .catch((error) => {
                    console.error(error);
                    setShouldSendState(false);
                });
        }
    }, [shouldSendState]);

    const handleLayout = (event) => {
        const {width} = event.nativeEvent.layout;
        setCanvasWidth(width);
    };

    const scale = canvasWidth ? canvasWidth / canvasFixedWidth : 1;

    return (
        <View style={{width: "100%", height: "100%", maxHeight: "100%"}}>
            <TopBar
                text={noteName}
                withAdvancedMenu
                onAdvancedMenuPress={onMenuOpen}
            />
            <View style={styles.content}>
                <View style={style.container} onLayout={handleLayout}>
                    <ImageBackground
                        source={{uri: backgroundImage}}
                        style={styles.imageBackground}
                        resizeMode="repeat"
                    >
                        <Canvas style={style.canvas} onTouch={touchHandler}>
                            <Group transform={[{scale: scale}]}>
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
                            </Group>
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
        </View>
    );
};

export default Board;

const style = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        aspectRatio: 2,
    },
    canvas: {
        flex: 1,
        width: "100%",
    },
});