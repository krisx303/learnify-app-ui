import React, {useContext, useEffect, useRef, useState} from 'react';
import {ImageBackground, View, StyleSheet} from 'react-native';
import {useHttpClient} from "../../../transport/HttpClient";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import DrawerProvider, {DrawerContext} from "../../../components/drawer/DrawerProvider";
import NoteDrawer from "../../../components/drawer/NoteDrawer";
import {StackNavigationProp} from "@react-navigation/stack";
import {NoteSummary} from "../../main/Types";
import {useAuth} from "../../../components/auth/AuthProvider";
import AuthorizedResource, {useUserAccessToResource} from "../../../components/AuthorizedResource";
import {ModularTopBar, OptionsButtons, PageControlPanel, UserDetailsWithMenu} from "../../../components/topbar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase";
import {randomId} from "../../../components/notes/board/Utils";

type NotePageRouteProp = RouteProp<RootStackParamList, "DocumentNotePage">;
type NavigationProps = StackNavigationProp<RootStackParamList, 'DocumentNotePage'>;


const DocumentNotePage = ({noteId, workspaceId}: {noteId: string, workspaceId: string}) => {
    const iframeRef = useRef(null);
    const httpClient = useHttpClient();
    const [confirmed, setConfirmed] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    const { toggleDrawer, setDrawerContent, drawerVisible } = useContext(DrawerContext);
    const [noteDetails, setNoteDetails] = useState<NoteSummary | undefined>(undefined);
    const { user } = useAuth();
    const {userAccess} = useUserAccessToResource();
    const editable = userAccess === "RW";
    const [currentPage, setCurrentPage] = useState(1);
    const [version, setVersion] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    const handleImageContent = async (clipboardItem: ClipboardItem) => {
        const blob = await clipboardItem.getType("image/png");

        // Upload image to Firebase Storage
        const imageId = randomId(); // Generate unique ID for the image
        const storageRef = ref(storage, `images/${noteId}/${imageId}.png`);

        try {
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            // Send the image URL to the iframe
            sendMessageToIframe({request: 'INSERT_IMAGE', src: downloadURL});
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const sendMessageToIframe = (message: any) => {
        if (iframeRef.current) {
            console.log('Sending message to iframe:', message);
            // @ts-ignore
            iframeRef.current.contentWindow.postMessage(message, '*');
        }else {
            setTimeout(() => {
                if(!confirmed)
                sendMessageToIframe(message);
            }, 100);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
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
        httpClient
            .getDocumentPageContent(workspaceId, noteId, currentPage)
            .then((content) => {
                setVersion(content.version);
                setTimeout(() => {
                    const contentToSend = content.content ? content.content : "EMPTY";
                    sendMessageToIframe({editable: editable, content: contentToSend});
                }, 100);
            })
            .catch(console.error);
    }, [currentPage]);

    useEffect(() => {
        const receiveMessage = (event: any) => {
            if (event.data === 'CONFIRMED') {
                setConfirmed(true);
            }
            else if (event.data.startsWith('SAVE ')) {
                const content = event.data.substring(5);
                httpClient
                    .putDocumentNotePageUpdate(workspaceId, noteId, currentPage, version, content)
                    .then(() => {console.log('Content saved');})
                    .catch(console.error);
            }else if (event.data === 'REQUEST_IMAGE_INSERTION') {
                navigator.clipboard.read().then((clipboardItems) => {
                    clipboardItems.forEach((clipboardItem) => {
                        clipboardItem.types.forEach((type) => {
                            if (type === "image/png") {
                                handleImageContent(clipboardItem);
                            }
                        });
                    });
                });
            }
            // Handle the message received from the iframe
        };

        window.addEventListener('message', receiveMessage);

        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, [currentPage, version]);

    const onPreviousPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const onNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const createNewPage = () => {
        httpClient.createNewDocumentPage(workspaceId, noteId)
            .then(() => {
                setTotalPages((prev) => prev + 1);
                setCurrentPage((prev) => prev + 1);
            })
            .catch(console.error);
    }

    return (
        <View style={styles.container}>
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
                        previousPage={onPreviousPage}
                        nextPage={onNextPage}
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
            <iframe src="./../../../../assets/dist/index.html" height={'100%'} width={'100%'} ref={iframeRef} style={{border: 'none'}}/>
        </View>
    );
};

const DocumentNoteWrapper: React.FC = () => {

    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;

    return (
        <ImageBackground source={require('../../../../assets/purple_background.png')} style={styles.container}>
            <DrawerProvider>
                <AuthorizedResource resourceId={noteId} resourceType="NOTE">
                    <DocumentNotePage noteId={noteId} workspaceId={workspaceId}/>
                </AuthorizedResource>
            </DrawerProvider>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
})


export default DocumentNoteWrapper;