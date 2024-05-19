import React, {useState, useEffect} from 'react';
import {View, Button, StyleSheet, Text, Switch} from 'react-native';
import {Title, TextInput} from 'react-native-paper';
import {useHttpClient} from '../../../transport/HttpClient';
import GenericModal from "./GenericModal";
import {WorkspaceDropdownSelector} from "./WorkspaceDropdownSelector";
import {Workspace} from "../Types";
import {generateID} from "./Utils";

interface CreateNoteModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (note: { id: string; name: string; description: string; workspaceId: string }) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({isVisible, onClose, onSubmit}) => {
    const [noteId, setNoteId] = useState('');
    const [noteName, setNoteName] = useState('');
    const [description, setDescription] = useState('');
    const [workspace, setWorkspace] = useState('');
    const [errorNoteName, setErrorNoteName] = useState('');
    const [errorNoteId, setErrorNoteId] = useState('');
    const [isOverride, setIsOverride] = useState(false);
    const [workspaceOptions, setWorkspaceOptions] = useState<Workspace[]>([]);
    const httpClient = useHttpClient();
    const [isNoteIdUnique, setIsNoteIdUnique] = useState(true);

    useEffect(() => {
        httpClient.getWorkspaces()
            .then(setWorkspaceOptions)
            .catch(console.error);
    }, [httpClient]);

    useEffect(() => {
        if (!isOverride) {
            setNoteId(generateID(noteName));
        }
        if (noteName) {
            setErrorNoteName('');
        }
    }, [isOverride, noteName]);

    useEffect(() => {
        if (!noteId) return;
        setErrorNoteId('');
        httpClient.verifyNoteIdIdentity(workspace, noteId)
            .then(setIsNoteIdUnique)
            .catch(console.error);
    }, [httpClient, noteId])

    const handleNoteSubmit = () => {
        let isError = false;
        if (noteName.trim() === '') {
            setErrorNoteName('* Note Name is required');
            isError = true;
        }
        if (noteId.trim() === '') {
            setErrorNoteId('* Note ID is required');
            isError = true;
        }
        if (isError || !isNoteIdUnique)
            return;
        onSubmit({id: noteId, name: noteName, description, workspaceId: workspace});
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
                <View style={styles.row}>
                    <TextInput
                        label="Note ID"
                        mode="outlined"
                        style={[styles.input, {flex: 1}]}
                        value={noteId}
                        onChangeText={setNoteId}
                        disabled={!isOverride}
                    />
                    <View style={styles.switchContainer}>
                        <Text>Override</Text>
                        <Switch
                            value={isOverride}
                            trackColor={{false: '#c3bdce', true: '#6200ee'}}
                            onValueChange={(value) => {
                                setIsOverride(value);
                                if (value) {
                                    setNoteId('');
                                }
                            }}
                        />
                    </View>
                </View>
                {errorNoteId ? <Text style={styles.errorText}>{errorNoteId}</Text> : null}
                {!isNoteIdUnique ? <Text style={styles.errorText}>* This ID is already used!</Text> : null}
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
                <Button title="Cancel" onPress={onClose}/>
                <Button title="Submit" onPress={handleNoteSubmit}/>
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    switchContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CreateNoteModal;
