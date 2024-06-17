import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Switch} from 'react-native';
import {Title, TextInput, Button} from 'react-native-paper';
import {useHttpClient} from '../../../transport/HttpClient';
import GenericModal from "./GenericModal";
import {WorkspaceDropdownSelector} from "./WorkspaceDropdownSelector";
import {Workspace} from "../Types";
import {generateID} from "./Utils";

export type NoteCreateDetails = {
    title: string;
    description: string;
    workspaceId: string;
}
interface CreateNoteModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (note: NoteCreateDetails) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({isVisible, onClose, onSubmit}) => {
    const [noteName, setNoteName] = useState('');
    const [description, setDescription] = useState('');
    const [workspace, setWorkspace] = useState('');
    const [errorNoteName, setErrorNoteName] = useState('');
    const [workspaceOptions, setWorkspaceOptions] = useState<Workspace[]>([]);
    const httpClient = useHttpClient();

    useEffect(() => {
        httpClient.getWorkspaces()
            .then((workspaces) => {
                setWorkspaceOptions(workspaces);
                setWorkspace(workspaces[0].id);
            })
            .catch(console.error);
    }, [httpClient, isVisible]);

    useEffect(() => {
        if (noteName) {
            setErrorNoteName('');
        }
    }, [noteName]);

    const handleNoteSubmit = () => {
        if (noteName.trim() === '') {
            setErrorNoteName('* Note Name is required');
            return;
        }
        onSubmit({title: noteName, description, workspaceId: workspace});
        setNoteName('');
        setDescription('');
        setWorkspace('');
        setErrorNoteName('');
        onClose();
    };

    return (
        <GenericModal visible={isVisible} onClose={onClose}>
            <GenericModal.Header>
                <Title>Create New Note</Title>
            </GenericModal.Header>
            <GenericModal.Body>
                <TextInput
                    style={styles.input}
                    mode="outlined"
                    label="Note Name"
                    value={noteName}
                    onChangeText={setNoteName}
                />
                {errorNoteName ? <Text style={styles.errorText}>{errorNoteName}</Text> : null}
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
                    onPress={handleNoteSubmit}
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

export default CreateNoteModal;
