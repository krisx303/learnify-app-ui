import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Switch} from 'react-native';
import {Title, TextInput, Button} from 'react-native-paper';
import {useHttpClient} from "../../../transport/HttpClient";
import {Workspace} from "../Types";
import {generateID} from "./Utils";
import GenericModal from "./GenericModal";
import {WorkspaceDropdownSelector} from "./WorkspaceDropdownSelector";

interface CreateQuizModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (quiz: { id: string; name: string; description: string; workspace: string }) => void;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({isVisible, onClose, onSubmit}) => {
    const [quizId, setQuizId] = useState('');
    const [quizName, setQuizName] = useState('');
    const [description, setDescription] = useState('');
    const [workspace, setWorkspace] = useState('');
    const [errorQuizName, setErrorQuizName] = useState('');
    const [errorQuizId, setErrorQuizId] = useState('');
    const [isOverride, setIsOverride] = useState(false);
    const [workspaceOptions, setWorkspaceOptions] = useState<Workspace[]>([]);
    const httpClient = useHttpClient();
    const [isQuizIdUnique, setIsQuizIdUnique] = useState(true);

    useEffect(() => {
        httpClient.getWorkspaces()
            .then(setWorkspaceOptions)
            .catch(console.error);
    }, [httpClient]);

    useEffect(() => {
        if (!isOverride) {
            setQuizId(generateID(quizName));
        }
        if (quizName) {
            setErrorQuizName('');
        }
    }, [isOverride, quizName]);

    useEffect(() => {
        if (!quizId) return;
        setErrorQuizId('');
        httpClient.verifyQuizIdIdentity(quizId)
            .then(setIsQuizIdUnique)
            .catch(console.error);
    }, [httpClient, quizId])

    const handleQuizSubmit = () => {
        let isError = false;
        if (quizName.trim() === '') {
            setErrorQuizName('* Quiz Name is required');
            isError = true;
        }
        if (quizId.trim() === '') {
            setErrorQuizId('* Quiz ID is required');
            isError = true;
        }
        if (isError || !isQuizIdUnique)
            return;
        onSubmit({id: quizId, name: quizName, description, workspace});
        setQuizName('');
        setQuizId('');
        setDescription('');
        setWorkspace('');
        setErrorQuizName('');
        setErrorQuizId('');
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
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, {flex: 1}]}
                        mode="outlined"
                        label="Quiz ID"
                        value={quizId}
                        onChangeText={setQuizId}
                        disabled={!isOverride}
                    />
                    <View style={styles.switchContainer}>
                        <Text>Override</Text>
                        <Switch
                            value={isOverride}
                            onValueChange={(value) => {
                                setIsOverride(value);
                                if (value) {
                                    setQuizId('');
                                }
                            }}
                        />
                    </View>
                </View>
                {errorQuizId ? <Text style={styles.errorText}>{errorQuizId}</Text> : null}
                {!isQuizIdUnique && <Text style={styles.errorText}>* Quiz ID is already used!</Text>}
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
