import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Button, SegmentedButtons, TextInput, Title} from 'react-native-paper';
import {useHttpClient} from '../../transport/HttpClient';
import GenericModal from "./GenericModal";
import {WorkspaceDropdownSelector} from "./WorkspaceDropdownSelector";
import {AccessType, NoteType, Workspace} from "../../pages/main/Types";

export type NoteCreateDetails = {
    title: string;
    description: string;
    workspaceId: string;
    type: NoteType;
    resourceAccessTypeDto: AccessType;
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
    const [noteType, setNoteType] = useState<NoteType>('BOARD');
    const [accessType, setAccessType] = useState<AccessType>('PUBLIC');
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
        onSubmit({
            title: noteName,
            description,
            workspaceId: workspace,
            type: noteType,
            resourceAccessTypeDto: accessType
        });
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
                <Text style={{marginBottom: 5}}>Type:</Text>
                <SegmentedButtons
                    value={noteType}
                    onValueChange={(value) => setNoteType(value === 'board' ? 'BOARD' : 'DOCUMENT')}
                    buttons={[
                        {value: 'BOARD', label: 'Board'},
                        {value: 'DOCUMENT', label: 'Document'},
                    ]}
                    style={{marginBottom: 10}}
                />
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
