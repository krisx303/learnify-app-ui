import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';


export const DrawerContext = React.createContext({
    toggleDrawer: () => {},
    setDrawerContent: (content: React.ReactNode) => {},
    drawerVisible: false,
});

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

    const toggleDrawer = () => setDrawerVisible(!drawerVisible);

    return (
        <DrawerContext.Provider value={{ toggleDrawer, setDrawerContent, drawerVisible }}>
            <View style={styles.container}>
                {children}
                {drawerVisible && (
                    <>
                        <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
                        <View style={[styles.drawer, { width: 'max(25%, 400px)' }]}>
                            {drawerContent}
                        </View>
                    </>
                )}
            </View>
        </DrawerContext.Provider>
    );
};


export default DrawerProvider;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 2,
    },
});
