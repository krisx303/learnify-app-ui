import React from 'react';
import Board from "./Board";
import DrawerProvider from "../DrawerProvider";
import AuthenticatedResource from "../../AuthorizedResource";
import AuthorizedResource from "../../AuthorizedResource";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";

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
                <Board noteId={noteId} workspaceId={workspaceId}/>
            </AuthorizedResource>
        </DrawerProvider>
    );
};


export default BoardWrapper;
