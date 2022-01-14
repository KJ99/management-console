import RetroDesign from "../../../extension/RetroDesign";
import RetroQuestionKey from "../../../extension/RetroQuestionKey";
import * as RetroQuestionUtil from "../../../utils/RetroQuestionUtil";


describe('finds questions properly', () => {
    
    const stringResolver = (x: string) => 'foo';

    it('getQuestions', () => {
        const questions = RetroQuestionUtil.getQuestions(RetroDesign[RetroDesign.GML]);

        expect(questions.findIndex((item) => item.key == RetroQuestionKey.GLAD)).toBe(0);
        expect(questions.findIndex((item) => item.key == RetroQuestionKey.MAD)).toBe(1);
        expect(questions.findIndex((item) => item.key == RetroQuestionKey.LONGED)).toBe(2);
    });

    it('getQuestionsLabels', () => {
        const labels = RetroQuestionUtil.getQuestionsLabels(RetroDesign[RetroDesign.GML]);

        expect(labels.findIndex((item) => item == '/retro/questions/glad')).toBe(0);
        expect(labels.findIndex((item) => item == '/retro/questions/mad')).toBe(1);
        expect(labels.findIndex((item) => item == '/retro/questions/longed')).toBe(2);
    });

    it('getQuestionsResolvedLabels', () => {
        const labels = RetroQuestionUtil.getQuestionsResolvedLabels(
            RetroDesign[RetroDesign.GML], 
            stringResolver
        );

        expect(labels[0]).toBe('foo');
        expect(labels[1]).toBe('foo');
        expect(labels[2]).toBe('foo');
    });

    it('getQuestionsResolvedLabelsList', () => {
        const label = RetroQuestionUtil.getQuestionsResolvedLabelsList(
            RetroDesign[RetroDesign.GML], 
            stringResolver
        );
        expect(label).toBe('foo, foo, foo');
    });

})