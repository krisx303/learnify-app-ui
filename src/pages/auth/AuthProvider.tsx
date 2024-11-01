import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {auth} from "../../../firebase";
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

    useEffect(() => {
        // Firebase will detect the current user on page load if they’re signed in
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const token = await user.getIdToken();
                localStorage.setItem("jwtToken", token); // Optional: Store the token for backend use
            } else {
                setUser(null);
                localStorage.removeItem("jwtToken");
            }
        });

        return () => unsubscribe();
    }, []);

    const removeUser = () => {
        auth.signOut();
        setUser(null);
        localStorage.removeItem("jwtToken");
    };

    const getToken = async () => {
        if (!user) {
            const token = localStorage.getItem("jwtToken");
            if (token) {
                return token;
            }
            throw new Error("User is not logged in");
        }
        const token = await user.getIdToken();
        localStorage.setItem("jwtToken", token); // Update the token in localStorage if refreshed
        return token;
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
