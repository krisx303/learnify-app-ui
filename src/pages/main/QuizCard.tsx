import React from 'react';
import { Card, Title, Paragraph, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import styles from './Card.scss';
import { QuizSummary } from './Types';
import ProgressBar from './ProgressBar';
import {RootStackParamList} from "../../../App";
import {StackNavigationProp} from "@react-navigation/stack";

interface QuizCardProps {
    quiz: QuizSummary;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
    const navigation = useNavigation<NavigationProps>();

    const handlePress = () => {
        navigation.navigate('QuizPage', { quizId: quiz.id, workspaceId: quiz.workspaceId });
    };

    return (
        <TouchableRipple onPress={handlePress} style={styles.cardContainer}>
            <Card key={quiz.id} style={styles.card}>
                <Card.Content style={{ flex: 1 }}>
                    <Title style={styles.cardHeader}>{quiz.title}</Title>
                    <View style={styles.line} />
                    <Paragraph style={styles.details}>Score: {quiz.score}</Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Rozwiązywano: dziś</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Autor: {quiz.author.displayName}</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Z przestrzeni: {quiz.workspaceId}</Text>
                    </Paragraph>
                    <ProgressBar progress={parseInt(quiz.score)} />
                </Card.Content>
            </Card>
        </TouchableRipple>
    );
};

export default QuizCard;
