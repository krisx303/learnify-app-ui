import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
import styles from './Card.scss';
import { Quiz } from './Types';

interface QuizCardProps {
    quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
    return (
        <Card key={quiz.id} style={styles.card}>
            <Card.Content>
                <Title>{quiz.title}</Title>
                <Paragraph>Score: {quiz.score}</Paragraph>
            </Card.Content>
        </Card>
    );
};

export default QuizCard;
