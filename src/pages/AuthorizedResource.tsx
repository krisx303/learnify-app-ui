import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {View, Text, ActivityIndicator, Button, StyleSheet} from 'react-native';
import {ResourceType, UserPermissionLevel} from "./main/Types";
import {useHttpClient} from "../transport/HttpClient";
import {useAuth} from "./auth/AuthProvider";
import {useNavigation} from "@react-navigation/native";

interface PermissionContextType {
    userAccess: UserPermissionLevel;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const useUserAccessToResource = () => {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error('useUserAccessToResource must be used within a PermissionProvider');
    }
    return context;
};

type AuthorizedResourceProps = {
    children: ReactNode;
    resourceId: string;
    resourceType: ResourceType;
}

const AuthorizedResource: React.FC<AuthorizedResourceProps> = ({children, resourceId, resourceType}) => {
    const [loading, setLoading] = useState(true);
    const httpClient = useHttpClient();
    const {user} = useAuth();
    const [access, setAccess] = useState<UserPermissionLevel>("DENIED");
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            httpClient.getUserPermission(resourceType, resourceId, user.uid)
                .then((response) => {
                    setAccess(response.accessLevel);
                })
                .catch((error) => {
                    console.error('Failed to fetch permissions:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [httpClient, resourceId, resourceType, user]);

    if (loading) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff"/>
        </View>
    }

    if (access === "DENIED" || access == null) {
        return (
            <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                <View style={styles.accessDeniedContainer}>
                    <Text style={styles.accessDeniedText}>You do not have permission to view this resource.</Text>
                    <Button
                        title="Go to Main Page"
                        onPress={() => navigation.navigate('Main')}
                        color="#590d82"
                    />
                </View>
            </View>
        );
    }

    return <PermissionContext.Provider value={{userAccess: access}}>
        {children}
    </PermissionContext.Provider>;
};

const styles = StyleSheet.create({
    accessDeniedContainer: {
        width: "fit-content",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    accessDeniedText: {
        color: '#000000',  // Purple color for the text
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default AuthorizedResource;
