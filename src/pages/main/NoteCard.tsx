import React from 'react';
import { Card, Title, Paragraph, TouchableRipple, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from './Card.scss';
import { Note } from './Types';

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        // Navigate to the Card page
        navigation.navigate('CardPage', { noteId: note.id, workspaceId: 1});
    };

    return (
        <TouchableRipple onPress={handlePress}>
        <Card key={note.id} style={styles.card}>
            <Card.Content>
                <Title style={styles.cardHeader}>{note.title}</Title>
                <Paragraph>{note.summary}</Paragraph>
                <Paragraph style={styles.details}>
                    <Text>Author: {note.author}</Text>
                    <Text>Date: {note.date}</Text>
                </Paragraph>
            </Card.Content>
        </Card>
        </TouchableRipple>
    );
};

export default NoteCard;
