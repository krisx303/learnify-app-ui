import { useCallback, useEffect, useRef, useState } from "react";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { getSelectedNode, positionEditorElement } from "./utils";

function FloatingLinkEditor({ editor }) {
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const mouseDownRef = useRef(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [isEditMode, setEditMode] = useState(false);
    const [lastSelection, setLastSelection] = useState(null);

    const updateLinkEditor = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const parent = node.getParent();

            setLinkUrl($isLinkNode(parent) ? parent.getURL() : $isLinkNode(node) ? node.getURL() : "");
        }

        const editorElem = editorRef.current;
        const nativeSelection = window.getSelection();
        const activeElement = document.activeElement;

        if (!editorElem) return;

        const rootElement = editor.getRootElement();
        if (
            selection &&
            !nativeSelection.isCollapsed &&
            rootElement?.contains(nativeSelection.anchorNode)
        ) {
            const domRange = nativeSelection.getRangeAt(0);
            const rect =
                nativeSelection.anchorNode === rootElement
                    ? getInnerMostChild(rootElement).getBoundingClientRect()
                    : domRange.getBoundingClientRect();

            if (!mouseDownRef.current) {
                positionEditorElement(editorElem, rect);
            }
            setLastSelection(selection);
        } else if (activeElement?.className !== "link-input") {
            resetEditorState(editorElem);
        }

        return true;
    }, [editor]);

    const getInnerMostChild = (element) => {
        while (element.firstElementChild) {
            element = element.firstElementChild;
        }
        return element;
    };

    const resetEditorState = (editorElem) => {
        positionEditorElement(editorElem, null);
        setLastSelection(null);
        setEditMode(false);
        setLinkUrl("");
    };

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(updateLinkEditor);
            }),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => updateLinkEditor(), 1)
        );
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        editor.getEditorState().read(updateLinkEditor);
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditMode]);

    const handleInputChange = (event) => setLinkUrl(event.target.value);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (lastSelection) {
                if (linkUrl)
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                setEditMode(false);
            }
        } else if (event.key === "Escape") {
            event.preventDefault();
            setEditMode(false);
        }
    };

    const handleEditClick = () => setEditMode(true);

    return (
        <div ref={editorRef} className="link-editor">
            {isEditMode ? (
                <input
                    ref={inputRef}
                    className="link-input"
                    value={linkUrl}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <div className="link-input">
                    <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                        {linkUrl}
                    </a>
                    <div
                        className="link-edit"
                        role="button"
                        tabIndex={0}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={handleEditClick}
                    />
                </div>
            )}
        </div>
    );
}

export default FloatingLinkEditor;
