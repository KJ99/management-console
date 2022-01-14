import IRetroQuestion from "../extension/IRetroQuestion";
import RetroDesign from "../extension/RetroDesign";
import RetroQuestionKey from "../extension/RetroQuestionKey";

export const getQuestions = (design: string): IRetroQuestion[] => {
    let questions: IRetroQuestion[];
    switch(design) {
        case RetroDesign[RetroDesign.MLSS]:
            questions = [
                { key: RetroQuestionKey.MORE, label: '/retro/questions/more' },
                { key: RetroQuestionKey.LESS, label: '/retro/questions/less' },
                { key: RetroQuestionKey.START, label: '/retro/questions/start' },
                { key: RetroQuestionKey.STOP, label: '/retro/questions/stop' },
            ];
            break;
        case RetroDesign[RetroDesign.KSS]:
            questions = [
                { key: RetroQuestionKey.KEEP, label: '/retro/questions/keep-doing' },
                { key: RetroQuestionKey.START, label: '/retro/questions/start-doing' },
                { key: RetroQuestionKey.STOP, label: '/retro/questions/stop-doing' },
            ];
            break;
        case RetroDesign[RetroDesign.GML]:
            questions = [
                { key: RetroQuestionKey.GLAD, label: '/retro/questions/glad' },
                { key: RetroQuestionKey.MAD, label: '/retro/questions/mad' },
                { key: RetroQuestionKey.LONGED, label: '/retro/questions/longed' },
            ];
            break;
        default:
            questions = [
                { key: RetroQuestionKey.WELL, label: '/retro/questions/well' },
                { key: RetroQuestionKey.NOT_WELL, label: '/retro/questions/not-well' },
                { key: RetroQuestionKey.IMPROVE, label: '/retro/questions/improve' },
            ];
            break;
    };

    return questions;
}

export const getQuestionsLabels = (design: string): string[] =>
    getQuestions(design).map((question) => question.label);

export const getQuestionsResolvedLabels = (design: string, stringResolver: Function): string[] =>
    getQuestionsLabels(design).map((question) => stringResolver(question));

export const getQuestionsResolvedLabelsList = (design: string, stringResolver: Function): string =>
    getQuestionsResolvedLabels(design, stringResolver).join(', ');