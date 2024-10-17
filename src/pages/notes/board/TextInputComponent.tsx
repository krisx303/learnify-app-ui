import {GenericMovableElement} from "./GenericMovableElement";
import React, {useEffect, useState} from "react";
import {TextInput} from "react-native";

export const TextInputComponent = (props: {
    genericMovableElements: GenericMovableElement[],
    setElements: (elements: GenericMovableElement[]) => void
}) => {
    const [element, setElement] = useState<GenericMovableElement | undefined>(undefined);
    const [newText, setNewText] = useState("");
    useEffect(() => {
        setElement(props.genericMovableElements.find(e => e.type === "text" && e.isEditingMode));
        setNewText(element?.content || "");
    }, [props.genericMovableElements]);
    return <>
        { element && (
            <TextInput
                style={{
                    position: "absolute",
                    left: element.position.x,
                    top: element.position.y - 15,
                    width: 200, // Adjust width as needed
                    height: 30, // Adjust height as needed
                    opacity: 1, // Keep this TextInput somewhat transparent
                    backgroundColor: "white",
                }}
                value={newText}
                onChangeText={setNewText}
                onBlur={() => {element.content = newText!;element.isEditingMode = false;
                    props.setElements(props.genericMovableElements.map(e => e.id === element.id ? element : e));}} // Stop editing when losing focus
                autoFocus
            />
        )}
    </>;
};