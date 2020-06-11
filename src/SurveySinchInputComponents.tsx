import React from "react";
import styled from "styled-components";
import { SurveyComponentRefObject, SurveyComponentItem } from "./types";
import { isArray } from "util";


const Label = styled.label`
    font-size: 1.10em;
`;

const TextInputLabel = styled(Label)`
    display: block;
    margin-bottom: 5px;
    font-weight: bolder;
`;

const Input = styled.input`
        box-sizing: border-box;
        font-size: 1.15em;
`,
    InputContainer = styled.div`
        display: block;
        padding: 5px;

        & + & {
            margin-top: 15px;
        }
    `,
    InputContainerHeading = styled.h4`
        margin-top: 0;
        margin-bottom: 0.5em;
        font-size: 1.15em;
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

const TextInputContainer = ({ id, text, children }: { id : string, text : string, children : React.ReactNode}) => 
    <InputContainer>
        <TextInputLabel htmlFor={id}>{text}</TextInputLabel>
        {children}
    </InputContainer>

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

type SelectableElementProps = {
    value : string;
    checked : boolean;
    onChange : ( e : React.ChangeEvent ) => void;
}

const CheckboxElement = ({ 
    value,
    checked,
    onChange,
    ...rest 
}: SelectableElementProps) => 
    <Input 
        type="checkbox" 
        value={value} 
        checked={checked}
        onChange={onChange}
        { ...rest }
    />

const RadioElement = ({ 
    value,
    checked,
    onChange,
    ...rest 
}: SelectableElementProps) => 
    <Input 
        type="radio" 
        value={value} 
        checked={checked}
        onChange={onChange}
        { ...rest }
    />


type ElementGroupProps = {
    id : string;
    current_value : string | Array<string>;
    heading : string;
    items : Array<SurveyComponentItem>;
    forwardedRef : SurveyComponentRefObject;
    onUpdate : ( e : React.ChangeEvent ) => void;
    focusHandler : ( e : React.FocusEvent ) => void;
    type : string;
}

const ElementGroup = ({
    id, 
    current_value, 
    heading, 
    type, 
    items, 
    onUpdate, 
    focusHandler, 
    forwardedRef, 
    ...rest 
}: ElementGroupProps): JSX.Element => {
    const Element = ( type === "radio" ) ? RadioElement : 
                    ( type === "checkbox" ) ? CheckboxElement : null;

    return (
        <InputContainer 
            key={id}
            tabIndex={0} 
            ref={forwardedRef.current[id]} 
            onFocus={focusHandler}
        >
            <InputContainerHeading>{heading}</InputContainerHeading>
            { items.map( 
                (item, index) =>
                    <InputGroupElementContainer key={`${id}-${index}`} >
                        <Label>
                            <Element 
                                value={item.value}
                                checked={isArray(current_value) ? current_value.includes(item.value) : item.value === current_value}
                                onChange={onUpdate}
                                {...rest}
                            />
                            {item.label}
                        </Label>
                    </InputGroupElementContainer> 
                )
            }
        </InputContainer>
    )
}

export {
    ElementGroup,
    InputElement
}
