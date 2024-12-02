import React, {useEffect, useRef, useState} from "react";
import {StyleSheet} from "react-native";
import {Canvas, Group, Path, Skia, TouchInfo, useFont, useTouchHandler} from "@shopify/react-native-skia";
import MovableImage from "./MovableImage";
import MovableText from "./MoveableText";
import {movedPosition, positionWithinElement, scaledPosition} from "./Utils";
import {GenericMovableElement} from "./GenericMovableElement";
import {useBoardContext} from "./BoardContext";


type BoardCanvasProps = {
    editable: boolean;
    paths: any[];
    setPaths: any;
    elements: any[];
    setElements: any;
    canvasWidth?: number;
}

const BoardCanvas: React.FC<BoardCanvasProps> = (
    {
        editable,
        paths,
        setPaths,
        elements,
        canvasWidth,
        setElements,
    }
) => {
    const font = useFont("http://localhost:19000/assets/Roboto-Medium.ttf", 20, (err) => {
        console.error(err)
    })
    const [active, setActive] = useState(false);
    const movingElement = useRef<GenericMovableElement>(null);
    const [lastClickTime, setLastClickTime] = useState(0);
    const lastTouchedElement = useRef<GenericMovableElement>(null);
    const canvasFixedWidth = 1800; // Original canvas width (set only once)
    const scale = canvasWidth ? canvasWidth / canvasFixedWidth : 1;
    const {selectedTool, strokeWidth, color} = useBoardContext();

    useEffect(() => {
        if (selectedTool === "pen" || selectedTool === "eraser") {
            movingElement.current = null;
            setElements(elements.map((el) => {
                el.isMoving = false;
                el.isEditingMode = false;
                return el;
            }))
        } else if (selectedTool === "pointer") {
            setActive(false);
        }
    }, [selectedTool]);

    const onDrawingStart = (touchInfo: TouchInfo) => {
        setActive(true);
        setPaths((currentPaths: any[]) => {
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
        setPaths((currentPaths: any[]) => {
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

    const onStartedTouchElement = (touchInfo: TouchInfo) => {
        const {x, y} = scaledPosition(touchInfo, scale);
        const touchedElement = elements.find((el) => positionWithinElement({x, y}, el));
        let doubleClick = false;
        const now = Date.now();
        if (touchedElement !== undefined) {
            if (now - lastClickTime < 300 && touchedElement.id === lastTouchedElement.current?.id) {
                doubleClick = true;
            }
            lastTouchedElement.current = touchedElement;
        }
        if (doubleClick) {
            movingElement.current = null;
        } else {
            movingElement.current = touchedElement;
        }

        setElements(elements.map((el) => {
            const isTouchedElement = el.id === touchedElement?.id;
            el.isMoving = isTouchedElement;
            el.isEditingMode = isTouchedElement && doubleClick;
            if (isTouchedElement) {
                el.position = movedPosition(el, {x, y});
            }
            return el;
        }))
        setLastClickTime(now);
    }

    const touchHandler = useTouchHandler(
        {
            onStart: (touchInfo) => {
                setActive(false);
                switch (selectedTool) {
                    case "pointer":
                        onStartedTouchElement(touchInfo);
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
                setActive(false);
            },
        },
        [active, onDrawingActive, onDrawingStart]
    );


    return (
        <Canvas style={style.canvas} onTouch={editable ? touchHandler : undefined}>
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
    );
};

const style = StyleSheet.create({
    canvas: {
        flex: 1,
        width: "100%",
    },
});

export default BoardCanvas;