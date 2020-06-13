import React, {  useEffect } from "react";
import { SurveySinchUI } from "./SurveySinchUI";
import { SurveySinchSurvey, SurveySinchFormEventHandler } from "./types";
import { generateSurveyorData } from "./functions";
import { defaultOnSubmitHandler, formEventHandler } from "./event_handlers";

type Props = {
    survey_data?: SurveySinchSurvey;
    onSubmit?: SurveySinchFormEventHandler;
}

/**
 * This is a main component of the surveyor library that generates all of the different input
 * components and frames.
 * 
 * In order to prevent re-renders, we have included a Surveyor UI component
 * 
 */
const SurveySinch = ({ survey_data, onSubmit = defaultOnSubmitHandler } : Props) : JSX.Element => {

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

    const partialSubmitHandler = formEventHandler(onSubmit);

    return <SurveySinchUI 
        initial_state={initialSurveyState} 
        initial_transformed_data={initialTransformedSurveyData} 
        submit_handler={partialSubmitHandler}
    />
}

export { SurveySinch }