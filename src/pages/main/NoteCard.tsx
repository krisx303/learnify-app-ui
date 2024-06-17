import React from 'react';
import {Card, Title, Paragraph, TouchableRipple, Text, IconButton, Icon} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import styles from './Card.scss';
import { NoteSummary } from './Types';

interface NoteCardProps {
    note: NoteSummary;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('CardPage', { noteId: note.id, workspaceId: note.workspace.id});
    };

    return (
        <TouchableRipple onPress={handlePress} style={styles.cardContainer}>
            <Card key={note.id} style={styles.card}>
                <Card.Content style={{height: 280}}>
                    <Title style={styles.cardHeader}>{note.title}</Title>
                    <View style={styles.line} />
                    <Paragraph style={styles.details}>{note.description}</Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Przeglądano: {note.updatedAt?.substring(0, 10)}</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Autor: {note.author?.displayName}</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Z przestrzeni: {note.workspace.displayName}</Text>
                    </Paragraph>
                    <View style={styles.iconContainer}>
                        <Icon
                            source="fountain-pen"
                            color="#000"
                            size={26}
                        />
                    </View>
                </Card.Content>
            </Card>
        </TouchableRipple>
    );
};

export default NoteCard;
