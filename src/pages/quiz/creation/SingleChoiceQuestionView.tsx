import React from "react";
import {StyleSheet, Text, View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {SingleChoiceQuestion} from "./Question";

interface SingleChoiceQuestionViewProps {
    question: SingleChoiceQuestion;
    userAnswer: number;
    setUserAnswer: (userAnswer: number) => void;
    isEditable: boolean;
}

const SingleChoiceQuestionView: React.FC<SingleChoiceQuestionViewProps> = ({
                                                                               question,
                                                                               userAnswer,
                                                                               setUserAnswer,
                                                                               isEditable,
                                                                           }) => {
    const handleOptionToggle = (index: number) => {
        setUserAnswer(index);
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
                    <View
                        style={[
                            styles.checkBoxContainer
                        ]}
                        key={index}
                    >
                        <img
                            style={{
                                marginRight: !isEditable && userAnswer === index && question.answer === userAnswer ? 20 : 0,
                                marginLeft: !isEditable && userAnswer === index && question.answer === userAnswer ? 20 : 0,
                                width: !isEditable && userAnswer === index && question.answer === userAnswer ? 20 : 0,
                                height: !isEditable && userAnswer === index && question.answer === userAnswer ? 20 : 0,
                                visibility: !isEditable && userAnswer === index && question.answer === userAnswer ? 'visible' : 'hidden'
                            }}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADWElEQVR4nO2Y/0sTYRzHH7M0zbQsrRQyzUmZq9a088tk8/J0s+f8Pqc5N81bhCD0HyREf0C/RF/ot6CQKMXSLHRmpanZdC7drs2bQYkFitEPGekT07KS1MfN8oR7weu3u/fn/dw93B0HgICAgICAgIDAHzAj9CGDk37IcPQlPSffDNYTjJOOZDj43uCk0Zyw88w7uBOsBypYZYjBCa2/ys/JcPD1GQfcC/hMNasMZDi6d2H53+7EW9fWAnykmlX6GjjYsnj5H3JwGCDgBfjEeXR+A8PB2mXLu7aSkx7l3QIYJ7yMU97ghFOGkex0wCcMHF2DdeU5OF05DDWATzAcPMtwEOF58pzbg6os8gDtKLVlVcs7lIWVDtW3yuEstKwO1QW3B5XbKbLCnvm5wp4xqX+Tkbsa5V2Z5faMLxX2TIThNbcHaa1UpJ6lPupZCs1qo2b0NqrGk/I6K3lYZ6Mm5jPZJbRR9XKjfKNbg04PJW/V2cgBnY1ECy2zklfdCdaxafvLbOTo3zJ1C7WSbW5/A7mey9pBeb12SIEWs3RQ0eRaJG6m1k6FaocU7FKZ2p8OKsynzLLtwF2KB1LOlVhkCMPuYjOxa7k89cv0oBKLrA8ns9gic5QOpu4BnqDpJ25ozIkIxyJzIqcZIA4uluXaBpp+og0vixhTWxKjPSo/uwATsa/AlGAv7EtAOBaY4scLTFLFwhx1rdq7sC/+HlaOKf5TXr/0mMfl54dbYoPzXh19kv9KgnDM65VM5fdKyuYDEPDK75Vcxz23wHQkA6w2SjbaN6dHfDOnR4yw7BbP5PSIa1zls3viLuKck90tns7tiisC/wwEvGBX7EW6KxZh+yK2A/dY2H2gCvwPsjpF5aoO0VRWZwxaLVWdIo9eiitG9TyKzHwWNaF8FoU8N/IKWAvS28JFVHsES7VHIPfdW6euBd5grTjxOGxHWmv4U9IYjlZqWmuYUW6MWPvfJMrGaF9FS+gtRcsutALNcmPQNsAbEPBKbd5ek/ooGC1rc7BDbgzZDfhISmNAZXJj4NfkpkD0N5OaAj/IHmyNAXwmocE/k2jwmyTu+6PfPX7fbzyp0V8C1gPSu777pfU+t+PrN41J63wmpXWb7hANPqK17iUgICAgIAD4zHd5fAGgfbEhmQAAAABJRU5ErkJggg=="/>
                        <img
                            style={
                                {
                                    marginRight: !isEditable && question.answer != index ? 20 : 0,
                                    marginLeft: !isEditable && question.answer != index ? 20 : 0,
                                    width: !isEditable && question.answer != index ? 20 : 0,
                                    height: !isEditable && question.answer != index ? 20 : 0,
                                    visibility: !isEditable && userAnswer === index ? 'visible' : 'hidden'
                                }
                            }
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAECElEQVR4nO2Y21IaWRiFeYB4B2JLBLRBGwwedqONCgooB+UghxiNOjd5APVu5jmnOCggSIhBoHezUXByYdWe6gsMM1H7QKMzVayq727/618L7YbaKtVQQw011P9G7aM4gb9ERwblj79ER/gdAzH/cZw8uf8t+fDX8Ue2c5xklPbvHCcZ3pvf8eNo71RZ86P42f1hAnfpfI63Okdxh2L+hzH6/jDB9e64/5z4Qxnzg92zzkEM/8J+rNX51H+JzmGM7uzHuKd2tPdj/ZW424uetj9F8fNEUOcgKvvfqXMQZXiPl3bc7UVPZJm34wHiNhl6uPsYxi+SDKNWckdyCX7mLhlGQv58hvbezpjkAo1odOQ2sc3eJnawIPEdSSX4s/zMrRjvxDZb29t4p5KjZjwAWrtB2IoFsSC7QdSKBwWfCRTz061YgFPS80U1wwHQjPggivixIGE/akW2nl2IQn4aRXycEl6SS3ChLdgM+bAIEBv8dTEfngttcf149KVmwAvgthdy25tYGO8/AqCQh4bBTU7OrKKqB7yADbghDHiwEGzAjdjghqPh99Cs38NJmVENUqzPzTR864j1bWAh+HNSzrI+t+I/UZ5U3esCda8LNjZdWAnqXidi3c7XCd9bouZeg3XPGu6HmnsNVV87/GMJlwPU1ldgbX0Fy+HGtYKqTuZtwnd17XKAG+cyvHEyWArVNebtw3d17aBBddUOq6tLWAzfV5dQ1Un/N8Lz+s4A+pqxc9cOOxYJqiyDwb4upYT/tgS4b8sAS2Px7UuUAaAr9gWuYl/A8phHFfBGJcrARn9dnOO+Ls7hvliwoQqwvW6Jss1Gl+dnufL8B6wIc7OoZHulEsU5C3P1wYqubFYsCH9OwtninGWwb6ayjaKL1hmuNEthQawUKloszBVFgeLsDBQ7U6KowfwlChRFX1JmrmiZxiJARYv58dO8okhwSZmh2NkSZVK2RIEi6cK0ibucMWERoKL5Z/iu8hQJCtMkFOtRUqpEgSTpvJnkCmYSC5E3k+jiifCPJUgS5E0kFOuVM/VZgg+fm5rk8lOTWIjclBFdGI2CD2Ge1IP81CQU65kzGOSVyM7MjOSMBjZnNGAhLgx6UeG74s/yMzkR3jmDoZGyaqRfq2T0euJcP/FwoZ/AL3E+8R5d6HSSX3/8zDk/K+Svn3hIGQzSL7Z4ZXW6k/P3OvwcWd24rPC9JbK6cfTyDl1/N9UZgjjLjhP432QIAqV12r6/eDIEAbLEGHxmhzI31Bli9CwzpsVd0mNalNb2H763REY7Cnt3ZLTa31VKKq1Wn6Y0moeUWt1QMnxXvGdKrWb5HWm1Wt6NtJD+HB3VpjQy3ggildJo3qU0GnkP7FBDDTWU6i30N4TdCC3jWDERAAAAAElFTkSuQmCC"/>
                        <img
                            style={
                                {
                                    marginRight: !isEditable && userAnswer != index && question.answer === index ? 20 : 0,
                                    marginLeft: !isEditable && userAnswer != index && question.answer === index ? 20 : 0,
                                    width: !isEditable && userAnswer != index && question.answer === index ? 20 : 0,
                                    height: !isEditable && userAnswer != index && question.answer === index ? 20 : 0,
                                    visibility: !isEditable && question.answer != userAnswer ? 'visible' : 'hidden'
                                }}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsElEQVR4nO2WTWsTQRjHpyq04Pu7XsRSK4gg6CeQInr1IHoSBC/iqR8hIH4AL+IL3gQlCNrLrmw2TLfzPDOpuyFLXenM1hjwYKlCS8WDFduRhRZi6MtkE+0W9ge/W+b//B8YJktITk5OTk5OTs5fTE1NnVVKvZVSPmg0Gn1kKyGl7FdKfVFK6UQppZBSHiJbgTiODyul5Er5piU+1Ov1EyTLxHG8R0pZbS3ftMTn5GqRLBLHca9SqrxW+SY/aa17SJbQWm9TShUNyidOZ24BpdRDw/ILSqlLJEsopQom5aWUi1LKGyRLTE5O3pFSakOHUw+KomhXGIY7u1k+iqJrURT9jqJIG3gv9aAwDIdqtdqPMAzna7Xa1W6UX878GYahNvBJ6kGVSqU/CIJvQRDoRN/3l3zfL3RSvlqtnvN9f24lM1jfEUrpjlSDAGC3EOJ9pVLRq/g4TTAADAghptfI1C2OUkr7Ur/LjLERANDraCdLmmYi4hEAiDfI1ImMsQnG2H6SFsbYsOGgd0KIoxvlBUGwFwBCk0wAqHued5x0AgA8MxyWLNEQQpxZKyu5BgAwapg1wzk/RTpFCHESET8iojZ0ljF2sTWnWCxuB4DXhhnfOecXSLfgnB8AAM90CQBYQMSbK+eT7xVEfGp6FgAuk25jWVYvIj5vY4klRCwsl79veGaRMXad/CvaKdMkb+O3d8n/AABuLV8T3UU7+lNsG0Qc4pzPcc51pyLiI7IZCCEGETHucIE3yQtFNovx8fGDiMhSXhua+hOh2y+U53kvxsbGdBtOUEr3kaygte6hlBYopdrAOqX0GMkiruvedl33V7lc1qvpuu7XUql0mmQZx3GuOI4z7ziObnG2VCqdJ1sBy7IGbNt+aVnWjG3b85ZlvXIcZ3Cze+Xk5OTk5JAs8wf/FuPKsGsScwAAAABJRU5ErkJggg=="/>
                        <BouncyCheckbox
                            fillColor="#e6e6e6"
                            isChecked={userAnswer === index}
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
                    </View>
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
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "flex-start",
        marginVertical: 10,
        borderStyle: "solid",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    checkBoxContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "flex-start",
    },
    feedbackText: {
        marginTop: 5,
        marginBottom: 20,
        marginLeft: 60,
        color: "gray",
    }
});

export default SingleChoiceQuestionView;
