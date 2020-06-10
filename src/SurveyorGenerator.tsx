import React from "react";
import { SurveyorSurvey, SurveyComponentState, SurveyComponentItem, SurveyComponentRefObject } from "./types";
import { flatten } from "./functions";
import { isArray } from "util";
import { SurveyorContainer } from "./SurveyorContainer";
import { SurveyorFrame } from "./SurveyorFrame";
import { SurveyorFactory } from "./SurveyorFactory";

type Props = {
    current_question_id: string;
    survey_data: SurveyorSurvey;
    surveyState: SurveyComponentState;
    setSurveyState: React.Dispatch<React.SetStateAction<SurveyComponentState>>;
    depth?: number;
}

const SurveyorGenerator = React.forwardRef(({ current_question_id, survey_data, surveyState, setSurveyState, depth = 0 }: Props, ref: SurveyComponentRefObject) => {
    const onUpdate = (id: string) => (event) => {
        return setSurveyState({
            ...surveyState,
            [id]: {
                ...surveyState[id],
                value: event.target.value
            }
        })
    },
    focusHandler = (id: string) => (event) => {
        if ( surveyState[id].touched )
        {
            return;
        }
        
        return setSurveyState({
            ...surveyState,
            [id]: {
                ...surveyState[id],
                touched: true
            }
        })
    };

return <SurveyorContainer depth={depth}>
    {survey_data.map(component => {

        /**
         * Allow for one level of nesting in order to display a grouping of questions to the screen.
         */
        if (isArray(component)) {
            let flattened_survey_data = flatten(component),
                survey_data_ids: Array<string> = flattened_survey_data.map((data) => data.id),
                frame_id: string = survey_data_ids.reduce((prev, current) => prev + current, "");


            return (
                <SurveyorFrame key={frame_id} show_frame={(survey_data_ids.includes(current_question_id))}>
                    {component.map(item => <SurveyorFactory key={item.id} component={item} forwardedRef={ref} value={surveyState[item.id].value} focusHandler={focusHandler(item.id)} onUpdate={onUpdate(item.id)} />)}
                </SurveyorFrame>
            )
        }

        /**
         * Display a single question element to the screen.
         */
        const { id } = component;

        return (
            <SurveyorFrame key={id} show_frame={id === current_question_id}>
                <SurveyorFactory key={id} component={component} forwardedRef={ref} value={surveyState[id].value} focusHandler={focusHandler(id)} onUpdate={onUpdate(id)} />
            </SurveyorFrame>
        )
    })}
</SurveyorContainer>
})

export { SurveyorGenerator };