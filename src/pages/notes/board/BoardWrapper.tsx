import React from 'react';
import Board from "./Board";
import DrawerProvider from "../DrawerProvider";
import AuthenticatedResource from "../../AuthorizedResource";
import AuthorizedResource from "../../AuthorizedResource";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import {BoardContextProvider} from "../../../components/notes/board/BoardContext";

type NotePageRouteProp = RouteProp<RootStackParamList, "BoardNotePage">;

const BoardWrapper: React.FC = () => {
    const route = useRoute<NotePageRouteProp>();
    const {noteId, workspaceId} = route.params;

    return (
        <DrawerProvider>
            <link
                rel="preload"
                href="/assets/Roboto-Medium.ttf"
                as="font"
                crossOrigin=""
            />
            <AuthorizedResource resourceId={noteId} resourceType="NOTE">
                <BoardContextProvider>
                    <Board noteId={noteId} workspaceId={workspaceId}/>
                </BoardContextProvider>
            </AuthorizedResource>
        </DrawerProvider>
    );
};


export default BoardWrapper;
