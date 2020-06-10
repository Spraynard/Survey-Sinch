import React, { forwardRef } from "react";
import styled from "styled-components";
import { SurveyComponentRefObject, SurveyComponentItem } from "../types";


const TextInputComponentLabel = styled.label`
    display: block;
    margin-bottom: 5px;
    font-size: 1.10em;
`;
const Label = ({ id, text }) => <TextInputComponentLabel htmlFor={id}>{text}</TextInputComponentLabel>

const TextInputContainer = ({ id, text, children }) => <div><Label id={id} text={text}/>{children}</div>

const Input = styled.input`
    box-sizing: border-box;
    font-size: 1.15em;
`,
    InputGroupContainer = styled.div`
        display: block
        box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.7)
    `,
    InputGroupElementContainer = styled.div`
        padding: 5px;
    `,
    TextInput = styled(Input)`
    border-radius: 2px;
    border: 1px solid #101d28;
    display: block;
    padding: 10px;
    width: 100%;
`,
    NumberInput = styled(TextInput)``;
    
type InputElementProps = {
    id : string;
    forwardedRef : SurveyComponentRefObject;
    type ?: HTMLInputElement['type']
    value : string;
    labelText : string;
    focusHandler : ( e ) => void;
    onUpdate : ( e ) => void;
}

const InputElement = ({ id, value, forwardedRef, focusHandler, onUpdate, labelText , type = "text", ...rest } : InputElementProps): JSX.Element => {
    const InputType = ( type === "number" ) ? NumberInput : TextInput;
    return (
        <TextInputContainer id={id} text={labelText}>
            <InputType
                id={id} 
                ref={forwardedRef.current[id] as React.MutableRefObject<HTMLInputElement>}
                type={type}
                value={value}
                onChange={onUpdate}
                onFocus={focusHandler}
            />
        </TextInputContainer>
    )
}

const CheckboxElement = ({ value, ...rest }) => <Input type="checkbox" value={value} { ...rest }/>
const RadioElement = ({ value, ...rest }) => <Input type="radio" value={value} { ...rest }/>

type ElementGroupProps = {
    id : string;
    current_value : string;
    heading : string;
    items : Array<SurveyComponentItem>;
    forwardedRef : SurveyComponentRefObject;
    onUpdate : ( e ) => void;
    focusHandler : ( e ) => void;
    type : string;
}

const ElementGroup = ({id, current_value, heading, type, items, onUpdate, focusHandler, forwardedRef, ...rest }: ElementGroupProps) => {
    const Element = ( type === "radio" ) ? RadioElement : ( type === "checkbox" ) ? CheckboxElement : null;

    return (
        <InputGroupContainer 
            key={id}
            tabIndex={0} 
            ref={forwardedRef.current[id]} 
            onFocus={focusHandler}
        >
            <h3>{heading}</h3>
            { items.map( 
                (item, index) =>
                    <InputGroupElementContainer key={`${id}-${index}`} >
                        <label>
                            <Element 
                                label={item.label} 
                                value={item.value}
                                checked={item.value === current_value}
                                onChange={onUpdate}
                                {...rest}
                            />
                            {item.label}
                        </label>
                    </InputGroupElementContainer> )
            }
        </InputGroupContainer>
    )
}

export {
    ElementGroup,
    InputElement
}
