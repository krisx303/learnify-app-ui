import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Button, SegmentedButtons, TextInput, Title} from 'react-native-paper';
import {useHttpClient} from "../../transport/HttpClient";
import {AccessType, Workspace} from "../../pages/main/Types";
import GenericModal from "./GenericModal";
import WorkspaceDropdown, {WorkspaceProps} from "../search/WorkspaceDropdown";

export interface QuizCreateDetails {
    title: string;
    description: string;
    workspaceId: string;
    resourceAccessTypeDto: AccessType;
}

interface CreateQuizModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (quiz: QuizCreateDetails) => void;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({isVisible, onClose, onSubmit}) => {
    const [quizName, setQuizName] = useState('');
    const [description, setDescription] = useState('');
    const [workspace, setWorkspace] = useState<WorkspaceProps | undefined>(undefined);
    const [accessType, setAccessType] = useState<AccessType>('PUBLIC');
    const [errorQuizName, setErrorQuizName] = useState('');
    const [workspaceOptions, setWorkspaceOptions] = useState<Workspace[]>([]);
    const [errorWorkspace, setErrorWorkspace] = useState('');
    const httpClient = useHttpClient();

    useEffect(() => {
        httpClient.getWorkspaces()
            .then((workspaces) => {
                setWorkspaceOptions(workspaces);
                setWorkspace(workspaces[0]);
            })
            .catch(console.error);
    }, [httpClient, isVisible]);

    useEffect(() => {
        if (quizName) {
            setErrorQuizName('');
        }
        if (workspace) {
            setErrorWorkspace('');
        }
    }, [quizName, workspace]);

    const handleQuizSubmit = () => {
        if (quizName.trim() === '') {
            setErrorQuizName('* Quiz Name is required');
            return;
        }
        if (!workspace) {
            setErrorWorkspace('* Workspace is required');
            return;
        }
        onSubmit({title: quizName, description, workspaceId: workspace.id, resourceAccessTypeDto: accessType});
        setQuizName('');
        setDescription('');
        setWorkspace(undefined);
        setErrorQuizName('');
        setErrorWorkspace('');
        onClose();
    };

    return (
        <GenericModal visible={isVisible} onClose={onClose}>
            <GenericModal.Header>
                <Title>Create New Quiz</Title>
            </GenericModal.Header>
            <GenericModal.Body>
                <TextInput
                    style={styles.input}
                    mode="outlined"
                    label="Quiz Name"
                    value={quizName}
                    onChangeText={setQuizName}
                />
                {errorQuizName ? <Text style={styles.errorText}>{errorQuizName}</Text> : null}
                <TextInput
                    style={[styles.input, {height: 80}]}
                    label="Description (optional)"
                    value={description}
                    mode="outlined"
                    onChangeText={setDescription}
                    multiline={true}
                />
                <WorkspaceDropdown workspaces={workspaceOptions} setSelectedWorkspace={setWorkspace} selectedWorkspace={workspace}/>
                {errorWorkspace ? <Text style={styles.errorText}>{errorWorkspace}</Text> : null}
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

export default CreateQuizModal;
