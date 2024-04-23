import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
    CardPage: { workspaceId: string; noteId: string };
};

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage: React.FC = () => {
    // Access route params
    const route = useRoute<CardPageRouteProp>();
    const { workspaceId, noteId } = route.params;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Workspace ID: {workspaceId}</Text>
            <Text>Note ID: {noteId}</Text>
            <Text>This is the Card Page!</Text>
        </View>
    );
};

export default CardPage;
