import React from 'react';
import {View, StyleSheet, Modal} from 'react-native';

const GenericModal = ({visible, onClose, children}) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {children}
                </View>
            </View>
        </Modal>
    );
};

GenericModal.Header = ({ children }) => {
    return <View style={styles.header}>{children}</View>;
};

GenericModal.Body = ({ children }) => {
    return <View style={styles.body}>{children}</View>;
};

GenericModal.Footer = ({ children }) => {
    return <View style={styles.footer}>{children}</View>;
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        maxWidth: 500,
        minWidth: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        alignItems: 'center',
    },
    body: {
        padding: 20,
        marginBottom: 20,
    },
    footer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default GenericModal;