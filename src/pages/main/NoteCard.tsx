import React from 'react';
import { Card, Title, Paragraph, TouchableRipple, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from './Card.scss';
import { NoteSummary } from './Types';

interface NoteCardProps {
    note: NoteSummary;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('CardPage', { noteId: note.id, workspaceId: note.workspaceId});
    };

    return (
        <TouchableRipple onPress={handlePress} style={styles.card}>
            <Card key={note.id} style={{flex: 1}}>
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
