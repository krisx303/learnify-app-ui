import {StyleSheet, View, Text} from "react-native";
import React, {useEffect, useState} from "react";
import {Button} from "react-native-paper";
import {TabView, SceneMap, TabBar} from "react-native-tab-view";
import PermissionsTabContent from "./PermissionsTabContent";

interface DrawerProps {
    workspaceId: string;
    onClose: () => void;
    isOwner: boolean;
    ownerId: string;
}

const NoteDrawer = ({onClose, workspaceId, isOwner, ownerId}: DrawerProps) => {
    const [index,setIndex] = useState(0);
    const [routes, setRoutes] = useState([
        {key: 'permissions', title: 'Permissions'}
    ]);

    useEffect(() => {
        if(isOwner) {
            setRoutes([
                {key: 'permissions', title: 'Permissions'}
            ])
        }
        else {
            setRoutes([])
        }
    }, [workspaceId, isOwner]);

    const renderScene = SceneMap({
        permissions: () => <PermissionsTabContent resourceId={workspaceId} resourceType={'WORKSPACE'} ownerId={ownerId}/>
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
