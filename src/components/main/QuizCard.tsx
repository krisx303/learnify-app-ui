import React from 'react';
import {Card, Title, Paragraph, Text, TouchableRipple} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {QuizSummary} from '../../pages/main/Types';
import ProgressBar from '../ProgressBar';
import {RootStackParamList} from "../../../App";
import {StackNavigationProp} from "@react-navigation/stack";

interface QuizCardProps {
    quiz: QuizSummary;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const QuizCard: React.FC<QuizCardProps> = ({quiz}) => {
    const navigation = useNavigation<NavigationProps>();

    const handlePress = () => {
        navigation.navigate('QuizPage', {quizId: quiz.id, workspaceId: quiz.workspace.id});
    };
    const lastTryDate = new Date(quiz.lastTryDate);
    return (
        <TouchableRipple onPress={handlePress} style={styles.cardContainer}>
            <Card key={quiz.id} style={styles.card}>
                <Card.Content style={{flex: 1}}>
                    <Title style={styles.cardHeader}>{quiz.title}</Title>
                    <View style={styles.line}/>
                    <Paragraph style={styles.details}>Score: {quiz.score === "-1" ? "0" : quiz.score}</Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>{quiz.score === "-1" ? "Jeszcze nie rozwiązywano" : "Rozwiązano: "+ lastTryDate.toDateString() + ", " + lastTryDate.toLocaleTimeString()}</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Autor: {quiz.author.displayName}</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Z przestrzeni: {quiz.workspace.displayName}</Text>
                    </Paragraph>
                    <ProgressBar progress={parseInt(quiz.score)}/>
                </Card.Content>
            </Card>
        </TouchableRipple>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        margin: 40,
    },
    card: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        width: 300,
        height: 300,
    },
    cardHeader: {
        color: '#590d82',
        fontSize: 18,
        fontWeight: 'bold',
    },
    line: {
        height: 4,
        backgroundColor: '#590d82',
        marginVertical: 10,
        marginHorizontal: 0,
    },
    details: {
        color: '#666666',
        marginVertical: 5,
        marginHorizontal: 0,
        fontSize: 15,
    },
    iconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        padding: 10,
        backgroundColor: '#b19cd9',
        borderRadius: 50,
    },
})

export default QuizCard;
