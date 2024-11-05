import React, {useEffect, useState} from 'react';
// @ts-ignore
import {View, Text, TextInput, FlatList, StyleSheet, Picker} from 'react-native';
import {Button, IconButton, Menu, PaperProvider} from "react-native-paper";
import {useHttpClient} from "../../transport/HttpClient";
import {AccessType, FullPermissionModel, ResourceType, User, UserPermission, UserPermissionLevel} from "../main/Types";

type PermissionTabContentProps = {
    resourceType: ResourceType;
    resourceId: string;
    ownerId: string;
};

type UserItemProps = {
    user: User;
    onAdd: (user: User, type: UserPermissionLevel) => void;
};

const UserItem = ({user, onAdd}: UserItemProps) => {
    const [visible, setVisible] = useState(false);

    const onAddInternal = (user: User, level: UserPermissionLevel) => {
        onAdd(user, level);
        setVisible(false);
    }

    return (
        <View style={styles.userPermission}>
            <Text style={styles.username}>{user.displayName}</Text>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={<IconButton icon="plus" onPress={() => setVisible(true)}/>}
            >
                <Menu.Item onPress={() => onAddInternal(user, 'RO')} title="READ_ONLY"/>
                <Menu.Item onPress={() => onAddInternal(user, 'RW')} title="READ_WRITE"/>
            </Menu>
        </View>
    );
};

type UserListProps = {
    availableUsers: User[];
    onAdd: (user: User, level: UserPermissionLevel) => void;
};

const UserList = ({
                      availableUsers,
                      onAdd,
                  }: UserListProps) => {
    return (
        <>
            {availableUsers.length === 0 ? (
                <View style={{}}>
                    <Text style={{textAlign: 'center', marginVertical: 20}}>No users found</Text>
                </View>
            ) : (
                <FlatList
                    data={availableUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <UserItem user={item} onAdd={onAdd}/>}
                />
            )}
        </>
    );
};

type PermissionItemProps = {
    item: UserPermission;
    handlePermissionChange: (user: User, level: UserPermissionLevel) => void;
    handleDeletePermission: (user: User) => void;
};

const PermissionItem = ({item, handlePermissionChange, handleDeletePermission}: PermissionItemProps) => {
    return (
        <View style={styles.userPermission}>
            <Text style={styles.username}>{item.user.displayName}</Text>
            <Picker
                selectedValue={item.accessLevel}
                style={styles.permissionPicker}
                onValueChange={(level: UserPermissionLevel) => handlePermissionChange(item.user, level)}
            >
                <Picker.Item label="READ_ONLY" value="RO"/>
                <Picker.Item label="READ_WRITE" value="RW"/>
            </Picker>
            <IconButton icon="delete" onPress={() => handleDeletePermission(item.user)}
                        iconColor="#f2c80c"/>
        </View>
    );
}

type PermissionListProps = {
    permissions: UserPermission[];
    handleDeletePermission: (user: User) => void;
    handlePermissionChange: (user: User, level: UserPermissionLevel) => void;
};

const PermissionList = ({
                            permissions,
                            handleDeletePermission,
                            handlePermissionChange
                        }: PermissionListProps) => {
    return (
        <>
            {permissions.length === 0 ? (
                <View style={{}}>
                    <Text style={{textAlign: 'center', marginVertical: 20}}>No other users have granted
                        permission</Text>
                </View>
            ) : (
                <FlatList
                    data={permissions}
                    keyExtractor={(item) => item.user.id}
                    renderItem={({item}) => (
                        <PermissionItem
                            item={item}
                            handlePermissionChange={handlePermissionChange}
                            handleDeletePermission={handleDeletePermission}
                        />
                    )}
                />
            )}
        </>
    );
}


const PermissionTabContent = ({resourceType, resourceId, ownerId}: PermissionTabContentProps) => {
    const httpClient = useHttpClient();
    const [loading, setLoading] = useState(true);
    const [accessLevel, setAccessLevel] = useState<AccessType | null>(null);
    const [permissions, setPermissions] = useState<UserPermission[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [userNameQuery, setUserNameQuery] = useState('');

    useEffect(() => {
        httpClient.getFullPermissionModel(resourceType, resourceId)
            .then((model: FullPermissionModel) => {
                setAccessLevel(model.accessType);
                setPermissions(model.permissions);
                setLoading(false);
            })
            .catch(console.error);
    }, [resourceType, resourceId]);

    useEffect(() => {
        if (userNameQuery) {
            httpClient.searchUsers("", userNameQuery)
                .then((users: User[]) => setAvailableUsers(users.filter(user => !permissions.some(permission => permission.user.id === user.id) && user.id !== ownerId)))
                .catch(console.error);
        } else {
            setAvailableUsers([]);
        }
    }, [userNameQuery]);

    const handleAccessLevelChange = (value: AccessType) => {
        setAccessLevel(value);
        // TODO - update access level when new endpoint will be available
    };

    const handlePermissionChange = (user: User, level: UserPermissionLevel) => {
        const updatedPermissions = permissions.map(permission =>
            permission.user.id === user.id ? {...permission, accessLevel: level} : permission
        );
        setPermissions(updatedPermissions);
        httpClient.editUserPermission(resourceType, resourceId, user.id, level).catch(console.error);
    };

    const handleAddPermission = (user: User, level: UserPermissionLevel) => {
        setUserNameQuery('');
        setPermissions([...permissions, {user, accessLevel: level}]);
        httpClient.addUserPermission(resourceType, resourceId, user.id, level).catch(console.error);
    };

    const handleDeletePermission = (user: User) => {
        const updatedPermissions = permissions.filter(permission => permission.user.id !== user.id);
        setPermissions(updatedPermissions);
        httpClient.removeUserPermission(resourceType, resourceId, user.id).catch(console.error);
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                {/* Access Level Selector */}
                <Text style={styles.sectionTitle}>Access Level</Text>
                <Picker
                    selectedValue={accessLevel}
                    onValueChange={handleAccessLevelChange}
                    style={styles.picker}
                >
                    <Picker.Item label="PUBLIC" value="PUBLIC"/>
                    <Picker.Item label="PRIVATE" value="PRIVATE"/>
                </Picker>

                {/* User Permissions List */}
                <Text style={styles.sectionTitle}>User Permissions</Text>
                <PermissionList
                    permissions={permissions}
                    handleDeletePermission={handleDeletePermission}
                    handlePermissionChange={handlePermissionChange}
                />
                {/* User Search and Add */}
                <Text style={styles.sectionTitle}>Add User</Text>
                <TextInput
                    placeholder="Enter user display name"
                    style={styles.input}
                    value={userNameQuery}
                    onChangeText={setUserNameQuery}
                    placeholderTextColor="#888"
                />
                <UserList availableUsers={availableUsers} onAdd={handleAddPermission}/>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    picker: {
        height: 45,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginVertical: 10,
    },
    userPermission: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    username: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    permissionPicker: {
        width: 120,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    input: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 10,
    },
});

export default PermissionTabContent;
