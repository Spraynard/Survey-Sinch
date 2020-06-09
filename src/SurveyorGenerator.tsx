import React from "react";
import { SurveyorSurvey, SurveyComponentState, SurveyComponentItem, SurveyComponentRefObject } from "./types";
import { SurveyorFactory } from "./SurveyorFactory";
import { makeSurveyComponentState, flatten } from "./functions";
import { isArray } from "util";
import { SurveyorContainer } from "./SurveyorContainer";
import { SurveyorFrame } from "./SurveyorFrame";
import { ISurveyComponent, IChoicedSurveyComponent } from "./interfaces";

type Props = {
    current_question : string;
    survey_data : SurveyorSurvey;
    surveyState : SurveyComponentState;
    setSurveyState : React.Dispatch<React.SetStateAction<{}>>;
    depth ?: number;
}

type InputProps = {
    component : ISurveyComponent | IChoicedSurveyComponent;
    value : any;
    onUpdate : (event) => void;
    forwardedRef : SurveyComponentRefObject;
}

const SurveyorComponent = ({ component, value, forwardedRef, onUpdate } : InputProps) => {
    const labelAfterComponent = (component.type === "checkbox") || (component.type === "radio")

    return (
        <label>
            { labelAfterComponent ? null : component.label}
                <SurveyorFactory forwardedRef={forwardedRef} component={component} value={value} onUpdate={onUpdate}/>
            { labelAfterComponent ? component.label : null}
        </label>
    )
}


const SurveyorGenerator = React.forwardRef(({ current_question, survey_data, surveyState, setSurveyState, depth = 0 } : Props, ref: SurveyComponentRefObject) => {
    const onUpdate = ( id ) => ( event ) => setSurveyState({ ...surveyState, ...makeSurveyComponentState(id, event.target.value)})
    return <SurveyorContainer depth={depth}>
        { survey_data.map( component => {

            /**
             * Allow for one level of nesting in order to display a grouping of questions to the screen.
             */
            if ( isArray(component) )
            {
                let flattened_survey_data = flatten(component),
                    survey_data_ids: Array<string> = flattened_survey_data.map((data) => data.id),
                    frame_id: string = survey_data_ids.reduce((prev, current) => prev + current, "");


                return (
                    <SurveyorFrame key={frame_id} showFrame={(survey_data_ids.includes(current_question))}>
                        { component.map( item => {
                            return <SurveyorComponent key={item.id} component={item} forwardedRef={ref} value={surveyState[item.id].value} onUpdate={onUpdate(item.id)}/>
                         })
                        }
                    </SurveyorFrame>
                )
            }
            
            /**
             * Display a single question element to the screen.
             */
            const { id } = component;

            return (
                <SurveyorFrame key={id} showFrame={id === current_question}>
                    <SurveyorComponent key={id} component={component} forwardedRef={ref} value={surveyState[id].value} onUpdate={onUpdate(id)}/>
                </SurveyorFrame>
            )
        }) }
    </SurveyorContainer>
})

export { SurveyorGenerator };