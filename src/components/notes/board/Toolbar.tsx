import React, {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Color, Colors, strokes, Action} from "./types";
import {IconButton, PaperProvider} from "react-native-paper";
import {useBoardContext} from "./BoardContext";

type ToolbarProps = {
    onAction: (action: Action) => void;
    editable: boolean;
};

type Extension = "color" | "stroke" | "none";


export const Toolbar = ({
                            onAction,
                            editable,
                        }: ToolbarProps) => {
    const [extension, setExtension] = useState<Extension>("none");

    const {color, setColor, strokeWidth, setStrokeWidth, setSelectedTool, selectedTool} = useBoardContext();
    const handleStrokeWidthChange = (stroke: number) => {
        setStrokeWidth(stroke);
        setExtension("none");
    };

    const handleChangeColor = (color: Color) => {
        setColor(color);
        setExtension("none");
    };

    const toggleExtension = (asd: Extension) => {
        if (extension === "none") {
            setExtension(asd);
        } else if (asd !== extension) {
            setExtension(asd);
        }else {
            setExtension("none");
        }
    }

    return (
        <PaperProvider>
            {extension === "stroke" && (
                <View style={[style.toolbarExtension, style.strokeToolbar]}>
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
            {extension === "color" && (
                <View style={[style.toolbarExtension, style.colorToolbar]}>
                    {Colors.map((item) => (
                        <ColorButton
                            isSelected={item === color}
                            key={item}
                            color={item}
                            onPress={() => handleChangeColor(item)}
                        />
                    ))}
                </View>
            )}
            <View style={[style.toolbar, !editable && style.disabled]}>
                <IconButton
                    icon={'arrow-top-left'}
                    size={26}
                    iconColor={'#000000'}
                    onPress={() => {setSelectedTool('pointer')}}
                    style={selectedTool === 'pointer' ? style.selectedTool : {}}
                />
                <IconButton
                    icon={'pen'}
                    size={26}
                    iconColor={color}
                    onPress={() => {setSelectedTool('pen')}}
                    style={selectedTool === 'pen' ? style.selectedTool : {}}
                />
                <IconButton
                    icon={'eraser-variant'}
                    size={26}
                    iconColor={'#000000'}
                    onPress={() => {setSelectedTool('eraser')}}
                    style={selectedTool === 'eraser' ? style.selectedTool : {}}
                />
                <Pressable
                    style={style.toolbarButton}
                    onPress={() => toggleExtension("stroke")}
                >
                    <Text>{strokeWidth}</Text>
                </Pressable>
                <Pressable
                    style={style.toolbarButton}
                    onPress={() => toggleExtension("color")}
                >
                    <View style={[style.colorButton, {backgroundColor: color}]}/>
                </Pressable>
                <View style={style.separator}/>
                <IconButton
                    icon={'content-paste'}
                    size={26}
                    iconColor={'#000000'}
                    onPress={() => {onAction('paste')}}
                />
                <IconButton
                    icon={'format-text'}
                    size={26}
                    iconColor={'#000000'}
                    onPress={() => {onAction('add-text')}}
                />
                <IconButton
                    icon={'plus'}
                    size={26}
                    iconColor={'#000000'}
                    onPress={() => {onAction('add-image')}}
                />
                <IconButton
                    icon={'undo'}
                    size={26}
                    iconColor={'#000000'}
                    onPress={() => {onAction('undo')}}
                />
            </View>
        </PaperProvider>
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

const style = StyleSheet.create({
    selectedTool: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 100,
    },
    disabled: {
        opacity: 0.5,
        pointerEvents: "none",
    },
    toolbar: {
        backgroundColor: "#ffffff",
        width: 60,
        borderRadius: 100,
        borderColor: "#f0f0f0",
        borderWidth: 1,
        flexDirection: "column",
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        zIndex: 100,
    },
    toolbarExtension: {
        position: "absolute",
        zIndex: 200,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        borderRadius: 10,
        padding: 10,
    },
    strokeToolbar: {
        top: 164,
        left: 50,
    },
    colorToolbar: {
        top: 225,
        left: 50,
    },
    colorButton: {
        width: 30,
        height: 30,
        borderRadius: 100,
        margin: 5,
    },
    separator: {
        height: 30,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        marginVertical: 10,
    },
    toolbarButton: {
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    strokeOption: {
        fontSize: 18,
        backgroundColor: "#f7f7f7",
        padding: 5,
        borderRadius: 5,
        margin: 5,
    },
});

export default Toolbar;
