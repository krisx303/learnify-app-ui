import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Switch} from 'react-native';
import {Title, TextInput, Button} from 'react-native-paper';
import {useHttpClient} from "../../../transport/HttpClient";
import {Workspace} from "../Types";
import {generateID} from "./Utils";
import GenericModal from "./GenericModal";
import {WorkspaceDropdownSelector} from "./WorkspaceDropdownSelector";

export interface QuizCreateDetails {
    name: string;
    description: string;
    workspaceId: string;
}

interface CreateQuizModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (quiz: QuizCreateDetails) => void;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({isVisible, onClose, onSubmit}) => {
    const [quizName, setQuizName] = useState('');
    const [description, setDescription] = useState('');
    const [workspace, setWorkspace] = useState('');
    const [errorQuizName, setErrorQuizName] = useState('');
    const [workspaceOptions, setWorkspaceOptions] = useState<Workspace[]>([]);
    const httpClient = useHttpClient();

    useEffect(() => {
        httpClient.getWorkspaces()
            .then(setWorkspaceOptions)
            .catch(console.error);
    }, [httpClient]);

    useEffect(() => {
        if (quizName) {
            setErrorQuizName('');
        }
    }, [quizName]);

    const handleQuizSubmit = () => {
        if (quizName.trim() === '') {
            setErrorQuizName('* Quiz Name is required');
            return;
        }
        onSubmit({name: quizName, description, workspaceId: workspace});
        setQuizName('');
        setDescription('');
        setWorkspace('');
        setErrorQuizName('');
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
                <WorkspaceDropdownSelector
                    selectedValue={workspace}
                    onValueChange={setWorkspace}
                    workspaceOptions={workspaceOptions}
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
