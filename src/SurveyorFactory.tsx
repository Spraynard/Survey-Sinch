import React from "react";

import { ISurveyComponent, IChoicedSurveyComponent } from "./interfaces";
import { SurveyComponentType, SurveyComponentRef, SurveyComponentRefObject } from "./types";
import { InputElement, ElementGroup } from "./components/InputComponents";

type Props = {
    component: ISurveyComponent | IChoicedSurveyComponent;
    value: string;
    onUpdate: React.ChangeEventHandler;
    focusHandler: (event) => void;
    forwardedRef: SurveyComponentRefObject;
}


const SurveyorFactory = ({ component, focusHandler, onUpdate, value, forwardedRef }: Props) => {
    const type = component.type as SurveyComponentType;

    switch (type) {
        case "text":
        case "number":
            return <InputElement
                id={component.id}
                forwardedRef={forwardedRef}
                value={value}
                type={type}
                onUpdate={onUpdate}
                focusHandler={focusHandler}
                labelText={component.label}
            />
        case "textbox":
            return <textarea
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLTextAreaElement>}>{value}</textarea>
        case "select":
            return <select
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLSelectElement>}>{value}</select>
        case "radio":
        case "checkbox":
            return <ElementGroup
                id={component.id}
                current_value={value}
                heading={component.label}
                items={(component as IChoicedSurveyComponent).items}
                forwardedRef={forwardedRef} 
                type={type}
                onUpdate={onUpdate}
                focusHandler={focusHandler}
            />
        default:
            throw new Error(`Error: Unknown Component Type ${component.type}`)
    }
}

export { SurveyorFactory };