import { SurveyComponentRef } from "./types";

const goToQuestion = ( 
    question_index: number,
    questionIDs: Array<string>,
    setCurrentQuestion: React.Dispatch<any>, 
    question_index_predicate: ( value: number ) => boolean,
    incrementor: ( value: number ) => number
): ( e: HTMLButtonElement ) => void => ( event: HTMLButtonElement ) => {
    if ( question_index_predicate( question_index ) )
    {
        return;
    }

    let newQuestionIndex = incrementor(question_index),
        newQuestionId = questionIDs[newQuestionIndex];

    setCurrentQuestion(newQuestionId);
}

export const gotoPreviousQuestion = ( question_index: number, questionIDs, setCurrentQuestion ) =>
    goToQuestion(
        question_index,
        questionIDs,
        setCurrentQuestion,
        ( value ) => value === 0,
        ( value ) => value - 1
    )

export const gotoNextQuestion = ( question_index: number, questionIDs, setCurrentQuestion ) =>
    goToQuestion(
        question_index,
        questionIDs,
        setCurrentQuestion,
        ( value ) => value >= questionIDs.length,
        ( value ) => value + 1
    )