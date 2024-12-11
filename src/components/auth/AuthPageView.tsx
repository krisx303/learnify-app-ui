import React from 'react';
import {useWindowDimensions, View, StyleSheet, ImageBackground} from 'react-native';

interface AuthPageViewProps {
    leftContent: React.ReactElement;
    rightContent: React.ReactElement;
}

const AuthPageView = ({
    leftContent,
    rightContent
}: AuthPageViewProps) => {
    const {width: windowWidth} = useWindowDimensions();

    return (
        <ImageBackground style={styles.container} source={require("../../../assets/purple_background.png")}
                         imageStyle={{resizeMode: "cover"}}>
            <View style={windowWidth < 700 ? styles.contentVertical : styles.contentHorizontal}>
                <View style={styles.logoContainer}>
                    {leftContent}
                </View>
                <View style={styles.formContainer}>
                    {rightContent}
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderWidth: 0,
        margin: 0,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    contentVertical: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 20,
    },
    contentHorizontal: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    }
})

export default AuthPageView;
