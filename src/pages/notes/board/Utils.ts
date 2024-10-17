import {PathWithColorAndWidth, Position} from "./types";
import {PathDto} from "../../../transport/HttpClient";
import {Skia, TouchInfo} from "@shopify/react-native-skia";
import {GenericMovableElement} from "./GenericMovableElement";

export function svgRectangleBorder(x: number, y: number, width: number, height: number) {
    return `M ${x} ${y} H ${x + width} V ${y + height} H ${x} L ${x} ${y}`;
}

export function asPathWithColorAndWidth(path: PathDto): PathWithColorAndWidth {
    return {
        path: Skia.Path.MakeFromSVGString(path.path),
        color: path.color,
        strokeWidth: path.strokeWidth,
        blendMode: path.blendMode,
    } as PathWithColorAndWidth;
}

export function asPathDto(path: PathWithColorAndWidth): PathDto {
    return {
        path: path.path.toSVGString(),
        color: path.color,
        strokeWidth: path.strokeWidth,
        blendMode: path.blendMode,
    }
}

export function asElementDto(element: GenericMovableElement) {
    return {
        id: element.id,
        position: element.position,
        content: element.content,
        width: element.width,
        height: element.height,
        type: element.type,
    }
}

export function scaledPosition(touchInfo: TouchInfo, scale: number) {
    const {x, y, force} = touchInfo;
    return {x: x * (1 / scale), y: y * (1 / scale), force};
}

export function randomId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export function randomPosition(): Position {
    return {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
    }
}

export function positionWithinElement(position: Position, el: GenericMovableElement): boolean {
    return position.x >= el.position.x &&
        position.x <= el.position.x + el.width &&
        position.y >= el.position.y &&
        position.y <= el.position.y + el.height
}

export function movedPosition(el: GenericMovableElement, position: Position): Position {
    return {
        x: position.x - el.width / 2,
        y: position.y - el.height / 2,
    }
}