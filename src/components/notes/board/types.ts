import {BlendMode, SkPath} from "@shopify/react-native-skia";
import {SkEnum} from "@shopify/react-native-skia/lib/typescript/src/dom/types/Common";

export type Color = (typeof Colors)[number];

export const Colors = ["black", "red", "blue", "green", "yellow", "purple"];

export type Tool = "pointer" | "pen" | "eraser";

export type Action = "paste" | "add-image" | "undo" | "save" | "clear" | "add-text";

export type PathWithColorAndWidth = {
    path: SkPath;
    color: Color;
    strokeWidth: number;
    blendMode: SkEnum<typeof BlendMode>;
};

export type Position = {
    x: number;
    y: number;
}

export type ElementType = 'text' | 'image';

export const strokes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];