import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Button, SegmentedButtons, TextInput, Title} from 'react-native-paper';
import GenericModal from "./GenericModal";
import {AccessType} from "../../pages/main/Types";
import WorkspaceDropdown, {WorkspaceProps} from "../search/WorkspaceDropdown";
import {useHttpClient} from "../../transport/HttpClient";

export interface WorkspaceCreateProps {
    title: string;
    resourceAccessTypeDto: AccessType;
    parentWorkspaceId?: string;
}

interface CreateQuizModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (quiz: WorkspaceCreateProps) => void;
}

const CreateWorkspaceModal: React.FC<CreateQuizModalProps> = ({isVisible, onClose, onSubmit}) => {
    const [workspaceName, setWorkspaceName] = useState('');
    const [errorWorkspaceName, setErrorWorkspaceName] = useState('');
    const [accessType, setAccessType] = useState<AccessType>('PUBLIC');
    const [parentWorkspace, setParentWorkspace] = useState<WorkspaceProps | undefined>(undefined);
    const [workspaces, setWorkspaces] = useState<WorkspaceProps[]>([]);
    const httpClient = useHttpClient();

    useEffect(() => {
        if (isVisible) {
            httpClient.getWorkspaces()
                .then(setWorkspaces)
                .catch(console.error);
        }
    }, [isVisible]);

    useEffect(() => {
        if (workspaceName) {
            setErrorWorkspaceName('');
        }
    }, [workspaceName]);

    const handleQuizSubmit = () => {
        if (workspaceName.trim() === '') {
            setErrorWorkspaceName('* Workspace Name is required');
            return;
        }
        onSubmit({title: workspaceName, resourceAccessTypeDto: accessType, parentWorkspaceId: parentWorkspace?.id});
        setWorkspaceName('');
        setErrorWorkspaceName('');
        onClose();
    };

    return (
        <GenericModal visible={isVisible} onClose={onClose}>
            <GenericModal.Header>
                <Title>Create New Workspace</Title>
            </GenericModal.Header>
            <GenericModal.Body>
                <TextInput
                    style={styles.input}
                    mode="outlined"
                    label="Workspace Name"
                    value={workspaceName}
                    onChangeText={setWorkspaceName}
                />
                <Text style={{marginBottom: 5, marginTop: 10}}>Permission level:</Text>
                <SegmentedButtons
                    value={accessType}
                    onValueChange={(value) => setAccessType(value === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE')}
                    buttons={[
                        {value: 'PUBLIC', label: 'PUBLIC'},
                        {value: 'PRIVATE', label: 'PRIVATE'},
                    ]}
                    style={{marginBottom: 10}}
                />
                <Text style={{marginBottom: 5}}>Parent Workspace: (optional)</Text>
                {errorWorkspaceName ? <Text style={styles.errorText}>{errorWorkspaceName}</Text> : null}
                <WorkspaceDropdown workspaces={workspaces} selectedWorkspace={parentWorkspace} setSelectedWorkspace={setParentWorkspace}/>
            </GenericModal.Body>
            <GenericModal.Footer>
                <Button
                    mode="outlined"
                    onPress={onClose}
                    style={[styles.button, styles.cancelButton]}
                    labelStyle={{color: '#7912b0'}}
                >
                    Cancel
                </Button>
                <Button
                    mode="contained"
                    onPress={handleQuizSubmit}
                    style={[styles.button, styles.submitButton]}
                    labelStyle={{color: 'white'}}
                >
                    Submit
                </Button>
            </GenericModal.Footer>
        </GenericModal>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 40,
        marginBottom: 5,
        paddingLeft: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    cancelButton: {
        borderColor: '#7912b0',
        color: '#7912b0',
    },
    submitButton: {
        backgroundColor: '#7912b0',
    },
});

export default CreateWorkspaceModal;
