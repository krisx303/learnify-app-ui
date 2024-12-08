import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { ModularTopBar, UserDetailsWithMenu } from "../../components/topbar";
import OwnerDropdown, { OwnerProps } from "../../components/search/OwnerDropdown";
import WorkspaceDropdown, { WorkspaceProps } from "../../components/search/WorkspaceDropdown";
import { ResourceSummary, useHttpClient } from "../../transport/HttpClient";
import GenericFilterButtons from '../../components/search/GenericFilterButtons';
import ResourceCard from "../../components/search/ResourceCard";
import { NoteSummary } from "./Types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import {StarRatingInput} from "../../components/StarRating";
import AntDesign from "@expo/vector-icons/AntDesign";

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
    const [averageRating, setAverageRating] = useState<number>(0);
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
    }, [resourceType, resourceName, selectedAuthor, selectedWorkspace, isPublic, averageRating]);

    const filterResources = () => {
        httpClient.searchResources(resourceType, resourceName, selectedAuthor?.id, selectedWorkspace?.id, isPublic, averageRating)
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
                if (noteSummary.type === "BOARD") {
                    navigation.navigate("BoardNotePage", { workspaceId: noteSummary.workspace.id, noteId: noteSummary.id });
                } else if (noteSummary.type === "DOCUMENT") {
                    navigation.navigate("DocumentNotePage", { workspaceId: noteSummary.workspace.id, noteId: noteSummary.id });
                }
                break;
            case "QUIZ":
                navigation.navigate("QuizPage", { workspaceId: resource.workspace.id, quizId: resource.id });
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
                rightContent={<UserDetailsWithMenu displayUsername />}
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

                    <Text style={styles.filterLabel}>Min average ratings:</Text>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <StarRatingInput rating={averageRating} onRatingChange={setAverageRating}/>
                        {averageRating !== 0 && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => setAverageRating(0)}
                            >
                                <AntDesign name="closecircle" size={25} color="gray" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Button mode="contained" onPress={resetFilters} style={styles.applyButton}>
                        Reset Filters
                    </Button>
                </View>

                {/* Scrollable Resource List */}
                <View style={styles.resourceListWrapper}>
                    <ScrollView contentContainerStyle={styles.resourceList} style={styles.scrollView}>
                        {resources.map((resource) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                onPress={() => navigateToResource(resource)}
                            />
                        ))}
                    </ScrollView>
                </View>
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
        maxHeight: '100%', // Prevent filter panel from stretching too far
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
    textInput: {
        marginBottom: 16,
    },
    applyButton: {
        marginTop: 24,
    },
    resourceListWrapper: {
        flex: 1,
        padding: 10,
        maxHeight: 880,
    },
    scrollView: {
        flexGrow: 0,
    },
    resourceList: {
        padding: 20,
    },
    clearButton: {
        borderRadius: 50,
        marginLeft: 10,
    }
});

export default ResourceSearchPage;
