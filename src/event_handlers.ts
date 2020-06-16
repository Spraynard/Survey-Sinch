import { SurveyComponentState, SurveySinchFormEvent, SurveySinchFormEventHandler, SurveySinchSurvey, SurveySinchReport, SurveySinchReportItem } from "./types";
import { ISurveyComponent, IChoicedSurveyComponent } from "./interfaces";
import { flatten } from "./functions";
import { isArray } from "util";

const goToQuestion = ( 
    question_index: number,
    questionIDs: Array<string>,
    setCurrentQuestion: React.Dispatch<any>, 
    question_index_predicate: ( value: number ) => boolean,
    incrementor: ( value: number ) => number
): ( e: HTMLButtonElement ) => void => () => {
    if ( question_index_predicate( question_index ) )
    {
        return;
    }

    const newQuestionIndex = incrementor(question_index),
        newQuestionId = questionIDs[newQuestionIndex];

    setCurrentQuestion(newQuestionId);
}

export const gotoPreviousQuestion = ( question_index: number, questionIDs, setCurrentQuestion ) : ( e : HTMLButtonElement ) => void =>
    goToQuestion(
        question_index,
        questionIDs,
        setCurrentQuestion,
        ( value ) => value === 0,
        ( value ) => value - 1
    )

export const gotoNextQuestion = ( question_index: number, questionIDs, setCurrentQuestion ) : ( e : HTMLButtonElement ) => void =>
    goToQuestion(
        question_index,
        questionIDs,
        setCurrentQuestion,
        ( value ) => value >= questionIDs.length,
        ( value ) => value + 1
    )


/**
 * Global survey item "onUpdate" handler. Provides a general method of taking
 * the value of the item that has been interacted with and saving it within
 * state.
 * 
 * @param surveyState Survey State Object Getter Hook
 * @param setSurveyState Survey State Object Setter Hook
 */
export const onSurveySinchElementUpdate = (
    surveyState: SurveyComponentState,
    setSurveyState: React.Dispatch<React.SetStateAction<SurveyComponentState>>
) => {
    return (id: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        return setSurveyState({
            ...surveyState,
            [id]: {
                ...surveyState[id],
                value: event.target.value
            }
        })
    }
}

/**
 * Element onUpdate handler used to handle update of elements that allow for selecting multiple items.
 * @param surveyState SurveyState object getter hook
 * @param setSurveyState SurveyState object setter hook
 */
export const onSurveySinchMultiSelectElementUpdate = (
    surveyState: SurveyComponentState,
    setSurveyState: React.Dispatch<React.SetStateAction<SurveyComponentState>>
) => {
    return (id: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        const givenValue = event.target.value,
              elementStateValues: Array<string> = surveyState[id].value as Array<string>;
        
              let newElementStateValues: Array<string> = [ ...elementStateValues, givenValue ];

        if ( elementStateValues.includes(givenValue) )
        {
            newElementStateValues = elementStateValues.filter( value => value !== givenValue );
        }

        return setSurveyState({
            ...surveyState,
            [id]: {
                ...surveyState[id],
                value: newElementStateValues
            }
        })
    }
}

/**
 * Global survey item "onFocus" event handler. Handles side effects of focusing
 * for all elements that are created.
 * 
 * @param surveyState Surrvey state object getter hook
 * @param setSurveyState Survey state object setter hook
 * @param setCurrentQuestionID Setter Hook for the current question id
 */
export const onSurveySinchElementFocus = (
    surveyState: SurveyComponentState,
    setSurveyState: React.Dispatch<React.SetStateAction<SurveyComponentState>>,
    setCurrentQuestionID: React.Dispatch<React.SetStateAction<string>>
) => {
    return (id: string) => (): void => {
        setCurrentQuestionID(id);

        if (surveyState[id].touched) {
            return;
        }

        return setSurveyState({
            ...surveyState,
            [id]: {
                ...surveyState[id],
                touched: true
            }
        })
    }
}

const getMember = ( arr : Array<object>, predicate : ( obj : object ) => boolean ) => arr.reduce((prev, curr) => {
    if ( prev )
    {
        return prev;
    }

    if ( predicate( curr ) )
    {
        return curr
    }

    return prev;
}, null);

const getObjectByID = ( arr, id ) => getMember( arr, ( obj ) => ( obj.id && obj.id === id ))

/**
 * Partialized function used to wrap around the full instance of the React.FormEvent that
 * would be obtained by the form submission.
 */
export const formEventHandler = (
    onSubmit : SurveySinchFormEventHandler
) => (
    surveyState : SurveyComponentState,
    surveyData : SurveySinchSurvey
) => ( e : React.FormEvent ) : void => {
    if ( ! e.defaultPrevented )
    {
        e.preventDefault();
    }

    const formData : SurveySinchReport = Object.entries(surveyState).map( entry => {
        const [ key, componentState ] = entry,
            componentLabel : string = (
                getObjectByID( flatten(surveyData), key ) as ISurveyComponent | IChoicedSurveyComponent 
            ).label,
            componentValue : string = isArray( componentState.value ) ? componentState.value.join(",") : componentState.value

        return ({
            question : componentLabel,
            answer : componentValue
        } as SurveySinchReportItem)
    });

    /**
     * Here we build our form event from the previous operations.
     */
    const FormEvent : SurveySinchFormEvent = {
        SyntheticEvent : e,
        FormData : formData
    }

    return onSubmit( FormEvent );
}

/**
 * Default on submit will just console log out the current data gained from our survey.
 */
export const defaultOnSubmitHandler = ( e : SurveySinchFormEvent ) : void => {
    console.group("Survey Sinch Submit Event");
    console.log("Submit Occured")
    console.log(JSON.stringify(e.FormData, null, 4));
    console.groupEnd();
}