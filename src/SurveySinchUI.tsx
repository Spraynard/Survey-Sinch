import React, { useEffect } from 'react';
import { SurveySinchGenerator } from "./SurveySinchGenerator";
import { SurveySinchSurvey, SurveyComponentState, SurveyComponentRefObject } from "./types";
import { SurveySinchNextButton, SurveySinchPreviousButton, SurveySinchSubmitButton } from './SurveySinchButton';
import { first, calculateSurveyProgress, shouldNextButtonBeEnabled } from './functions';
import { gotoNextQuestion, gotoPreviousQuestion, onSurveySinchElementFocus, onSurveySinchElementUpdate, onSurveySinchMultiSelectElementUpdate } from "./event_handlers";
import { LinearProgress } from '@material-ui/core';

import styled from "styled-components";


const SurveySinchUIForm = styled.form`
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
const SurveySinchButtonContainer = styled.div`
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

type Props = {
    initial_state : SurveyComponentState
    initial_transformed_data: SurveySinchSurvey;
    submit_handler: ( 
        surveyState : SurveyComponentState,
        surveyData : SurveySinchSurvey
    ) => ( e : React.FormEvent ) => void
}

const SurveySinchUI = ({ initial_state, initial_transformed_data, submit_handler } : Props) : JSX.Element => {
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
        nextButtonEnabled = shouldNextButtonBeEnabled(currentQuestionID, surveyState),
        currentQuestionIsLastQuestion = ( currentQuestionID === lastQuestionID ),
        currentQuestionIndex = questionIDs.indexOf(currentQuestionID),
        currentQuestionProgress = calculateSurveyProgress(surveyState),
        currentQuestionProgressIsMaxValue = currentQuestionProgress === 100,
        previousButtonOnClick: (event: HTMLButtonElement) => void = gotoPreviousQuestion(currentQuestionIndex, questionIDs, setCurrentQuestionID),
        nextButtonClick: (event: HTMLButtonElement) => void = gotoNextQuestion(currentQuestionIndex, questionIDs, setCurrentQuestionID)

    return (
        <SurveySinchUIForm onSubmit={submit_handler(surveyState, transformedSurveyData)}>
            <ProgressContainer>
                <LinearProgress variant="determinate" value={currentQuestionProgress}/>
            </ProgressContainer>
            <GeneratorContainer>
                <SurveySinchGenerator 
                    current_question_id={currentQuestionID}
                    ref={questionRefs}
                    survey_data={transformedSurveyData} 
                    surveyState={surveyState}
                    singleValueUpdateHandler={onSurveySinchElementUpdate(surveyState, setSurveyState)}
                    multiValueUpdateHandler={onSurveySinchMultiSelectElementUpdate(surveyState, setSurveyState)}
                    onFocusHandler={onSurveySinchElementFocus(surveyState, setSurveyState, setCurrentQuestionID)}
                />
            </GeneratorContainer>
            <SurveySinchButtonContainer>
                <SurveySinchPreviousButton disabled={isFirstQuestion} onClick={previousButtonOnClick}/>
                { ! currentQuestionIsLastQuestion ? <SurveySinchNextButton disabled={! nextButtonEnabled} onClick={nextButtonClick}/> : null }
                { ( currentQuestionProgressIsMaxValue || currentQuestionIsLastQuestion ) ? <SurveySinchSubmitButton disabled={! nextButtonEnabled}/> : null }
            </SurveySinchButtonContainer>
        </SurveySinchUIForm>
    )
}

export { SurveySinchUI }