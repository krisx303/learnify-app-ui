import {
    Canvas,
    Path,
    SkPath,
    Skia,
    TouchInfo,
    useTouchHandler,
} from "@shopify/react-native-skia";
import React, {useEffect, useState} from "react";
import {ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import Two from "two.js";
import styles from "../CardPage.scss";

type PathWithColorAndWidth = {
    path: SkPath;
    color: Color;
    strokeWidth: number;
};

const Drawing = () => {
    const [backgroundImage, setBackgroundImage] = useState('');
    const user = {
        username: 'JohnDoe',
        avatarUrl: 'https://cdn2.iconfinder.com/data/icons/people-round-icons/128/man_avatar-512.png',
    };

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

    const touchHandler = useTouchHandler(
        {
            onActive: onDrawingActive,
            onStart: onDrawingStart,
            onEnd: () => {
                setActive(false)
            },
        },
        [onDrawingActive, onDrawingStart]
    );

    return (
        <View style={styles.content}>
            <View style={styles.toolPanel}>
                <Toolbar
                    color={color}
                    strokeWidth={strokeWidth}
                    setColor={setColor}
                    setStrokeWidth={setStrokeWidth}
                />
            </View>
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
                    </Canvas>
                </ImageBackground>
            </View>
        </View>
    );
};

const Colors = ["black", "red", "blue", "green", "yellow", "white"] as const;

type Color = (typeof Colors)[number];

type ToolbarProps = {
    color: Color;
    strokeWidth: number;
    setColor: (color: Color) => void;
    setStrokeWidth: (strokeWidth: number) => void;
};

const strokes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

export const Toolbar = ({
                            color,
                            strokeWidth,
                            setColor,
                            setStrokeWidth,
                        }: ToolbarProps) => {
    const [showStrokes, setShowStrokes] = useState(false);

    const handleStrokeWidthChange = (stroke: number) => {
        setStrokeWidth(stroke);
        setShowStrokes(false);
    };

    const handleChangeColor = (color: Color) => {
        setColor(color);
    };

    return (
        <>
            {showStrokes && (
                <View style={[style.toolbar, style.strokeToolbar]}>
                    {strokes.map((stroke) => (
                        <Pressable
                            onPress={() => handleStrokeWidthChange(stroke)}
                            key={stroke}
                        >
                            <Text style={style.strokeOption}>{stroke}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
            <View style={[style.toolbar]}>
                <Pressable
                    style={style.currentStroke}
                    onPress={() => setShowStrokes(!showStrokes)}
                >
                    <Text>{strokeWidth}</Text>
                </Pressable>
                <View style={style.separator}/>
                {Colors.map((item) => (
                    <ColorButton
                        isSelected={item === color}
                        key={item}
                        color={item}
                        onPress={() => handleChangeColor(item)}
                    />
                ))}
            </View>
        </>
    );
};

type ColorButtonProps = {
    color: Color;
    isSelected: boolean;
    onPress: () => void;
};

const ColorButton = ({color, onPress, isSelected}: ColorButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                style.colorButton,
                {backgroundColor: color},
                isSelected && {
                    borderWidth: 2,
                    borderColor: "black",
                },
            ]}
        />
    );
};

export default Drawing;

const style = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    strokeOption: {
        fontSize: 18,
        backgroundColor: "#f7f7f7",
        zIndex: 100000,
    },
    toolbar: {
        backgroundColor: "#ffffff",
        height: "100%",
        width: 50,
        borderRadius: 100,
        borderColor: "#f0f0f0",
        borderWidth: 1,
        flexDirection: "column",
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    separator: {
        height: 30,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        marginHorizontal: 10,
    },
    currentStroke: {
        backgroundColor: "#f7f7f7",
        borderRadius: 5,
    },
    strokeToolbar: {
        height: 300,
        width: 50,
        position: "absolute",
        top: 120,
        left: 40,
        justifyContent: "space-between",
        zIndex: 100,
        flexDirection: "column",
    },
    colorButton: {
        width: 30,
        height: 30,
        borderRadius: 100,
        marginVertical: 5,
    },
});