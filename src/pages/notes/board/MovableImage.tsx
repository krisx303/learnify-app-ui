import React from 'react';
import {Box, Image, rect, rrect, useImage} from '@shopify/react-native-skia';
import {GenericMovableElement} from "./GenericMovableElement";

interface MovableImageProps {
    element: GenericMovableElement;
}

const MovableImage = ({
                          element
}: MovableImageProps) => {
    const image = useImage(element.content);

    if (!image) {
        return null;
    }

    return (
        <>

            {(element.isEditingMode || element.isMoving) && <Box
                box={rrect(rect(element.position.x - 5, element.position.y - 5, element.width + 10, element.height + 10), 0, 0)}
                color={element.isEditingMode ? "#14188f" : "#13d27a"}/>}
            <Image
                image={image}
                x={element.position.x}
                y={element.position.y}
                width={element.width}
                height={element.height}
            />
        </>
    );
};

export default MovableImage;
