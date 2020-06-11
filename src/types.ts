import { ISurveyComponent, IChoicedSurveyComponent } from "./interfaces";

export type SurveyComponentType = "text" | "number" | "textbox" | "select" | "radio" | "checkbox";

export type SurveyComponentItem = {
    label : string,
    value : string | number
}

export type SurveyorInputChangeHandler = ( id : string ) => React.ChangeEventHandler;
export type SurveyorInputFocusHandler = ( id : string ) => React.FocusEventHandler

export type SurveyComponentTypes = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLElement;
export type SurveyComponentRef = React.MutableRefObject<SurveyComponentTypes>
export type SurveyComponentRefObject = React.MutableRefObject<{ [ id : string ] : SurveyComponentRef }>;
export type SurveyComponent = ISurveyComponent | IChoicedSurveyComponent | SurveyComponentGroup
export type SurveyComponentGroup = Array<ISurveyComponent | IChoicedSurveyComponent>

export type SurveyComponentState = {
    [ id : string ] : {
        value : string;
        touched : boolean;
    }
}

export type SurveyorSurvey = Array<SurveyComponent>