import React from "react";

import { ISurveyComponent, IChoicedSurveyComponent } from "./interfaces";
import { SurveyComponentType , SurveyComponentRefObject } from "./types";
import { InputElement, ElementGroup, SelectElement } from "./SurveySinchInputComponents";

type Props = {
    component: ISurveyComponent | IChoicedSurveyComponent;
    value: string | Array<string>;
    singleValueUpdateHandler : (event : React.ChangeEvent<HTMLInputElement>) => void;
    multiValueUpdateHandler: (event : React.ChangeEvent<HTMLInputElement>) => void;
    focusHandler: (event : React.FocusEvent<HTMLInputElement>) => void;
    forwardedRef: SurveyComponentRefObject;
}


const SurveySinchFactory = ({ component, focusHandler, singleValueUpdateHandler, multiValueUpdateHandler, value, forwardedRef }: Props): JSX.Element => {
    const type = component.type as SurveyComponentType;

    switch (type) {
        case "text":
        case "number":
            return <InputElement
                id={component.id}
                forwardedRef={forwardedRef}
                value={value as string}
                type={type}
                onUpdate={singleValueUpdateHandler}
                focusHandler={focusHandler}
                labelText={component.label}
            />
        case "textbox":
            return <textarea
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLTextAreaElement>}>{value}</textarea>
        case "select":
            return <SelectElement 
                id={component.id}
                current_value={value as string}
                label={component.label}
                items={(component as IChoicedSurveyComponent).items}
                forwardedRef={forwardedRef}
                onUpdate={singleValueUpdateHandler}
                focusHandler={focusHandler}
            />
        case "radio":
            return <ElementGroup
                id={component.id}
                current_value={value as string}
                label={component.label}
                items={(component as IChoicedSurveyComponent).items}
                forwardedRef={forwardedRef} 
                type={type}
                onUpdate={singleValueUpdateHandler}
                focusHandler={focusHandler}
            />
        case "checkbox":
            return <ElementGroup
                id={component.id}
                current_value={value as Array<string>}
                label={component.label}
                items={(component as IChoicedSurveyComponent).items}
                forwardedRef={forwardedRef} 
                type={type}
                onUpdate={multiValueUpdateHandler}
                focusHandler={focusHandler}
            />
        default:
            throw new Error(`Error: Unknown Component Type ${component.type}`)
    }
}

export { SurveySinchFactory };