import React from 'react';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import styles from './Card.scss';
import { Note } from './Types';

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    return (
        <Card key={note.id} style={styles.card}>
            <Card.Content>
                <Title style={styles.cardHeader}>{note.title}</Title>
                <Paragraph>{note.summary}</Paragraph>
                {/* Additional details */}
                <Paragraph style={styles.details}>
                    {/* Add additional details here */}
                    <Text>Author: {note.author}</Text>
                    <Text>Date: {note.date}</Text>
                </Paragraph>
            </Card.Content>
        </Card>
    );
};

export default NoteCard;
