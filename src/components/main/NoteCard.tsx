import React from 'react';
import {Card, Title, Paragraph, TouchableRipple, Text, Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {NoteSummary} from '../../pages/main/Types';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";

interface NoteCardProps {
    note: NoteSummary;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const NoteCard: React.FC<NoteCardProps> = ({note}) => {
    const navigation = useNavigation<NavigationProps>();

    const handlePress = () => {
        if (note.type === 'DOCUMENT') {
            navigation.navigate('DocumentNotePage', {noteId: note.id, workspaceId: note.workspace.id});
        } else {
            navigation.navigate('BoardNotePage', {noteId: note.id, workspaceId: note.workspace.id});
        }
    };
    const lastViewDate = note.viewedAt !== null ? new Date(note.viewedAt) : new Date(note.updatedAt);

    return (
        <TouchableRipple onPress={handlePress} style={styles.cardContainer}>
            <Card key={note.id} style={styles.card}>
                <Card.Content style={{height: 280}}>
                    <Title style={styles.cardHeader}>{note.title}</Title>
                    <View style={styles.line}/>
                    <Paragraph style={styles.details}>{note.description}</Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Przeglądano: {lastViewDate.toLocaleDateString() + ", " + lastViewDate.toLocaleTimeString()}</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Autor: {note.author?.displayName}</Text>
                    </Paragraph>
                    <Paragraph style={styles.details}>
                        <Text>Z przestrzeni: {note.workspace.displayName}</Text>
                    </Paragraph>
                    <View style={styles.iconContainer}>
                        {note.type === 'DOCUMENT' ? (
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

export default NoteCard;
