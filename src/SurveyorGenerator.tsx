import React from "react";
import { SurveyorSurvey, SurveyComponentState, SurveyComponentRefObject, SurveyorInputChangeHandler, SurveyorInputFocusHandler } from "./types";
import { flatten } from "./functions";
import { isArray } from "util";
import { SurveyorContainer } from "./SurveyorContainer";
import { SurveyorFrame } from "./SurveyorFrame";
import { SurveyorFactory } from "./SurveyorFactory";

type Props = {
    current_question_id: string;
    survey_data: SurveyorSurvey;
    surveyState: SurveyComponentState;
    onUpdateHandler : SurveyorInputChangeHandler;
    onFocusHandler : SurveyorInputFocusHandler;
}

const SurveyorGeneratorInner = ({ current_question_id, onUpdateHandler, onFocusHandler, survey_data, surveyState }: Props, ref: SurveyComponentRefObject): JSX.Element => {

    return <SurveyorContainer>
        {survey_data.map(component => {
            /**
             * Allow for one level of nesting in order to display a grouping of questions to the screen.
             */
            if (isArray(component)) {
                const flattened_survey_data = flatten(component),
                    survey_data_ids: Array<string> = flattened_survey_data.map((data) => data.id),
                    frame_id: string = survey_data_ids.reduce((prev, current) => prev + current, "");


                return (
                    <SurveyorFrame key={frame_id} show_frame={(survey_data_ids.includes(current_question_id))}>
                        {
                            component.map(item => <SurveyorFactory 
                                    key={item.id} 
                                    component={item} 
                                    forwardedRef={ref} 
                                    value={surveyState[item.id].value}
                                    focusHandler={onFocusHandler(item.id)}
                                    onUpdate={onUpdateHandler(item.id)} 
                                />
                            )
                        }
                    </SurveyorFrame>
                )
            }

            /**
             * Display a single question element to the screen.
             */
            const { id } = component;

            return (
                <SurveyorFrame key={id} show_frame={id === current_question_id}>
                    <SurveyorFactory 
                        key={id} 
                        component={component} 
                        forwardedRef={ref} 
                        value={surveyState[id].value}
                        focusHandler={onFocusHandler(id)}
                        onUpdate={onUpdateHandler(id)}
                    />
                </SurveyorFrame>
            )
        })}
    </SurveyorContainer>
}

const SurveyorGenerator = React.forwardRef(SurveyorGeneratorInner)

export { SurveyorGenerator };