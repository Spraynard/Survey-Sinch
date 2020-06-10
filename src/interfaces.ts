import { SurveyComponentItem } from "./types";

export interface ISurveyComponent {
    id?: string;
    type : string, // The Type of component it is
    label : string
}

export interface IChoicedSurveyComponent extends ISurveyComponent {
    items : Array<SurveyComponentItem>
}