import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, StyleSheet, ImageBackground} from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import {ModularTopBar, UserDetailsWithMenu} from "../../components/topbar";
import OwnerDropdown, {OwnerProps} from "../../components/search/OwnerDropdown";
import WorkspaceDropdown, {WorkspaceProps} from "../../components/search/WorkspaceDropdown";
import {ResourceSummary, useHttpClient} from "../../transport/HttpClient";
import GenericFilterButtons from '../../components/search/GenericFilterButtons';
import ResourceCard from "../../components/search/ResourceCard";
import {NoteSummary} from "./Types";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";

type NavigationProps = StackNavigationProp<RootStackParamList, 'ResourceSearchPage'>;

const ResourceSearchPage = () => {
    const [resourceType, setResourceType] = useState<string | undefined>();
    const [resourceName, setResourceName] = useState<string>('');
    const [selectedAuthor, setSelectedAuthor] = useState<OwnerProps | undefined>();
    const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceProps | undefined>();
    const [isPublic, setIsPublic] = useState<boolean | undefined>(undefined);
    const httpClient = useHttpClient();
    const [resources, setResources] = useState<ResourceSummary[]>([]);
    const [owners, setOwners] = useState<OwnerProps[]>([]);
    const [workspaces, setWorkspaces] = useState<WorkspaceProps[]>([]);
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        httpClient.searchUsers("", "")
            .then(setOwners)
            .catch(console.error);
        httpClient.getWorkspaces()
            .then(setWorkspaces)
            .catch(console.error);
    }, []);

    useEffect(() => {
        filterResources();
    }, [resourceType, resourceName, selectedAuthor, selectedWorkspace, isPublic]);

    const filterResources = () => {
        httpClient.searchResources(resourceType, resourceName, selectedAuthor?.id, selectedWorkspace?.id, isPublic)
            .then(setResources)
            .catch(console.error);
    };

    const resetFilters = () => {
        setResourceType(undefined);
        setResourceName('');
        setSelectedAuthor(undefined);
        setSelectedWorkspace(undefined);
        setIsPublic(undefined);
    };

    const navigateToResource = (resource: any) => {
        switch (resource.resourceType) {
            case "NOTE":
                const noteSummary = resource as NoteSummary;
                if(noteSummary.type === "BOARD") {
                    navigation.navigate("BoardNotePage", {workspaceId: noteSummary.workspace.id, noteId: noteSummary.id});
                }else if(noteSummary.type === "DOCUMENT") {
                    navigation.navigate("DocumentNotePage", {workspaceId: noteSummary.workspace.id, noteId: noteSummary.id});
                }
                break;
            case "QUIZ":
                navigation.navigate("QuizPage", {workspaceId: resource.workspace.id, quizId: resource.id});
                break;
            default:
                console.error('Unknown resource type:', resource.resourceType);
        }
    };
    return (
        <ImageBackground
            source={require("../../../assets/purple_background.png")}
            style={styles.background}
        >
            <ModularTopBar
                rightContent={<UserDetailsWithMenu displayUsername/>}
            />
            <View style={styles.container}>
                {/* Filter Panel */}
                <View style={styles.filterPanel}>
                    <Title style={styles.filterTitle}>Filters</Title>

                    <GenericFilterButtons
                        label="Resource Type"
                        options={[
                            { label: 'Note', value: 'Note' },
                            { label: 'Quiz', value: 'Quiz' },
                        ]}
                        selectedValue={resourceType}
                        onSelect={setResourceType}
                    />

                    <Text style={styles.filterLabel}>Resource Name</Text>
                    <TextInput
                        value={resourceName}
                        onChangeText={setResourceName}
                        onEndEditing={filterResources}
                        placeholder="Search by name"
                        style={styles.textInput}
                    />

                    <OwnerDropdown
                        owners={owners}
                        selectedOwner={selectedAuthor}
                        setSelectedOwner={setSelectedAuthor}
                    />

                    <WorkspaceDropdown
                        workspaces={workspaces}
                        selectedWorkspace={selectedWorkspace}
                        setSelectedWorkspace={setSelectedWorkspace}
                    />

                    <GenericFilterButtons
                        label="Resource access type"
                        options={[
                            { label: 'Public', value: true },
                            { label: 'Private', value: false },
                        ]}
                        selectedValue={isPublic}
                        onSelect={setIsPublic}
                    />

                    <Button mode="contained" onPress={resetFilters} style={styles.applyButton}>
                        Reset Filters
                    </Button>
                </View>

                <ScrollView style={styles.resourceList}>
                    <Title style={styles.resourceTitle}>Resources</Title>
                    {resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onPress={() => navigateToResource(resource)}
                        />
                    ))}
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
    },
    background: {
        width: '100%',
        height: '100%',
    },
    filterPanel: {
        width: 400,
        padding: 16,
        backgroundColor: '#f4f4f4',
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    filterTitle: {
        marginBottom: 16,
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterLabel: {
        marginTop: 16,
        marginBottom: 8,
        fontSize: 16,
    },
    filterButton: {
        marginRight: 8,
        marginBottom: 8,
    },
    textInput: {
        marginBottom: 16,
    },
    applyButton: {
        marginTop: 24,
    },
    resourceList: {
        flex: 1,
        padding: 16,
    },
    resourceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#fff',
    },
});

export default ResourceSearchPage;
