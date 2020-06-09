import React, { useEffect, useRef } from 'react';

import { SurveyorGenerator } from "./SurveyorGenerator";
import { SurveyorSurvey, SurveyComponentState, SurveyComponentRef } from "./types";
import styled from "styled-components";
import { SurveyorNextButton, SurveyorPreviousButton, SurveyorSubmitButton } from './components/SurveyorButton';
import { first } from './functions';
import { LinearProgress } from '@material-ui/core';

type Props = {
    initial_state : SurveyComponentState
    initial_transformed_data: SurveyorSurvey;
    submit_handler: ( e ) => void;
}

const SurveyorUIForm = styled.form`
    overflow: hidden;
    padding: 15px;
    width: 100%;

    @media (min-width: 760px) {
        max-width: 400px;
    }
`;

const SurveyorButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 15px 0px 15px 0px;
`

const ProgressContainer = styled.div`
    margin-bottom: 3rem;
    padding: 1rem 2rem 1rem 2rem;
`;

const GeneratorContainer = styled.div`
    margin-bottom: 2rem;
`;

const SurveyorUI = ({ initial_state, initial_transformed_data, submit_handler } : Props) => {
    const [surveyState, setSurveyState] = React.useState( initial_state ),
        [transformedSurveyData, setTransformedSurveyData] = React.useState( initial_transformed_data ),
        [currentQuestion, setCurrentQuestion] = React.useState( null ),
        inputElement: SurveyComponentRef = React.createRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>();

    /**
     * This acts as a sort of "didComponentUpdate" hook
     * that makes sure there is data from our JSON in the overall surveyState and transformedSurveyData
     * 
     * This should really only do anything if we're initilizing the survey.
     */
    useEffect(() => {
        if ( Object.keys(surveyState).length === 0 )
        {
            setSurveyState(initial_state);
            setCurrentQuestion(Object.keys(initial_state)[0]);
        }

        if ( transformedSurveyData.length === 0 )
        {
            setTransformedSurveyData(initial_transformed_data)
        }
    });

    const questionIDs = Object.keys(surveyState),
        firstQuestionID = first(questionIDs),
        lastQuestionID = questionIDs[questionIDs.length - 1],
        isFirstQuestion = ( currentQuestion === firstQuestionID ), 
        showSubmitButton = ( currentQuestion === lastQuestionID ),
        currentQuestionIndex = questionIDs.indexOf(currentQuestion),
        currentQuestionProgress = ( questionIDs.indexOf(currentQuestion) / questionIDs.length ) * 100;
        console.log("Current Question Index: ", currentQuestionIndex)
        console.log("Current Question Progress: ", currentQuestionProgress);

    const gotoPreviousQuestion = ( question_index: number ) => 
        ( event ) => {
            if (question_index === 0)
            {
                return;
            }

            let newQuestionIndex = question_index - 1;

            setCurrentQuestion(questionIDs[newQuestionIndex]);
            inputElement.current.focus();
        }

    const gotoNextQuestion = ( question_index: number ) => 
        ( event ) => {
            if (question_index >= questionIDs.length)
            {
                return;
            }

            let newQuestionIndex = question_index + 1;

            setCurrentQuestion(questionIDs[newQuestionIndex]);
            inputElement.current.focus();
        }
    

    return (
        <SurveyorUIForm onSubmit={submit_handler}>
            <ProgressContainer>
                <LinearProgress variant="determinate" value={currentQuestionProgress}/>
            </ProgressContainer>
            <GeneratorContainer>
                <SurveyorGenerator 
                    current_question={currentQuestion}
                    ref={inputElement}
                    survey_data={transformedSurveyData} 
                    surveyState={surveyState} 
                    setSurveyState={setSurveyState}
                />
            </GeneratorContainer>
            <SurveyorButtonContainer>
                <SurveyorPreviousButton disabled={isFirstQuestion} onClick={gotoPreviousQuestion(currentQuestionIndex)}/>
                { showSubmitButton ? <SurveyorSubmitButton/> : <SurveyorNextButton onClick={gotoNextQuestion(currentQuestionIndex)}/> }
            </SurveyorButtonContainer>
        </SurveyorUIForm>
    )
}

export { SurveyorUI }