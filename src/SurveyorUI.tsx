import React, { useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import { SurveyorGenerator } from "./SurveyorGenerator";
import { SurveyorSurvey, SurveyComponentState, SurveyComponentRef, SurveyComponentRefObject } from "./types";
import styled from "styled-components";
import { SurveyorNextButton, SurveyorPreviousButton, SurveyorSubmitButton } from './components/SurveyorButton';
import { first } from './functions';
import { gotoNextQuestion, gotoPreviousQuestion } from "./event_handlers";
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

/**
 * Holds Button Components on main screen view
 */
const SurveyorButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 15px 0px 15px 0px;
`
/**
 * Holds Progress component on the main screen view
 */
const ProgressContainer = styled.div`
    margin-bottom: 3rem;
    padding: 1rem 2rem 1rem 2rem;
`;

/**
 * Holds the actual 
 */
const GeneratorContainer = styled.div`
    margin-bottom: 2rem;
`;

const SurveyorUI = ({ initial_state, initial_transformed_data, submit_handler } : Props) => {
    const [surveyState, setSurveyState] = React.useState( initial_state ),
        [transformedSurveyData, setTransformedSurveyData] = React.useState( initial_transformed_data ),
        [currentQuestion, setCurrentQuestion] = React.useState( null );
    /**
     * List of refs for all of the question inputs.
     */
    let questionRefs: SurveyComponentRefObject = React.useRef(null);


    /**
     * This acts as a sort of "didComponentUpdate" hook
     * that makes sure there is data from our JSON in the overall surveyState and transformedSurveyData
     */
    useEffect(() => {
        if ( Object.keys(surveyState).length === 0 )
        {
            setSurveyState(initial_state);
            setCurrentQuestion(first(Object.keys(initial_state)));

            questionRefs.current = Object.keys(initial_state).reduce(( prev, curr ) => {
                prev[curr] = React.createRef();
                return prev;
            }, {})
        }

        if ( transformedSurveyData.length === 0 )
        {
            setTransformedSurveyData(initial_transformed_data)
        }

        /**
         * If all refs are situated 
         */
        if ( 
            questionRefs.current && 
            questionRefs.current.hasOwnProperty(currentQuestion) &&
            questionRefs.current[currentQuestion].current &&
            currentQuestion !== first(Object.keys(surveyState))
        )
        {
            let survey_input = questionRefs.current[currentQuestion].current;
            if ( document.activeElement !== ReactDOM.findDOMNode(survey_input) )
            {
                survey_input.focus()
            }
        }
    });

    const questionIDs = Object.keys(surveyState),
        firstQuestionID = first(questionIDs),
        lastQuestionID = questionIDs[questionIDs.length - 1],
        isFirstQuestion = ( currentQuestion === firstQuestionID ), 
        showSubmitButton = ( currentQuestion === lastQuestionID ),
        currentQuestionIndex = questionIDs.indexOf(currentQuestion),
        currentQuestionProgress = ( questionIDs.indexOf(currentQuestion) / questionIDs.length ) * 100,
        previousButtonOnClick: (event: HTMLButtonElement) => void = gotoPreviousQuestion( currentQuestionIndex, questionIDs, setCurrentQuestion, questionRefs),
        nextButtonClick: (event: HTMLButtonElement) => void = gotoNextQuestion(  currentQuestionIndex, questionIDs, setCurrentQuestion, questionRefs)

    return (
        <SurveyorUIForm onSubmit={submit_handler}>
            <ProgressContainer>
                <LinearProgress variant="determinate" value={currentQuestionProgress}/>
            </ProgressContainer>
            <GeneratorContainer>
                <SurveyorGenerator 
                    current_question={currentQuestion}
                    ref={questionRefs}
                    survey_data={transformedSurveyData} 
                    surveyState={surveyState} 
                    setSurveyState={setSurveyState}
                />
            </GeneratorContainer>
            <SurveyorButtonContainer>
                <SurveyorPreviousButton disabled={isFirstQuestion} onClick={previousButtonOnClick}/>
                { showSubmitButton ? <SurveyorSubmitButton/> : <SurveyorNextButton onClick={nextButtonClick}/> }
            </SurveyorButtonContainer>
        </SurveyorUIForm>
    )
}

export { SurveyorUI }