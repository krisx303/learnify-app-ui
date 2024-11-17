import {Color, Colors, strokes, Tool} from "./types";
import React, {createContext, ReactNode, useContext, useState} from "react";

type BoardContextType = {
    color: Color;
    setColor: (color: Color) => void;
    strokeWidth: number;
    setStrokeWidth: (strokeWidth: number) => void;
    selectedTool: Tool;
    setSelectedTool: (tool: Tool) => void;
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

type BoardProviderProps = {
    children: ReactNode;
};

export const BoardContextProvider: React.FC<BoardProviderProps> = ({ children }) => {
    const [color, setColor] = useState<Color>(Colors[0]); // Default color
    const [strokeWidth, setStrokeWidth] = useState<number>(strokes[0]); // Default stroke width
    const [selectedTool, setSelectedTool] = useState<Tool>("pen"); // Default tool

    return (
        <BoardContext.Provider
            value={{
                color,
                setColor,
                strokeWidth,
                setStrokeWidth,
                selectedTool,
                setSelectedTool,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};

export const useBoardContext = (): BoardContextType => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error("useBoardContext must be used within a BoardContextProvider");
    }
    return context;
};