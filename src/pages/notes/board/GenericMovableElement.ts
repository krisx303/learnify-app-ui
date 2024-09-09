import {Position} from "./types";

export type GenericMovableElement = {
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
};

export const createGenericMovableElement = (
    id: string,
    startPosition: Position,
    content: string,
    width: number,
    height: number,
    updateElements: (value: (((prevState: GenericMovableElement[]) => GenericMovableElement[]) | GenericMovableElement[])) => void
) => {
    const element = {
        id,
        position: startPosition,
        isMoving: false,
        isEditingMode: false,
        content: content,
        width,
        height,
        setPosition: (position: Position) => {
            element.position = position;
            updateElements((prevElements) =>
                prevElements.map((el) =>
                    el.id === id
                        ? {
                            ...el,
                            position: position,
                        }
                        : el
                )
            );
        },
        setIsMoving: (isMoving: boolean) => {
            element.isMoving = isMoving;
            updateElements((prevElements) =>
                prevElements.map((el) => (el.id === id ? {...el, isMoving} : el))
            );
        },
        setIsEditingMode: (isEditingMode: boolean) => {
            element.isEditingMode = isEditingMode;
            updateElements((prevElements) =>
                prevElements.map((el) =>
                    el.id === id ? {...el, isEditingMode} : el
                )
            );
        },
    } as GenericMovableElement;
    return element;
};