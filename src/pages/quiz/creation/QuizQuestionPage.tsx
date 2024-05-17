import {RouteProp} from "@react-navigation/native";


type RootStackParamList = {
    QuizQuestionPage: { workspaceId: string; quizId: string };
};


type QuizQuestionPageRouteProp = RouteProp<RootStackParamList, 'QuizQuestionPage'>;