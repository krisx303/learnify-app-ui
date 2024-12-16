import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';

interface UserScore {
    userName: string;
    percentage: number;
    date: string;
}

const LeaderboardTable = ({data}: {data: UserScore[]}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top 10 Users</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Rank</DataTable.Title>
                    <DataTable.Title>User</DataTable.Title>
                    <DataTable.Title>Score</DataTable.Title>
                    <DataTable.Title>Try Date</DataTable.Title>
                </DataTable.Header>

                {data.sort(u => -u.percentage).map((user, index) => (
                    <DataTable.Row key={index}>
                        <DataTable.Cell>{index + 1}</DataTable.Cell>
                        <DataTable.Cell>{user.userName}</DataTable.Cell>
                        <DataTable.Cell>{user.percentage}</DataTable.Cell>
                        <DataTable.Cell>{user.date.substring(0, 10)}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f7f7f7',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    table: {
        marginTop: 10,
    },
});

export default LeaderboardTable;
