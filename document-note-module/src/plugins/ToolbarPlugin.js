import "./toolbar.css"
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from "lexical";
import {$isLinkNode, TOGGLE_LINK_COMMAND} from "@lexical/link";
import {$getNearestNodeOfType, mergeRegister} from "@lexical/utils";
import {$isListNode, ListNode} from "@lexical/list";
import {createPortal} from "react-dom";
import {$isHeadingNode} from "@lexical/rich-text";
import {$isCodeNode, getCodeLanguages, getDefaultCodeLanguage} from "@lexical/code";
import {INSERT_IMAGE_COMMAND} from "./ImagesPlugin";
import FloatingLinkEditor from "./FloatingLinkEditor";
import {Divider, getSelectedNode, Select} from "./utils";
import Dropdown from "./Dropdown";

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol"
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List"
};

const ToolbarButton = ({ onClick, disabled, className, ariaLabel, iconClass }) => (
    <button onClick={onClick} disabled={disabled} className={className} aria-label={ariaLabel}>
      <i className={`format ${iconClass}`} />
    </button>
);

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [currentBlockType, setCurrentBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setCurrentBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setCurrentBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      const node = getSelectedNode(selection);
      setIsLink($isLinkNode(node.getParent()) || $isLinkNode(node));
    }
  }, [editor]);

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        const editorState = JSON.stringify(editor.getEditorState().toJSON());
        window.parent.postMessage('SAVE ' + editorState, '*');
      }
    };
    window.addEventListener("paste", justPasteClipboard);
    window.addEventListener("keydown", handleEvent);

    return () => {
      window.removeEventListener("keydown", handleEvent);
      window.removeEventListener("paste", justPasteClipboard);
    };
  }, []);

  const handleParentMessage = (nativeEvent) => {
    console.log("Received message from parent window", nativeEvent);
    try {
      const message = nativeEvent.data;

      if(message["content"] !== undefined) {
        const editable = message["editable"];
        editor.setEditable(editable);
        if(message["content"] === "EMPTY") {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
          });
        }else {
          editor.setEditorState(  editor.parseEditorState(message["content"]))
        }
        window.parent.postMessage('CONFIRMED', '*');
      }else if(message["request"] === "INSERT_IMAGE") {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {altText: "Image", src: message["src"]});
      }
    }catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleParentMessage);

    return () => {
        window.removeEventListener('message', handleParentMessage);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  const programmingLanguages = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  if(editor.isEditable() === false) {
    return null;
  }

  const justPasteClipboard = async () => {
    console.log("Just pasting clipboard");
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type === "image/png") {
            console.log("Image found in clipboard");
            console.log("Sending IMAGE_REQUEST")
            window.parent.postMessage('REQUEST_IMAGE_INSERTION', '*');
          }
        }
      }
    } catch (error) {
      console.error("Error reading clipboard content:", error);
    }
  };

  const pasteClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();

      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer(),
      });

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const data = await clipboardItem.getType(type).then((blob) => blob.text());
          pasteEvent.clipboardData.setData(type, data);
        }
      }
      const editorRoot = editor.getRootElement();
      if (editorRoot) {
        editorRoot.dispatchEvent(pasteEvent);
      }
    } catch (error) {
      console.error("Error handling clipboard content:", error);
    }
  };

  const formatCommandButtons = [
    { command: "bold", isActive: isBold, label: "Format Bold", icon: "bold" },
    { command: "italic", isActive: isItalic, label: "Format Italics", icon: "italic" },
    { command: "underline", isActive: isUnderline, label: "Format Underline", icon: "underline" },
    { command: "strikethrough", isActive: isStrikethrough, label: "Format Strikethrough", icon: "strikethrough" },
    { command: "code", isActive: isCode, label: "Insert Code", icon: "code" },
  ];

  const alignCommandButtons = [
    { command: "left", label: "Left Align", icon: "left-align" },
    { command: "center", label: "Center Align", icon: "center-align" },
    { command: "right", label: "Right Align", icon: "right-align" },
    { command: "justify", label: "Justify Align", icon: "justify-align" },
  ];

  const OptionButtons = () => <>
    {formatCommandButtons.map(({command, isActive, label, icon}) => (
        <ToolbarButton
            key={command}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, command)}
            className={`toolbar-item spaced ${isActive ? "active" : ""}`}
            ariaLabel={label}
            iconClass={icon}
        />
    ))}
    <ToolbarButton
        onClick={insertLink}
        className={`toolbar-item spaced ${isLink ? "active" : ""}`}
        ariaLabel="Insert Link"
        iconClass="link"
    />
    {isLink && createPortal(<FloatingLinkEditor editor={editor}/>, document.body)}
    <Divider/>

    {alignCommandButtons.map(({command, label, icon}) => (
        <ToolbarButton
            key={command}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, command)}
            className="toolbar-item spaced"
            ariaLabel={label}
            iconClass={icon}
        />
    ))}

    <ToolbarButton
        onClick={pasteClipboard}
        className="toolbar-item"
        ariaLabel="Clipboard"
        iconClass="clipboard"
    />
  </>;

  return (
      <div className="toolbar" ref={toolbarRef}>
        <ToolbarButton
            onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
            disabled={!canUndo}
            className="toolbar-item spaced"
            ariaLabel="Undo"
            iconClass="undo"
        />
        <ToolbarButton
            onClick={() => editor.dispatchCommand(REDO_COMMAND)}
            disabled={!canRedo}
            className="toolbar-item"
            ariaLabel="Redo"
            iconClass="redo"
        />
        <Divider />

        {supportedBlockTypes.has(currentBlockType) && (
            <>
              <button
                  className="toolbar-item block-controls"
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                  aria-label="Formatting Options"
              >
                <span className={`icon block-type ${currentBlockType}`} />
                <span className="text">{blockTypeToBlockName[currentBlockType]}</span>
                <i className="chevron-down" />
              </button>
              {dropdownVisible &&
                  createPortal(
                      <Dropdown
                          editor={editor}
                          currentBlockType={currentBlockType}
                          toolbarRef={toolbarRef}
                          closeDropDown={() => setDropdownVisible(false)}
                      />,
                      document.body
                  )}
              <Divider />
            </>
        )}

        {currentBlockType === "code" ? (
            <>
              <Select
                  className="toolbar-item code-language"
                  onChange={onCodeLanguageSelect}
                  options={programmingLanguages}
                  value={codeLanguage}
              />
              <i className="chevron-down inside" />
            </>
        ) : <OptionButtons/>}
      </div>
  );
}
