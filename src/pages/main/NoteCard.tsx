import React from 'react';
import {Card, Title, Paragraph, TouchableRipple, Text, Icon} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import styles from './Card.scss';
import { NoteSummary } from './Types';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";

interface NoteCardProps {
    note: NoteSummary;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const navigation = useNavigation<NavigationProps>();

    const handlePress = () => {
        if(note.type === 'document') {
            navigation.navigate('DocumentNotePage', { noteId: note.id, workspaceId: note.workspace.id});
        }else {
            navigation.navigate('BoardNotePage', { noteId: note.id, workspaceId: note.workspace.id});
        }
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
                        {note.type === 'document' ? (
                            <Icon
                                source="text"
                                color="#000"
                                size={26}
                            />
                            ) : (
                            <Icon
                                source="fountain-pen"
                                color="#000"
                                size={26}
                            />
                        )}
                    </View>
                </Card.Content>
            </Card>
        </TouchableRipple>
    );
};

export default NoteCard;
