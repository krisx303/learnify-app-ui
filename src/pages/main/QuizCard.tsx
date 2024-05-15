import React from 'react';
import {Card, Title, Paragraph, Text, TouchableRipple} from 'react-native-paper';
import styles from './Card.scss';
import { QuizSummary } from './Types';
import {useNavigation} from "@react-navigation/native";

interface QuizCardProps {
    quiz: QuizSummary;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        // Navigate to the Quiz page
        navigation.navigate('QuizPage', { quizId: quiz.id, workspaceId: quiz.workspaceId});
    };

    return (
        <TouchableRipple onPress={handlePress}>
            <Card key={quiz.id} style={styles.card}>
                <Card.Content>
                    <Title style={styles.cardHeader}>{quiz.title}</Title>
                    <Paragraph style={styles.details}>Score: {quiz.score}</Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Author: {quiz.author}</Text>
                        <Text>Date: {quiz.date}</Text>
                    </Paragraph>
                </Card.Content>
            </Card>
        </TouchableRipple>
    );
};

export default QuizCard;
