import React from 'react';
import {Path, Skia, Text} from '@shopify/react-native-skia';
import {GenericMovableElement} from "./GenericMovableElement";
import {svgEditButton, svgRectangleBorder} from "./Utils";

interface MovableTextProps {
    font: any;
    element: GenericMovableElement;
}

const MovableText = ({
      font, element
}: MovableTextProps) => {

    return (
        <>
            {(element.isEditingMode || element.isMoving) && <Path
                path={Skia.Path.MakeFromSVGString(svgRectangleBorder(
                    element.position.x - 5, element.position.y, element.content.length * 10, element.height))!}
                color={"black"}
                style={"stroke"}
                strokeWidth={3}
                blendMode={"src"}
            />}
            <Text
                x={element.position.x}
                y={element.position.y + 20}
                text={element.content}
                font={font!!}
            />
        </>
    );
};


export default MovableText;
