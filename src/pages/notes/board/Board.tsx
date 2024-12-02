import React, {useContext, useEffect, useState} from "react";
import {ImageBackground, StyleSheet, View} from "react-native";
import styles from "../../CardPage.scss";
import {Action, PathWithColorAndWidth} from "../../../components/notes/board/types";
import {Toolbar} from "../../../components/notes/board/Toolbar";
import {createGrid} from "../../../components/notes/board/Grid";
import {useHttpClient, ElementDto} from "../../../transport/HttpClient";
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import {
    createGenericMovableElement,
    createGenericMovableElementFromDto,
    GenericMovableElement
} from "../../../components/notes/board/GenericMovableElement";
import {
    asElementDto,
    asPathDto,
    asPathWithColorAndWidth,
    randomId,
    randomPosition,
} from "../../../components/notes/board/Utils";
import {TextInputComponent} from "../../../components/notes/board/TextInputComponent";
import {DrawerContext} from "../DrawerProvider";
import NoteDrawer from "../NoteDrawer";
import {StackNavigationProp} from "@react-navigation/stack";
import {NoteSummary} from "../../main/Types";
import {useAuth} from "../../auth/AuthProvider";
import {useUserAccessToResource} from "../../AuthorizedResource";
import {ModularTopBar, OptionsButtons, PageControlPanel, UserDetailsWithMenu} from "../../../components/topbar";
import BoardCanvas from "../../../components/notes/board/BoardCanvas";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase";

type NavigationProps = StackNavigationProp<RootStackParamList, 'BoardNotePage'>;

const Board = ({noteId, workspaceId}: { noteId: string, workspaceId: string }) => {
    const [backgroundImage, setBackgroundImage] = useState("");
    const [elements, setElements] = useState<GenericMovableElement[]>([]);
    const [paths, setPaths] = useState<PathWithColorAndWidth[]>([]);
    const [shouldSendState, setShouldSendState] = useState(false);
    const httpClient = useHttpClient();
    const [noteDetails, setNoteDetails] = useState<NoteSummary | undefined>(undefined);
    const [canvasWidth, setCanvasWidth] = useState(0); // Current width of the canvas container
    const navigation = useNavigation<NavigationProps>();
    const {toggleDrawer, setDrawerContent, drawerVisible} = useContext(DrawerContext);
    const {user} = useAuth();
    const {userAccess} = useUserAccessToResource();
    const editable = userAccess === "RW";
    const [currentPage, setCurrentPage] = useState(1);
    const [version, setVersion] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const asGenericMovableElements = (elements: ElementDto[]) => {
        return elements.map((element) => {
            return createGenericMovableElementFromDto(element, setElements);
        });
    };

    useEffect(() => {
        setDrawerContent(
            <NoteDrawer
                noteId={noteId}
                onClose={toggleDrawer}
                navigateToQuiz={(workspaceId, quizId) => navigation.navigate('QuizPage', {workspaceId, quizId})}
                isOwner={noteDetails?.author.id === user?.uid}
                ownerId={noteDetails?.author.id ?? ""}
            />);
    }, [drawerVisible]);

    const createMovableImage = () => {
        const element = createGenericMovableElement(
            randomId(),
            randomPosition(),
            "https://miro.medium.com/v2/resize:fit:700/1*TtczOh1ZzrAsPLBaA5SxHg.png",
            560,
            480,
            'image',
            setElements
        );
        setElements((prevElements) => [...prevElements, element]);
    };

    const createMovableText = () => {
        const element = createGenericMovableElement(
            randomId(),
            randomPosition(),
            "Hello World",
            100,
            30,
            'text',
            setElements
        );
        element.isEditingMode = true;
        setElements((prevElements) => [...prevElements, element]);
    }

    useEffect(() => {
        const gridImage = createGrid(30);
        setPaths([]);
        setElements([]);
        setCurrentPage(1);
        setBackgroundImage(gridImage);
        setVersion(1);
        setTotalPages(1);
        httpClient
            .getNoteDetails(workspaceId, noteId)
            .then((note) => {
                setNoteDetails(note);
                setTotalPages(note.pagesCount);
            })
            .catch(console.error);
    }, [workspaceId, noteId, httpClient]);

    useEffect(() => {
        setPaths([]);
        setElements([]);
        setVersion(1);
        httpClient
            .getBoardPageContent(workspaceId, noteId, currentPage)
            .then((content) => {
                setPaths(content.content.paths.map(asPathWithColorAndWidth));
                setElements(asGenericMovableElements(content.content.elements));
                setVersion(content.version);
            })
            .catch(console.error);
    }, [currentPage]);

    const handleTextContent = async () => {
        const text = await navigator.clipboard.readText();
        const element = createGenericMovableElement(
            randomId(),
            randomPosition(),
            text,
            text.length * 10,
            30,
            'text',
            setElements
        );
        setElements((prevElements) => [...prevElements, element]);
    };

    const handleImageContent = async (clipboardItem: ClipboardItem) => {
        const blob = await clipboardItem.getType("image/png");

        // Upload image to Firebase Storage
        const imageId = randomId(); // Generate unique ID for the image
        const storageRef = ref(storage, `images/${noteId}/${imageId}.png`);

        try {
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            // Load and display the image from Firebase Storage
            const img = new Image();
            img.src = downloadURL;

            img.onload = () => {
                console.log(`Image Dimensions: ${img.width}x${img.height}`);
                const element = createGenericMovableElement(
                    randomId(),
                    randomPosition(),
                    downloadURL,
                    img.width,
                    img.height,
                    'image',
                    setElements
                );
                setElements((prevElements) => [...prevElements, element]);
            };
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const pasteContent = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type === "text/plain") {
                        await handleTextContent();
                    } else if (type === "image/png") {
                        await handleImageContent(clipboardItem);
                    }
                }
            }
        } catch (error) {
            console.error("Error reading clipboard content:", error);
        }
    };


    const performAction = (action: Action) => {
        if (!editable) {
            return;
        }
        switch (action) {
            case "add":
                break;
            case "undo":
                setPaths((currentPaths) =>
                    currentPaths.slice(0, currentPaths.length - 1)
                );
                break;
            case "paste":
                pasteContent();
                break;
            case "save":
                setShouldSendState(true);
                break;
            case "add-text":
                createMovableText();
                break
        }
    };

    useEffect(() => {
        const handleEvent = (event: any) => {
            if (event.ctrlKey && event.key === "z") {
                performAction("undo");
            } else if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                performAction("save");
            }
        };
        window.addEventListener("paste", pasteContent);

        window.addEventListener("keydown", handleEvent);

        return () => {
            window.removeEventListener("keydown", handleEvent);
            window.removeEventListener("paste", pasteContent);
        };
    }, []);

    useEffect(() => {
        if (shouldSendState) {
            httpClient
                .putBoardNotePageUpdate(workspaceId, noteId, currentPage, version, {
                    elements: elements.map(asElementDto),
                    paths: paths.map(asPathDto),
                })
                .then(() => setShouldSendState(false))
                .catch((error) => {
                    console.error(error);
                    setShouldSendState(false);
                });
        }
    }, [shouldSendState]);

    const handleLayout = (event: any) => {
        const {width} = event.nativeEvent.layout;
        setCanvasWidth(width);
    };

    const createNewPage = () => {
        setCurrentPage((prev) => prev + 1);
        setTotalPages((prev) => prev + 1);
        httpClient.createNewBoardPage(workspaceId, noteId)
            .catch(console.error);
    }

    return (
        <View style={{width: "100%", height: "100%", maxHeight: "100%"}}>
            <ModularTopBar
                breadcrumbs={[
                    {
                        text: noteDetails?.workspace.displayName ?? "Workspace",
                        onPress: () => navigation.navigate('WorkspacePage', {workspaceId})
                    },
                    {text: noteDetails?.title ?? "Note"}
                ]}
                centerContent={noteDetails &&
                    <PageControlPanel
                        pageNumber={currentPage}
                        totalPages={totalPages}
                        previousPage={() => setCurrentPage(currentPage - 1)}
                        nextPage={() => setCurrentPage(currentPage + 1)}
                        canCreateNewPage={editable}
                        createNewPage={createNewPage}
                    />
                }
                rightContent={
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <OptionsButtons onPress={toggleDrawer}/>
                        <UserDetailsWithMenu/>
                    </View>
                }
            />
            <View style={styles.content}>
                <View style={style.container} onLayout={handleLayout}>
                    <ImageBackground
                        source={{uri: backgroundImage}}
                        style={styles.imageBackground}
                        resizeMode="repeat"
                    >
                        <BoardCanvas
                            editable={editable}
                            paths={paths}
                            canvasWidth={canvasWidth}
                            setPaths={setPaths}
                            elements={elements}
                            setElements={setElements}
                        />

                        <TextInputComponent genericMovableElements={elements} setElements={setElements}/>
                    </ImageBackground>
                </View>
                <View style={styles.toolPanel}>
                    <Toolbar
                        onAction={performAction}
                        editable={editable}
                    />
                </View>
            </View>
        </View>
    );
};

export default Board;

const style = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        aspectRatio: 2,
    },
});