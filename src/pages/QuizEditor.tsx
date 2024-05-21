import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import TopBar from './main/TopBar';
import {RootStackParamList} from "../../App";
import {QuestionCard} from "./QuestionCard";
import {useHttpClient} from "../transport/HttpClient";
import {QuizDetails} from "./quiz/summmary/QuizDetails";
import {Question} from "./quiz/creation/Question";
import {IconButton} from "react-native-paper";

type QuizEditorRouteProp = RouteProp<RootStackParamList, 'QuizEditor'>;

const QuizEditor: React.FC = () => {
    const route = useRoute<QuizEditorRouteProp>();
    const {quizId, workspaceId} = route.params;
    const httpClient = useHttpClient();
    const [quizDetails, setQuizDetails] = useState({} as QuizDetails);
    const [questions, setQuestions] = useState([] as Question[]);
    const [expanded, setExpanded] = useState<boolean[]>([]);

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

    return (
        <View style={styles.container}>
            <TopBar text={quizDetails.name}/>
            <View style={styles.innerContainer}>
                <View style={styles.quizInfoContainer}>
                    <Text style={styles.quizTitle}>{quizDetails.name}</Text>
                    <Text style={styles.quizDescription}>{quizDetails.description}</Text>
                </View>
                <View style={styles.scrollContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {questions.map((question, index) => (
                            <View style={styles.cardContainer} key={index}>
                                <TouchableOpacity key={question.question} onPress={() => toggleExpand(index)}
                                                  style={{flex: 1}}>
                                    <QuestionCard
                                        question={question}
                                        isExpanded={expanded[index]}
                                        onEdit={() => {
                                        }}
                                        onDelete={() => {
                                        }}
                                    />
                                </TouchableOpacity>
                                <View style={styles.actionsContainer}>
                                    <View style={styles.actionIcon}>
                                        <IconButton
                                            icon={'pencil'}
                                            size={26}
                                            iconColor={'#ffffff'}
                                            onPress={() => {
                                                console.log('Edit question')
                                            }}
                                        />
                                    </View>
                                    <View style={styles.actionIcon}>
                                        <IconButton
                                            icon={'trash-can-outline'}
                                            size={26}
                                            iconColor={'#ffffff'}
                                            onPress={() => {
                                                console.log('Delete question')
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundImage: 'linear-gradient(to bottom right, #390854, #590d82)',
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
        minWidth: 'min(max(40%, 1000px), 100%)',
        padding: 16,
        backgroundColor: 'white',
        maxWidth: 1000,
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
    },
    scrollContent: {
        width: '100%',
        padding: 16,
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 4,
    },
    actionIcon: {
        paddingVertical: 8,
    }
});

export default QuizEditor;
