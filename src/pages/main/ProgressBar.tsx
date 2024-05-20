import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
    const renderScoreText = () => {
        const scoreTextColor = progress > 30 ? '#ffffff' : '#590d82';
        if (progress > 30) {
            return (
                <Text style={[styles.scoreText, {color: scoreTextColor}]}>
                    {progress}%
                </Text>
            );
        } else {
            return (
                <Text style={[styles.scoreText, {color: scoreTextColor}]}>
                    {progress}%
                </Text>
            )
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.progressBar, {width: `${progress}%`}]}>
                {progress > 30 && renderScoreText()}
            </View>
            {progress <= 30 && renderScoreText()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 15,
        width: '100%',
        backgroundColor: '#fff', // White part of the progress bar
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#590d82', // Purple part of the progress bar
        borderRadius: 5,
        position: 'relative', // Position relative to allow absolute positioning of text
    },
    scoreText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: '-50%'}, {translateY: '-50%'}], // Center text horizontally and vertically
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default ProgressBar;
