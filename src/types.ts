import { ISurveyComponent, IChoicedSurveyComponent } from "./interfaces";

export type SurveyComponentType = "text" | "number" | "textbox" | "select" | "radio" | "checkbox" | "multi-select";

export type SurveyComponentItem = {
    label : string,
    value : string,
}

export type SurveySinchReportItem = {
    question : string,
    answer : string,
}

export type SurveySinchReport = Array<SurveySinchReportItem>;

export type SurveySinchFormEvent = {
    SyntheticEvent : React.FormEvent
    FormData : SurveySinchReport
}

export type SurveySinchFormEventHandler = ( e : SurveySinchFormEvent ) => void;
export type SurveySinchInputChangeHandler = ( id : string ) => React.ChangeEventHandler;
export type SurveySinchInputFocusHandler = ( id : string ) => React.FocusEventHandler;
export type SurveySinchClickHandler = ( id : string ) => React.MouseEventHandler;

export type SurveyComponentTypes = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLElement;
export type SurveyComponentRef = React.MutableRefObject<SurveyComponentTypes>
export type SurveyComponentRefObject = React.MutableRefObject<{ [ id : string ] : SurveyComponentRef }>;
export type SurveyComponent = ISurveyComponent | IChoicedSurveyComponent | SurveyComponentGroup
export type SurveyComponentGroup = Array<ISurveyComponent | IChoicedSurveyComponent>

export type SurveyComponentState = {
    [ id : string ] : {
        value : string | Array<string>;
        touched : boolean;
    }
}

export type SurveySinchSurvey = Array<SurveyComponent>