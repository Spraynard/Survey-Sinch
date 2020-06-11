import React, { useEffect } from 'react';
import { SurveyorGenerator } from "./SurveyorGenerator";
import { SurveyorSurvey, SurveyComponentState, SurveyComponentRefObject } from "./types";
import styled from "styled-components";
import { SurveyorNextButton, SurveyorPreviousButton, SurveyorSubmitButton } from './components/SurveyorButton';
import { first, calculateSurveyProgress, onSurveyorElementUpdate, onSurveyorElementFocus } from './functions';
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
    box-shadow: 2px 2px 5px rgba(0,0,0, 0.4);
    border-radius: 2px;

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

const SurveyorUI = ({ initial_state, initial_transformed_data, submit_handler } : Props) : JSX.Element => {
    const [surveyState, setSurveyState] = React.useState( initial_state ),
        [transformedSurveyData, setTransformedSurveyData] = React.useState( initial_transformed_data ),
        [currentQuestionID, setCurrentQuestionID] = React.useState( null );
    /**
     * List of refs for all of the question inputs.
     */
    const questionRefs: SurveyComponentRefObject = React.useRef(null);


    /**
     * This acts as a sort of "didComponentUpdate" hook
     * that makes sure there is data from our JSON in the overall surveyState and transformedSurveyData
     */
    useEffect(() => {
        if ( Object.keys(surveyState).length === 0 )
        {
            setSurveyState(initial_state);
            setCurrentQuestionID(first(Object.keys(initial_state)));

            questionRefs.current = Object.keys(initial_state).reduce(( prev, curr ) => {
                prev[curr] = React.createRef<HTMLElement>();
                return prev;
            }, {})
        }

        if ( transformedSurveyData.length === 0 )
        {
            setTransformedSurveyData(initial_transformed_data)
        }

        /**
         * If all refs are attached to dom elements and
         * our current question is not the first question.
         * 
         * This allows for programmatic focus between each of our elements
         */
        if ( 
            questionRefs.current && 
            Object.prototype.hasOwnProperty.call(questionRefs.current, currentQuestionID) &&
            questionRefs.current[currentQuestionID].current &&
            currentQuestionID !== first(Object.keys(surveyState))
        )
        {
            const survey_input = questionRefs.current[currentQuestionID].current;
            
            /** Don't hijack if the element that is currently focused IS our active element */
            if ( document.activeElement !== survey_input )
            {
                survey_input.focus()
            }
        }
    });

    const questionIDs = Object.keys(surveyState),
        firstQuestionID = first(questionIDs),
        lastQuestionID = questionIDs[questionIDs.length - 1],
        isFirstQuestion = ( currentQuestionID === firstQuestionID ),
        nextButtonEnabled = ( currentQuestionID && surveyState[currentQuestionID] && surveyState[currentQuestionID].value ),
        showSubmitButton = ( currentQuestionID === lastQuestionID ),
        currentQuestionIndex = questionIDs.indexOf(currentQuestionID),
        currentQuestionProgress = calculateSurveyProgress(surveyState),
        previousButtonOnClick: (event: HTMLButtonElement) => void = gotoPreviousQuestion( currentQuestionIndex, questionIDs, setCurrentQuestionID),
        nextButtonClick: (event: HTMLButtonElement) => void = gotoNextQuestion(  currentQuestionIndex, questionIDs, setCurrentQuestionID)

    return (
        <SurveyorUIForm onSubmit={submit_handler}>
            <ProgressContainer>
                <LinearProgress variant="determinate" value={currentQuestionProgress}/>
            </ProgressContainer>
            <GeneratorContainer>
                <SurveyorGenerator 
                    current_question_id={currentQuestionID}
                    ref={questionRefs}
                    survey_data={transformedSurveyData} 
                    surveyState={surveyState}
                    onUpdateHandler={onSurveyorElementUpdate(surveyState, setSurveyState)}
                    onFocusHandler={onSurveyorElementFocus(surveyState, setSurveyState, setCurrentQuestionID)}
                />
            </GeneratorContainer>
            <SurveyorButtonContainer>
                <SurveyorPreviousButton disabled={isFirstQuestion} onClick={previousButtonOnClick}/>
                { showSubmitButton ? <SurveyorSubmitButton disabled={! nextButtonEnabled} /> 
                                    : <SurveyorNextButton disabled={! nextButtonEnabled} onClick={nextButtonClick}/> }
            </SurveyorButtonContainer>
        </SurveyorUIForm>
    )
}

export { SurveyorUI }