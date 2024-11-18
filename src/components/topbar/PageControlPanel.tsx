import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import React from "react";

type PageControlPanelProps = {
    pageNumber: number;
    totalPages: number;
    previousPage: () => void;
    nextPage: () => void;
    canCreateNewPage: boolean;
    createNewPage: () => void;
};

const PageControlPanel: React.FC<PageControlPanelProps> = ({
                                                               pageNumber,
                                                               previousPage,
                                                               totalPages,
                                                               nextPage,
                                                               canCreateNewPage,
                                                               createNewPage,
                                                           }) => {
    const handleNextPage = () => {
        if (pageNumber < totalPages) {
            nextPage();
        } else if (canCreateNewPage) {
            createNewPage();
        }
    };

    return (
        <View style={styles.content}>
            {/* Previous Page Button */}
            <TouchableOpacity
                onPress={previousPage}
                disabled={pageNumber === 1}
                style={styles.button}
            >
                <Icon size={25} source="arrow-left" color={pageNumber === 1 ? "gray" : "white"} />
            </TouchableOpacity>

            {/* Page Number Display */}
            <Text style={styles.pageText}>
                {pageNumber} / {totalPages}
            </Text>

            {/* Next Page Button */}
            <TouchableOpacity
                onPress={handleNextPage}
                disabled={!canCreateNewPage && pageNumber === totalPages}
                style={styles.button}
            >
                <Icon
                    size={25}
                    source="arrow-right"
                    color={(!canCreateNewPage && pageNumber === totalPages) ? "gray" : "white"}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        padding: 10,
    },
    pageText: {
        color: "white",
        fontSize: 18,
        marginHorizontal: 10,
        fontWeight: "bold",
    },
});

export default PageControlPanel;
