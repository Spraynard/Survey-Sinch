import React from "react";

import { ISurveyComponent } from "./interfaces";
import { SurveyComponentType, SurveyComponentRef, SurveyComponentRefObject } from "./types";

type Props = {
    component : ISurveyComponent;
    value : string;
    onUpdate : React.ChangeEventHandler;
    forwardedRef : SurveyComponentRefObject;
}

const SurveyorFactory = ({ component, onUpdate, value, forwardedRef } : Props) => {
    const type = component.type as SurveyComponentType;

    /**
     * Casting the values of the ref to the specific types that they need to be
     */
    switch ( type ) {
        case "text":
            return <input
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLInputElement> | null} type="text" value={value} onChange={onUpdate}/>
        case "number":
            return <input
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLInputElement> | null} type="number" value={value}/>
        case "textbox":
            return <textarea
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLTextAreaElement> | null}>{value}</textarea>
        case "select":
            return <select
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLSelectElement> | null}>{value}</select>
        case "radio":
            return <input
                id={component.id}
                ref={forwardedRef.current[component.id] as React.MutableRefObject<HTMLInputElement> | null} type="radio"/>
        default:
            throw new Error(`Error: Unknown Component Type ${component.type}`)
    }
}

export { SurveyorFactory };