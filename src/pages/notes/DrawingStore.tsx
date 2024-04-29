import {DrawingInfo, SkPaint, SkPath} from '@shopify/react-native-skia';
import { create } from 'zustand'
import utils from "./utils";

export type CurrentPath = {
    path: SkPath;
    paint: SkPaint;
    color?: string;
};

type Store = {
    /**
     * Array of completed paths for redrawing on the `Canvas`
     */
    completedPaths: CurrentPath[];
    /**
     * A function to update completed paths
     */
    setCompletedPaths: (completedPaths: CurrentPath[]) => void;
    stroke: SkPaint;
    /**
     * Width of the stroke, used when creating stroke.
     */
    strokeWidth: number;
    /**
     * Color of the stroke
     */
    color: string;
    setStrokeWidth: (strokeWidth: number) => void;
    setColor: (color: string) => void;
    setStroke: (stroke: SkPaint) => void;

    /**
     Width & height information of the canvas used for svg export
     */
    canvasInfo: Partial<DrawingInfo> | null;
    setCanvasInfo: (canvasInfo: Partial<DrawingInfo>) => void;
}

export const useDrawingStore = create<Store>()((set) => ({
    completedPaths: [],
    setCompletedPaths: (completedPaths) => set({ completedPaths }),
    strokeWidth: 5,
    color: 'black',
    stroke: utils.getPaint(2, 'black'),
    setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
    setColor: (color) => set({ color }),
    setStroke: stroke => {
        set({stroke});
    },
    canvasInfo: null,
    setCanvasInfo: (canvasInfo) => set({ canvasInfo })
}))