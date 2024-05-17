import React from "react";
import {StyleSheet, Text, View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {MultipleChoiceQuestion} from "Question";

interface MultipleChoiceQuestionViewProps {
    question: MultipleChoiceQuestion;
    userAnswer: boolean[];
    setUserAnswer: (userAnswer: boolean[]) => void;
    isEditable: boolean;
}

const MultipleChoiceQuestionView: React.FC<MultipleChoiceQuestionViewProps> = ({
                                                                                   question,
                                                                                   userAnswer,
                                                                                   setUserAnswer,
                                                                                   isEditable,
                                                                               }) => {
    const handleOptionToggle = (index: number) => {
        const copy = [...userAnswer];
        copy[index] = !userAnswer[index];
        setUserAnswer(copy);
    };

    return (
        <View style={styles.container}>
            {question.choices.map((choice, index) => (
                <View
                    style={[
                        styles.choiceContainer
                    ]}
                    key={index}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48"
                         style={{
                             marginRight: !isEditable && question.answer[index] === userAnswer[index] ? 20 : 0,
                             marginLeft: !isEditable && question.answer[index] === userAnswer[index] ? 20 : 0,
                             width: !isEditable && question.answer[index] === userAnswer[index] ? 20 : 0,
                             height: !isEditable && question.answer[index] === userAnswer[index] ? 20 : 0
                         }}
                         visibility={!isEditable && question.answer[index] && question.answer[index] === userAnswer[index] ? 'visible' : 'hidden'}>
                        <linearGradient id="HoiJCu43QtshzIrYCxOfCa_VFaz7MkjAiu0_gr1" x1="21.241" x2="3.541" y1="39.241"
                                        y2="21.541" gradientUnits="userSpaceOnUse">
                            <stop offset=".108" stop-color="#0d7044"></stop>
                            <stop offset=".433" stop-color="#11945a"></stop>
                        </linearGradient>
                        <path fill="url(#HoiJCu43QtshzIrYCxOfCa_VFaz7MkjAiu0_gr1)"
                              d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019	c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019	C18.627,42.193,17.373,42.193,16.599,41.42z"></path>
                        <linearGradient id="HoiJCu43QtshzIrYCxOfCb_VFaz7MkjAiu0_gr2" x1="-15.77" x2="26.403" y1="43.228"
                                        y2="43.228" gradientTransform="rotate(134.999 21.287 38.873)"
                                        gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#2ac782"></stop>
                            <stop offset="1" stop-color="#21b876"></stop>
                        </linearGradient>
                        <path fill="url(#HoiJCu43QtshzIrYCxOfCb_VFaz7MkjAiu0_gr2)"
                              d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019	c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019	C11.807,36.627,11.807,35.373,12.58,34.599z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48"
                         style={
                             {
                                 marginRight: !isEditable && !question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0,
                                 marginLeft: !isEditable && !question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0,
                                 width: !isEditable && !question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0,
                                 height: !isEditable && !question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0
                             }
                         }
                         visibility={!isEditable && question.answer[index] != userAnswer[index] ? 'visible' : 'hidden'}>
                        <linearGradient id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1" x1="7.534" x2="27.557" y1="7.534"
                                        y2="27.557" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#f44f5a"></stop>
                            <stop offset=".443" stop-color="#ee3d4a"></stop>
                            <stop offset="1" stop-color="#e52030"></stop>
                        </linearGradient>
                        <path fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)"
                              d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"></path>
                        <linearGradient id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2" x1="27.373" x2="40.507" y1="27.373"
                                        y2="40.507" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#a8142e"></stop>
                            <stop offset=".179" stop-color="#ba1632"></stop>
                            <stop offset=".243" stop-color="#c21734"></stop>
                        </linearGradient>
                        <path fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)"
                              d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48"
                         style={
                             {
                                 marginRight: !isEditable && question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0,
                                 marginLeft: !isEditable && question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0,
                                 width: !isEditable && question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0,
                                 height: !isEditable && question.answer[index] && question.answer[index] != userAnswer[index] ? 20 : 0
                             }
                         }
                         visibility={!isEditable && question.answer[index] != userAnswer[index] ? 'visible' : 'hidden'}>
                        <path
                            d="M18,43c-0.256,0-0.512-0.098-0.707-0.293l-16-16C1.105,26.52,1,26.265,1,26v-2c0-0.347,0.18-0.668,0.474-0.851	c0.295-0.182,0.663-0.198,0.973-0.044l15.466,7.733l26.511-18.656c0.307-0.215,0.707-0.241,1.037-0.07	C45.792,12.285,46,12.626,46,13v2c0,0.265-0.105,0.52-0.293,0.707l-27,27C18.512,42.902,18.256,43,18,43z"></path>
                        <polygon fill="#fff" points="45,13 40,8 18,30 7,19 2,24 18,40"></polygon>
                        <path
                            d="M18,41c-0.256,0-0.512-0.098-0.707-0.293l-16-16c-0.391-0.391-0.391-1.023,0-1.414l5-5c0.391-0.391,1.023-0.391,1.414,0	L18,28.586L39.293,7.293c0.391-0.391,1.023-0.391,1.414,0l5,5c0.391,0.391,0.391,1.023,0,1.414l-27,27	C18.512,40.902,18.256,41,18,41z M3.414,24L18,38.586L43.586,13L40,9.414L18.707,30.707c-0.391,0.391-1.023,0.391-1.414,0L7,20.414	L3.414,24z"></path>
                    </svg>
                    <BouncyCheckbox
                        fillColor="#e6e6e6"
                        isChecked={userAnswer[index]}
                        onPress={() => handleOptionToggle(index)}
                        disabled={!isEditable}
                        text={choice}
                        textStyle={{
                            textDecorationLine: "none",
                            color: "white",
                        }}
                        iconImageStyle={
                            {
                                width: 0,
                                height: 0
                            }
                        }

                    />
                    {!isEditable && (
                        <Text style={styles.feedbackText}>
                            {question.feedback[index]}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignContent: "flex-start",
        marginTop: 20,
        backgroundColor: '#390854'
    },
    choiceContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        marginVertical: 10,
        borderStyle: "solid",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    feedbackText: {
        marginLeft: 40,
        color: "gray",
    },
    correctImg: {
        marginRight: 20,
        marginLeft: 20
    }
});

export default MultipleChoiceQuestionView;
