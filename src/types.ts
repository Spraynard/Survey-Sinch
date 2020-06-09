import { ISurveyComponent, IChoicedSurveyComponent } from "./interfaces";

export type SurveyComponentType = "text" | "number" | "textbox" | "select" | "radio";

export type SurveyComponentItem = {
    label : string,
    value : string | number
}
export type SurveyComponentRef = React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
export type SurveyComponentRefObject = React.MutableRefObject<{ [ id : string ] : SurveyComponentRef }>;
export type SurveyComponent = ISurveyComponent | IChoicedSurveyComponent | SurveyComponentGroup
export type SurveyComponentGroup = Array<ISurveyComponent | IChoicedSurveyComponent>

export type SurveyComponentState = {
    [ id : string ] : {
        value : string;
        visible : boolean;
    }
}

export type SurveyorSurvey = Array<SurveyComponent>