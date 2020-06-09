import React from "react";

import { ISurveyComponent } from "./interfaces";
import { SurveyComponentType, SurveyComponentRef } from "./types";

type Props = {
    component : ISurveyComponent;
    value : string;
    onUpdate : React.ChangeEventHandler;
    forwardedRef : SurveyComponentRef;
}

const SurveyorFactory = ({ component, onUpdate, value, forwardedRef } : Props) => {
    const type = component.type as SurveyComponentType;

    /**
     * Casting the values of the ref to the specific types that they need to be
     */
    switch ( type ) {
        case "text":
            return <input ref={forwardedRef as React.MutableRefObject<HTMLInputElement>} type="text" value={value} onChange={onUpdate}/>
        case "number":
            return <input ref={forwardedRef as React.MutableRefObject<HTMLInputElement>} type="number" value={value}/>
        case "textbox":
            return <textarea ref={forwardedRef as React.MutableRefObject<HTMLTextAreaElement>}>{value}</textarea>
        case "select":
            return <select ref={forwardedRef as React.MutableRefObject<HTMLSelectElement>}>{value}</select>
        case "radio":
            return <input ref={forwardedRef as React.MutableRefObject<HTMLInputElement>} type="radio"/>
        default:
            throw new Error(`Error: Unknown Component Type ${component.type}`)
    }
}

export { SurveyorFactory };