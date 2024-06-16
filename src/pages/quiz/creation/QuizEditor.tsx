import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import TopBar from '../../main/TopBar';
import {RootStackParamList} from "../../../../App";
import {QuestionCard} from "./QuestionCard";
import {EditableQuestionCard} from "./EditableQuestionCard";
import {useHttpClient} from "../../../transport/HttpClient";
import {QuizDetails} from "../summmary/QuizDetails";
import {Question} from "../solving/Question";
import {Button, IconButton, Menu, PaperProvider} from "react-native-paper";

type QuizEditorRouteProp = RouteProp<RootStackParamList, 'QuizEditor'>;

const QuizEditor: React.FC = () => {
    const route = useRoute<QuizEditorRouteProp>();
    const {quizId, workspaceId} = route.params;
    const httpClient = useHttpClient();
    const [quizDetails, setQuizDetails] = useState({} as QuizDetails);
    const [questions, setQuestions] = useState([] as Question[]);
    const [expanded, setExpanded] = useState<boolean[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [editableQuestion, setEditableQuestion] = useState<number>(-1);

    useEffect(() => {
        httpClient.getQuizDetails(workspaceId, quizId)
            .then(setQuizDetails)
            .catch(console.error);
        httpClient.getQuizQuestions(quizId)
            .then((questions) => {
                setQuestions(questions);
                setExpanded(questions.map(() => false));
            })
            .catch(console.error);
    }, [httpClient, quizId, workspaceId]);

    const toggleExpand = (index: number) => {
        setExpanded((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const addNewQuestion = (type: string) => {
        setMenuVisible(false);
        let newQuestion: Question = {} as Question;
        if (type === "multiple-choice") {
            newQuestion = {
                question: "",
                type: "multiple-choice",
                weight: 1,
                choices: ["", "", "", ""],
                answer: [false, false, false, false],
                feedback: ["", "", "", ""],
            };
        } else if (type === "single-choice") {
            newQuestion = {
                question: "",
                type: "single-choice",
                weight: 1,
                choices: ["", "", "", ""],
                answer: 0,
                feedback: ["", "", "", ""],
            };
        }
        setQuestions([...questions, newQuestion]);
        setExpanded([...expanded, true]);
        setEditableQuestion(questions.length);
    };

    const startEditQuestion = (index: number) => {
        setEditableQuestion(index);
    };

    const cancelEditQuestion = (index: number) => {
        if (index === questions.length - 1) {
            setQuestions(questions.slice(0, -1));
            setExpanded(expanded.slice(0, -1));
        }
        setEditableQuestion(-1);
    };

    const saveQuestion = (index: number) => {
        setEditableQuestion(-1);
        //TODO add validation of question before saving
        //TODO save question to backend
    };

    const deleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
        setExpanded(expanded.filter((_, i) => i !== index));
        //TODO delete question from backend
    };

    return (
        <View style={styles.container}>
            <TopBar text={quizDetails.title}/>
            <View style={styles.innerContainer}>
                <View style={styles.quizInfoContainer}>
                    <Text style={styles.quizTitle}>{quizDetails.title}</Text>
                    <Text style={styles.quizDescription}>{quizDetails.description}</Text>
                </View>
                <View style={styles.scrollContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {questions.map((question, index) => (
                            <View style={styles.cardContainer} key={index}>
                                {editableQuestion == index ? (
                                    <View style={{flex: 1}}>
                                        <EditableQuestionCard
                                            question={question}
                                            isExpanded={expanded[index]}
                                            toggleExpand={() => toggleExpand(index)}
                                        />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => toggleExpand(index)} style={{flex: 1}}>
                                        <QuestionCard
                                            question={question}
                                            isExpanded={expanded[index]}
                                            onEdit={() => {
                                            }}
                                            onDelete={() => {
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                                {editableQuestion !== index ? (
                                    <View style={styles.actionsContainer}>
                                        <View style={styles.actionIcon}>
                                            <IconButton
                                                icon={'pencil'}
                                                size={26}
                                                iconColor={'#ffffff'}
                                                onPress={() => startEditQuestion(index)}
                                            />
                                        </View>
                                        <View style={styles.actionIcon}>
                                            <IconButton
                                                icon={'trash-can-outline'}
                                                size={26}
                                                iconColor={'#ffffff'}
                                                onPress={() => deleteQuestion(index)}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.actionContainerEditable}>
                                        <View style={{}}>
                                            <IconButton
                                                icon={'cancel'}
                                                size={26}
                                                iconColor={'#ffffff'}
                                                onPress={() => cancelEditQuestion(index)}
                                            />
                                        </View>
                                        <View style={{}}>
                                            <IconButton
                                                icon={'check'}
                                                size={26}
                                                iconColor={'#ffffff'}
                                                onPress={() => saveQuestion(index)}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                        <PaperProvider>
                            <Menu
                                style={{
                                    position: 'relative',
                                    top: 0,
                                    left: 0,
                                    width: 'max-content',
                                }}
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={
                                    (editableQuestion === -1 &&
                                        <Button mode="contained" onPress={() => setMenuVisible(true)}>
                                            Add New
                                        </Button>)
                                }>
                                <Menu.Item onPress={() => addNewQuestion("multiple-choice")}
                                           title="Multiple Choice"/>
                                <Menu.Item onPress={() => addNewQuestion("single-choice")}
                                           title="Single Choice"/>
                            </Menu>
                        </PaperProvider>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundImage: 'url(../../assets/purple_background.png), linear-gradient(to bottom right, #390854, #590d82)'
    },
    innerContainer: {
        flex: 1,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    quizInfoContainer: {
        width: '100%',
        maxWidth: 1000,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    quizTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    quizDescription: {
        fontSize: 16,
        color: '#666',
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        width: '100%',
        alignItems: 'center',
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 1000,
    },
    actionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 4,
    },
    actionContainerEditable: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 4,
        paddingRight: 55
    },
    actionIcon: {
        paddingVertical: 8,
    }
});

export default QuizEditor;
