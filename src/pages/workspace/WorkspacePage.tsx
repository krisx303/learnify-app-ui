import React, {useContext, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    useWindowDimensions, ImageBackground
} from 'react-native';
import {ModularTopBar, OptionsButtons, UserDetailsWithMenu} from "../../components/topbar";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {useHttpClient} from "../../transport/HttpClient";
import {DetailedWorkspace, NoteSummary, Workspace} from "../main/Types";
import {MaterialIcons} from "@expo/vector-icons";
import {DrawerContext, DrawerProvider} from "../../components/drawer/DrawerProvider";
import WorkspaceDrawer from '../../components/drawer/WorkspaceDrawer';
import {useAuth} from "../../components/auth/AuthProvider";
import AuthorizedResource from "../../components/AuthorizedResource";

type NavigationProps = StackNavigationProp<RootStackParamList, 'WorkspacePage'>;
type RouteProps = RouteProp<RootStackParamList, 'WorkspacePage'>;

const WorkspacePage = ({ workspaceId}: {workspaceId: string}) => {
    const { width: windowWidth } = useWindowDimensions();
    const httpClient = useHttpClient();
    const [workspace, setWorkspace] = useState<DetailedWorkspace>();
    const [resources, setResources] = useState<any[]>([]);
    const { toggleDrawer, setDrawerContent, drawerVisible } = useContext(DrawerContext);
    const [subWorkspaces, setSubWorkspaces] = useState<Workspace[]>([]);
    const { user } = useAuth();
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        fetchWorkspaceData();
    }, [workspaceId])

    useEffect(() => {
        setDrawerContent(
            <WorkspaceDrawer
                workspaceId={workspaceId}
                onClose={toggleDrawer}
                isOwner={workspace?.author.id === user?.uid}
                ownerId={workspace?.author.id ?? ""}
            />);
    }, [drawerVisible]);

    const fetchWorkspaceData = () => {
        httpClient.searchResources(undefined, "", undefined, workspaceId, undefined, 0)
            .then(setResources);
        httpClient.getWorkspaceDetails(workspaceId)
            .then((workspaceDetails) => {
                setWorkspace(workspaceDetails);
                setSubWorkspaces(workspaceDetails.childWorkspaces.map(w => ({ ...w, resourceType: 'WORKSPACE' })));
            });
    }

    function onNavigateToItem(item: any) {
        switch (item.resourceType) {
            case 'WORKSPACE':
                navigation.navigate("WorkspacePage", { workspaceId: item.id });
                break;
            case "NOTE":
                const noteSummary = item as NoteSummary;
                if (noteSummary.type === "BOARD") {
                    navigation.push("BoardNotePage", { workspaceId: noteSummary.workspace.id, noteId: noteSummary.id });
                } else if (noteSummary.type === "DOCUMENT") {
                    navigation.push("DocumentNotePage", { workspaceId: noteSummary.workspace.id, noteId: noteSummary.id });
                }
                break;
            case "QUIZ":
                navigation.push("QuizPage", { workspaceId: item.workspace.id, quizId: item.id });
                break;
        }
    }

    function onNavigateBack() {
        if (workspace?.parentWorkspace) {
            navigation.navigate("WorkspacePage", { workspaceId: workspace.parentWorkspace.id });
        }
    }

    const getIcon = (item: any) => {
        switch (item.resourceType) {
            case 'WORKSPACE':
                return 'folder';
            case 'NOTE':
                if (item.type === 'DOCUMENT')
                    return 'description';
                return 'edit';
            case 'QUIZ':
                return 'school';
        }
    }

    const renderItem = ({ item }: {item: any}) => {
        const icon = getIcon(item);
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => onNavigateToItem(item)}>
                <View style={{marginRight: 10}}>
                    <MaterialIcons name={icon} color="#000" size={26}/>
                </View>
                <View style={{flexDirection: "column"}}>
                    <Text style={styles.itemType}>{item.resourceType === "WORKSPACE" ? 'Workspace' : 'Resource'}</Text>
                    <Text
                        style={styles.itemName}>{item.resourceType === "WORKSPACE" ? item.displayName : item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
       <>
            <ModularTopBar
                breadcrumbs={[{text: workspace?.displayName || 'Workspace'}]}
                rightContent={
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <OptionsButtons onPress={toggleDrawer}/>
                        <UserDetailsWithMenu/>
                    </View>
                }
            />
        <View style={[styles.container, { width: windowWidth < 650 ? '95%' : '60%' }]}>
            {workspace && workspace.parentWorkspace && (
                <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
                    <Text style={styles.backButtonText}>Back to {workspace.parentWorkspace.displayName}</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>Workspace: {workspace?.displayName}</Text>

               <FlatList
                   data={[...subWorkspaces, ...resources]}
                   keyExtractor={(item) => item.id}
                   renderItem={renderItem}
                   contentContainerStyle={styles.listContainer}
               />
        </View>
       </>
    );
};

const WorkspacePageWrapper: React.FC = () => {
    const route = useRoute<RouteProps>();
    const {workspaceId} = route.params;

    return <ImageBackground style={{flex: 1, width: "100%", height: "100%"}} source={require("../../../assets/purple_background.png")}
                            imageStyle={{resizeMode: "cover"}}>
        <DrawerProvider>
            <AuthorizedResource resourceId={workspaceId} resourceType="WORKSPACE">
                <WorkspacePage workspaceId={workspaceId}/>
            </AuthorizedResource>
        </DrawerProvider>
    </ImageBackground>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        paddingVertical: 20,
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    listContainer: {
        paddingHorizontal: 10,
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemType: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 5,
    },
    itemLastUpdated: {
        fontSize: 12,
        color: '#999',
    },
    backButton: {
        marginVertical: 20,
        backgroundColor: '#cdc8e8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: 'fit-content',
    },
    backButtonText: {
        color: '#45158c',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default WorkspacePageWrapper;