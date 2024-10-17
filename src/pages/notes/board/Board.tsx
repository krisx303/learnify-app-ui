import {Canvas, Group, Path, Skia, TouchInfo, useFont, useTouchHandler, Text} from "@shopify/react-native-skia";
import React, {MutableRefObject, useContext, useEffect, useRef, useState} from "react";
import {ImageBackground, StyleSheet, TextInput, View,} from "react-native";
import styles from "../../CardPage.scss";
import MovableImage from "./MovableImage";
import {Action, Color, Colors, PathWithColorAndWidth, Position, strokes, Tool,} from "./types";
import {Toolbar} from "./Toolbar";
import {createGrid} from "./Grid";
import {useHttpClient, ElementDto} from "../../../transport/HttpClient";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import TopBar from "../../main/TopBar";
import {
    createGenericMovableElement,
    createGenericMovableElementFromDto,
    GenericMovableElement
} from "./GenericMovableElement";
import MovableText from "./MoveableText";
import {
    asElementDto,
    asPathDto,
    asPathWithColorAndWidth, movedPosition,
    positionWithinElement,
    randomId,
    randomPosition,
    scaledPosition
} from "./Utils";
import {TextInputComponent} from "./TextInputComponent";
import {DrawerContext} from "../DrawerProvider";
import Drawer from "../Drawer";
import {StackNavigationProp} from "@react-navigation/stack";

type NotePageRouteProp = RouteProp<RootStackParamList, "BoardNotePage">;
type NavigationProps = StackNavigationProp<RootStackParamList, 'BoardNotePage'>;

const Board = () => {
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
    const navigation = useNavigation<NavigationProps>();
    const { toggleDrawer, setDrawerContent, drawerVisible } = useContext(DrawerContext);
    const font = useFont("http://localhost:19000/assets/Roboto-Medium.ttf", 20, (err) => {
        console.error(err)
    })

   const asGenericMovableElements = (elements: ElementDto[]) => {
        return elements.map((element) => {
            return createGenericMovableElementFromDto(element, setElements);
        });

    useEffect(() => {
        setDrawerContent(
            <Drawer
                noteId={noteId}
                onClose={toggleDrawer}
                navigateToQuiz={(workspaceId, quizId) => navigation.navigate('QuizPage', {workspaceId, quizId})}
            />);
    }, [drawerVisible]);

    const createMovableImage = () => {
        const element = createGenericMovableElement(
            randomId(),
            randomPosition(),
            "https://miro.medium.com/v2/resize:fit:700/1*TtczOh1ZzrAsPLBaA5SxHg.png",
            560,
            480,
            'image',
            setElements
        );
        setElements((prevElements) => [...prevElements, element]);
    };

    const createMovableText = () => {
        const element = createGenericMovableElement(
            randomId(),
            randomPosition(),
            "Hello World",
            100,
            30,
            'text',
            setElements
        );
        setElements((prevElements) => [...prevElements, element]);
    }

    useEffect(() => {
        const gridImage = createGrid(30);
        setPaths([]);
        setElements([]);
        setBackgroundImage(gridImage);
        httpClient
            .getNoteDetails(workspaceId, noteId)
            .then((note) => setNoteName(note.title))
            .catch(console.error);
        httpClient
            .getBoardPageContent(workspaceId, noteId, 1)
            .then((content) => {
                setPaths(content.paths.map(asPathWithColorAndWidth));
                setElements(asGenericMovableElements(content.elements));
            })
            .catch(console.error);
    }, [workspaceId, noteId, httpClient]);

    const onDrawingStart = (touchInfo: TouchInfo) => {
        setActive(true);
        setPaths((currentPaths) => {
            const {x, y, force} = scaledPosition(touchInfo, scale);
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
            const {x, y, force} = scaledPosition(touchInfo, scale);
            const currentPath = currentPaths[currentPaths.length - 1];
            const lastPoint = currentPath.path.getLastPt();
            const xMid = (lastPoint.x + x) / 2;
            const yMid = (lastPoint.y + y) / 2;

            currentPath.path.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
            return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
        });
    };

    const touchHandler = useTouchHandler(
        {
            onStart: (touchInfo) => {
                setActive(false);
                movingElement.current = null;
                switch (selectedTool) {
                    case "pointer":
                        const {x, y} = scaledPosition(touchInfo, scale);
                        const touchedElement = elements.find((el) => positionWithinElement({x, y}, el));
                        if (touchedElement !== undefined) {
                            movingElement.current = touchedElement;

                            setElements(elements.map((el) => {
                                const isTouchedElement = el.id === touchedElement.id;
                                el.isMoving = isTouchedElement;
                                el.isEditingMode = isTouchedElement;
                                if(isTouchedElement) {
                                    el.position = movedPosition(el, {x, y});
                                }
                                return el;
                            }))
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
                        const {x, y, force} = scaledPosition(touchInfo, scale);
                        if (movingElement.current && force > 0) {
                            movingElement.current.setPosition(movedPosition(movingElement.current, {x, y}));
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
                setElements(elements.map((el) => {
                    if(el.isMoving) {
                        el.isMoving = false;
                    }else {
                        el.isEditingMode = false;
                    }
                    return el;
                }))
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
            case "add-text":
                createMovableText();
                break
        }
    };

    useEffect(() => {
        const performPasteAction = (event) => performAction("paste");
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
                .putBoardNotePageUpdate(workspaceId, noteId, {
                    elements: elements.map(asElementDto),
                    paths: paths.map(asPathDto),
                })
                .then(() => setShouldSendState(false))
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
                onAdvancedMenuPress={toggleDrawer}
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
                                    element.type === "image" ? (
                                        <MovableImage key={element.id} element={element}/>
                                    ) : (
                                        <MovableText key={element.id} font={font} element={element}/>
                                    )
                                ))}
                            </Group>
                        </Canvas>

                        <TextInputComponent genericMovableElements={elements} setElements={setElements}/>
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