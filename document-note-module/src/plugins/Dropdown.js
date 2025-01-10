import {useEffect, useRef} from "react";
import {$createParagraphNode, $getSelection, $isRangeSelection,} from "lexical";
import {$wrapNodes} from "@lexical/selection";

import {INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND,} from "@lexical/list";
import {$createHeadingNode, $createQuoteNode} from "@lexical/rich-text";
import {$createCodeNode} from "@lexical/code";

const DropdownButton = ({
                            iconClass,
                            text,
                            isActive,
                            onClick,
                        }) => (
    <button className="item" onClick={onClick}>
        <span className={`icon ${iconClass}`}/>
        <span className="text">{text}</span>
        {isActive && <span className="active"/>}
    </button>
);

const Dropdown = ({
                      editor,
                      currentBlockType,
                      toolbarRef,
                      closeDropDown,
                  }) => {
    const dropDownRef = useRef(null);

    useEffect(() => {
        const dropDown = dropDownRef.current;
        const toolbar = toolbarRef.current;

        if(!toolbar || !dropDown) return;

        const {top, left} = toolbar.getBoundingClientRect();
        dropDown.style.top = `${top + 40}px`;
        dropDown.style.left = `${left}px`;
        const handleClickOutside = (event) => {
            const target = event.target;

            if (!dropDown.contains(target) && !toolbar.contains(target)) {
                closeDropDown();
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dropDownRef, toolbarRef]);

    const formatBlock = (targetBlockType, createNodeCallback) => {
        // If the target block type is not the current one
        if (currentBlockType !== targetBlockType) {
            // Update the editor state and wrap the selected nodes in the target block type
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, createNodeCallback);
                }
            });
        }

        closeDropDown();
    };

    const formatList = (targetBlockType, createListCommand) => {
        if (currentBlockType !== targetBlockType) {
            // If the target block type is not the current one create list element
            editor.dispatchCommand(createListCommand);
        } else {
            // If the target block type is the current one remove the existing list element
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }

        closeDropDown();
    }

    return (
        <div className="dropdown" ref={dropDownRef}>
            <DropdownButton
                iconClass="paragraph"
                text="Normal"
                isActive={currentBlockType === "paragraph"}
                onClick={() => formatBlock("paragraph", $createParagraphNode)}
            />
            <DropdownButton
                iconClass="large-heading"
                text="Large Heading"
                isActive={currentBlockType === "h1"}
                onClick={() => formatBlock("h1", () => $createHeadingNode("h1"))}
            />
            <DropdownButton
                iconClass="small-heading"
                text="Small Heading"
                isActive={currentBlockType === "h2"}
                onClick={() => formatBlock("h2", () => $createHeadingNode("h2"))}
            />
            <DropdownButton
                iconClass="bullet-list"
                text="Bullet List"
                isActive={currentBlockType === "ul"}
                onClick={() => formatList("ul", INSERT_UNORDERED_LIST_COMMAND)}
            />
            <DropdownButton
                iconClass="numbered-list"
                text="Numbered List"
                isActive={currentBlockType === "ol"}
                onClick={() => formatList("ol", INSERT_ORDERED_LIST_COMMAND)}
            />
            <DropdownButton
                iconClass="quote"
                text="Quote"
                isActive={currentBlockType === "quote"}
                onClick={() => formatBlock("quote", $createQuoteNode)}
            />
            <DropdownButton
                iconClass="code"
                text="Code Block"
                isActive={currentBlockType === "code"}
                onClick={() => formatBlock("code", $createCodeNode)}
            />
        </div>
    );
};

export default Dropdown;
