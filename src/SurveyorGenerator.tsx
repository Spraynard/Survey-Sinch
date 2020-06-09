import React from "react";
import { SurveyorSurvey, SurveyComponentState, SurveyComponentItem, SurveyComponentRef } from "./types";
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
    forwardedRef : SurveyComponentRef;
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


const SurveyorGenerator = React.forwardRef(({ current_question, survey_data, surveyState, setSurveyState, depth = 0 } : Props, ref: SurveyComponentRef) => {
    const onUpdate = ( id ) => ( event ) => setSurveyState({ ...surveyState, ...makeSurveyComponentState(id, event.target.value)})
    return <SurveyorContainer depth={depth}>
        { survey_data.map( component => {
            if ( isArray(component) )
            {
                let flattened_survey_data = flatten(component),
                    survey_data_ids = flattened_survey_data.map((data) => data.id);


                console.log(flattened_survey_data);
                return (
                    <SurveyorFrame display={(survey_data_ids.includes(current_question))}>
                        { component.map( item => {
                            return <SurveyorComponent component={item} forwardedRef={ref} value={surveyState[item.id].value} onUpdate={onUpdate(item.id)}/>
                         })
                        }
                    </SurveyorFrame>
                )
            }

            const { id } = component;

            return (
                <SurveyorFrame display={id === current_question}>
                    <SurveyorComponent component={component} forwardedRef={ref} value={surveyState[id].value} onUpdate={onUpdate(id)}/>
                </SurveyorFrame>
            )
        }) }
    </SurveyorContainer>
})

export { SurveyorGenerator };