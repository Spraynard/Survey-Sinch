import React from "react";
import { SurveySinchSurvey, SurveyComponentState, SurveyComponentRefObject, SurveySinchInputChangeHandler, SurveySinchInputFocusHandler } from "./types";
import { flatten } from "./functions";
import { isArray } from "util";
import { SurveySinchContainer } from "./SurveySinchContainer";
import { SurveySinchFrame } from "./SurveySinchFrame";
import { SurveySinchFactory } from "./SurveySinchFactory";

type Props = {
    current_question_id: string;
    survey_data: SurveySinchSurvey;
    surveyState: SurveyComponentState;
    singleValueUpdateHandler : SurveySinchInputChangeHandler;
    multiValueUpdateHandler : SurveySinchInputChangeHandler;
    onFocusHandler : SurveySinchInputFocusHandler;
}

const SurveySinchGeneratorInner = ({ current_question_id, singleValueUpdateHandler, multiValueUpdateHandler, onFocusHandler, survey_data, surveyState }: Props, ref: SurveyComponentRefObject): JSX.Element => {

    return <SurveySinchContainer>
        {survey_data.map(component => {
            /**
             * Allow for one level of nesting in order to display a grouping of questions to the screen.
             */
            if (isArray(component)) {
                const flattened_survey_data = flatten(component),
                    survey_data_ids: Array<string> = flattened_survey_data.map((data) => data.id),
                    frame_id: string = survey_data_ids.reduce((prev, current) => prev + current, "");


                return (
                    <SurveySinchFrame key={frame_id} show_frame={(survey_data_ids.includes(current_question_id))}>
                        {
                            component.map(item => <SurveySinchFactory 
                                    key={item.id} 
                                    component={item} 
                                    forwardedRef={ref} 
                                    value={surveyState[item.id].value}
                                    focusHandler={onFocusHandler(item.id)}
                                    singleValueUpdateHandler={singleValueUpdateHandler(item.id)}
                                    multiValueUpdateHandler={multiValueUpdateHandler(item.id)}
                                />
                            )
                        }
                    </SurveySinchFrame>
                )
            }

            /**
             * Display a single question element to the screen.
             */
            const { id, type } = component;

            return (
                <SurveySinchFrame key={id} show_frame={id === current_question_id}>
                    <SurveySinchFactory 
                        key={id} 
                        component={component} 
                        forwardedRef={ref} 
                        value={surveyState[id].value}
                        focusHandler={onFocusHandler(id)}
                        singleValueUpdateHandler={singleValueUpdateHandler(id)}
                        multiValueUpdateHandler={multiValueUpdateHandler(id)}
        />
                </SurveySinchFrame>
            )
        })}
    </SurveySinchContainer>
}

const SurveySinchGenerator = React.forwardRef(SurveySinchGeneratorInner)

export { SurveySinchGenerator };