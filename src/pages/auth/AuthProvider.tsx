import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';

type AuthContextType = {
    user: User | null;
    removeUser: () => void;
    setUser: (credentials: User) => void;
    getToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const removeUser = () => {
        setUser(null);
    };

    const getToken = async () => {
        if (!user) {
            throw new Error('User is not logged in');
        }
        return user.getIdToken();
    };

    return (
        <AuthContext.Provider value={{ user, setUser, removeUser, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
