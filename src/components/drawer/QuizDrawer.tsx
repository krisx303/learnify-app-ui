import {StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Button} from "react-native-paper";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import PermissionsTabContent from "./PermissionsTabContent";
import {NoteType} from "../../pages/main/Types";
import ConnectedNotesTabContent from "./ConnectedNotesTabContent";

interface DrawerProps {
    quizId: string;
    onClose: () => void;
    navigateToNote: (workspaceId: string, quizId: string, noteType: NoteType) => void;
    isOwner: boolean;
    ownerId: string;
}

const QuizDrawer = ({onClose, quizId, navigateToNote, isOwner, ownerId}: DrawerProps) => {
    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState([
        {key: 'notes', title: 'Notes'},
        {key: 'permissions', title: 'Permissions'},
        {key: 'comments', title: 'Comments'},
    ]);

    useEffect(() => {
        if (isOwner) {
            setRoutes([
                {key: 'notes', title: 'Notes'},
                {key: 'permissions', title: 'Permissions'},
                {key: 'comments', title: 'Comments'}
            ])
        } else {
            setRoutes([
                {key: 'notes', title: 'Notes'},
                {key: 'comments', title: 'Comments'}
            ])
        }
    }, [quizId, isOwner]);

    const navigateToNoteInternal = (workspaceId: string, noteId: string, noteType: NoteType) => {
        onClose();
        navigateToNote(workspaceId, noteId, noteType);
    };

    const renderScene = SceneMap({
        notes: () => <ConnectedNotesTabContent quizId={quizId} navigateToNoteInternal={navigateToNoteInternal}/>,
        permissions: () => <PermissionsTabContent resourceId={quizId} resourceType={'QUIZ'} ownerId={ownerId}/>,
        comments: () => (
            <View style={styles.tabContent}>
                {/* Add Comments content here */}
            </View>
        ),
    });

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Button icon="close" mode="text" textColor="white" onPress={onClose}>
                    Close
                </Button>
            </View>

            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={props => <TabBar {...props} style={{backgroundColor: 'white'}}
                                               renderLabel={({route, color}) => (
                                                   <Text style={{color: 'black', margin: 8, fontWeight: "300"}}>
                                                       {route.title}
                                                   </Text>
                                               )}/>} // <-- add this line
            />
        </View>
    );
};

export default QuizDrawer;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    topBar: {
        backgroundColor: "rgb(89, 13, 130)",
        height: 70,
        padding: 16,
        flexDirection: "row-reverse", // Align button to the right
    },
    tabContent: {
        flex: 1,
        padding: 16,
    },
});
