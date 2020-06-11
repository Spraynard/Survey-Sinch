import React, {  useEffect } from "react";
import { SurveyorUI } from "./SurveyorUI";
import { SurveyorSurvey } from "./types";
import { generateSurveyorData } from "./functions";

type Props = {
    survey_data?: SurveyorSurvey;
    onSubmit?: ( e ) => void;
}

/**
 * This is a main component of the surveyor library that generates all of the different input
 * components and frames.
 * 
 * In order to prevent re-renders, we have included a Surveyor UI component
 * 
 */
const Surveyor = ({ survey_data, onSubmit } : Props) : JSX.Element => {

    const [ initialSurveyState, setInitialSurveyState ] = React.useState({});
    const [ initialTransformedSurveyData, setTransformedSurveyData ] = React.useState([]);

    /**
     * Asyncronously generate our Surveyor backend.
     */
    useEffect(() => {
        async function initializeSurveyerDataGeneration() {
            const [ initial_state, initial_transformed_data ] = await generateSurveyorData(survey_data);

            setInitialSurveyState(initial_state);
            setTransformedSurveyData(initial_transformed_data);
        }

        initializeSurveyerDataGeneration()
    }, []);

        /**
     * Function wraps around the user supplied submit handler and makes sure that the form's default actions have been prevented.
     * @param e Form Submit Event.
     */
    const submitHandler = ( e ) => {
        if ( ! e.defaultPrevented )
        {
            e.preventDefault();
        }

        return onSubmit( e );
    }

    return <SurveyorUI 
        initial_state={initialSurveyState} 
        initial_transformed_data={initialTransformedSurveyData} 
        submit_handler={submitHandler}
    />
}

export { Surveyor }