import {SkPath} from "@shopify/react-native-skia";

export type Color = (typeof Colors)[number];

export const Colors = ["black", "red", "blue", "green", "yellow", "white"];

export type Tool = (typeof Tools)[number];

export const Tools = ["pointer", "pen", "eraser"];

export type Action = (typeof Actions)[number];

export const Actions = ["paste", "add", "undo"];

export type PathWithColorAndWidth = {
    path: SkPath;
    color: Color;
    strokeWidth: number;
};

export type Position = {
    x: number;
    y: number;
}

export const strokes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];