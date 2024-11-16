import {useNavigation} from "@react-navigation/native";
import {StyleSheet, TouchableHighlight, View} from "react-native";
import LearnifyAppIconInner from "../../icons/learnify-app-icon-inner";
import React from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {BreadCrumbProps} from "./BreadCrumb";
import BreadCrumbList from "./BreadCrumbList";

interface ModularTopBarProps {
    breadcrumbs?: BreadCrumbProps[];
    centerContent?: React.ReactElement;
    rightContent?: React.ReactElement;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const ModularTopBar = (
    {
        breadcrumbs,
        centerContent,
        rightContent
    }: ModularTopBarProps
) => {
    const navigation = useNavigation<NavigationProps>();

    const defaultBreadcrumbs = [
        {
            text: "Learnify",
            onPress: () => navigation.navigate('Main')
        }
    ];

    return (
        <View style={styles.topBar}>
            <View style={styles.content}>
                <TouchableHighlight onPress={() => navigation.navigate('Main')} underlayColor="transparent">
                    <LearnifyAppIconInner/>
                </TouchableHighlight>
                <BreadCrumbList items={breadcrumbs ? breadcrumbs : defaultBreadcrumbs}/>
            </View>
            {centerContent ? centerContent : <View style={styles.content}/>}
            {rightContent ? rightContent : <View style={styles.content}/>}
        </View>
    );
};

export default ModularTopBar;

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: '#590d82',
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
});