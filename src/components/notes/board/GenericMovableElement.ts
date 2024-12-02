import {Position, ElementType} from "./types";
import {ElementDto} from "../../../transport/HttpClient";

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
    type: ElementType;
};

export const createGenericMovableElementFromDto = (
    element: ElementDto,
    updateElements: (value: (((prevState: GenericMovableElement[]) => GenericMovableElement[]) | GenericMovableElement[])) => void
): GenericMovableElement => createGenericMovableElement(
    element.id,
    element.position,
    element.content,
    element.width,
    element.height,
    element.type,
    updateElements
)

export const createGenericMovableElement = (
    id: string,
    startPosition: Position,
    content: string,
    width: number,
    height: number,
    type: ElementType,
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
        type,
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