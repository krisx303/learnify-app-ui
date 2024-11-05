import {StyleSheet, View, Dimensions, Text} from "react-native";
import React, {useEffect, useState} from "react";
import {Button} from "react-native-paper";
import {TabView, SceneMap, TabBar} from "react-native-tab-view";
import ConnectedQuizzesTabContent from "./ConnectedQuizzesTabContent";
import PermissionsTabContent from "./PermissionsTabContent";

interface DrawerProps {
    noteId: string;
    onClose: () => void;
    navigateToQuiz: (workspaceId: string, quizId: string) => void;
    isOwner: boolean;
    ownerId: string;
}

const NoteDrawer = ({onClose, noteId, navigateToQuiz, isOwner, ownerId}: DrawerProps) => {
    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState([
        {key: 'quizzes', title: 'Quizzes'},
        {key: 'permissions', title: 'Permissions'},
        {key: 'comments', title: 'Comments'},
    ]);

    useEffect(() => {
        if(isOwner) {
            setRoutes([
                {key: 'quizzes', title: 'Quizzes'},
                {key: 'permissions', title: 'Permissions'},
                {key: 'comments', title: 'Comments'}
            ])
        }
        else {
            setRoutes([
                {key: 'quizzes', title: 'Quizzes'},
                {key: 'comments', title: 'Comments'}
            ])
        }
    }, [noteId, isOwner]);

    const navigateToQuizInternal = (workspaceId: string, quizId: string) => {
        onClose();
        navigateToQuiz(workspaceId, quizId);
    };

    const renderScene = SceneMap({
        quizzes: () => <ConnectedQuizzesTabContent noteId={noteId} navigateToQuizInternal={navigateToQuizInternal}/>,
        permissions: () => <PermissionsTabContent resourceId={noteId} resourceType={'NOTE'} ownerId={ownerId}/>,
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
                renderTabBar={props => <TabBar {...props} style={{backgroundColor: 'white'}} renderLabel={({route, color}) => (
                    <Text style={{ color: 'black', margin: 8, fontWeight: "300" }}>
                        {route.title}
                    </Text>
                )}/>} // <-- add this line
            />
        </View>
    );
};

export default NoteDrawer;

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
