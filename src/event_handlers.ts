export const gotoPreviousQuestion = ( question_index: number, questionIDs, setCurrentQuestion, inputElement ): (event : HTMLButtonElement) => void => 
( event ) => {
    if (question_index === 0)
    {
        return;
    }

    let newQuestionIndex = question_index - 1;

    setCurrentQuestion(questionIDs[newQuestionIndex]);
    inputElement.current.focus();
}

export const gotoNextQuestion = ( question_index: number, questionIDs, setCurrentQuestion, inputElement ): (event : HTMLButtonElement) => void => 
( event ) => {
    if (question_index >= questionIDs.length)
    {
        return;
    }

    let newQuestionIndex = question_index + 1;

    setCurrentQuestion(questionIDs[newQuestionIndex]);
    inputElement.current.focus();
}