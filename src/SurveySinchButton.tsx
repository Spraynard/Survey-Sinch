import React from 'react';
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faFile } from "@fortawesome/free-solid-svg-icons";
import { isSpaceKey } from "./functions";

type Props = {
    type ?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    children : React.ReactNode;
    onClick : () => void;
}

/**
 * Styling the button
 */
const Button = styled.button`
    background: rgb(34, 60, 81);
    border: none;
    border-radius: 5px;
    box-shadow: ${ props => ( props.isClicked || props.disabled ) ? "0 3px 0px #101d28" : "0px 5px 0px #101d28" };
    color: ${ props => ( props.disabled ) ? "black" : "white"};
    cursor: ${ props => props.disabled ? "default" : "pointer" };
    font-size: 1.15em;
    padding: 15px 30px;
    position: relative;
    top : ${ props => ( props.isClicked || props.disabled ) ? "2px" : "0px" };
    text-align: center;
    margin-left: ${ props => props.autoMarginLeft ? "auto" : "0" }
`;

/**
 * Base button 
 * 
 */
const SurveySinchButton = ({ type = "button", children, ...rest } : Props) => {
    const [isClicked, setIsClicked] = React.useState(false);

    return (
        <Button 
            type={type} 
            tabIndex={0} 
            isClicked={isClicked}
            onMouseDown={(e) => setIsClicked(true)}
            onMouseUp={(e) => setIsClicked(false)}
            onTouchStart={(e) => setIsClicked(true)}
            onTouchEnd={(e) => setIsClicked(false)}
            onKeyDown={(e) => { isSpaceKey(e.key) ? setIsClicked(true) : null}}
            onKeyUp={(e) => { isSpaceKey(e.key) ? setIsClicked(false) : null}}
            {...rest}>{children}</Button>
    )
}

const SurveySinchPreviousButton = ( props ) => 
    <SurveySinchButton aria-label="Previous Question" {...props}>
        <FontAwesomeIcon icon={faArrowLeft}/>
    </SurveySinchButton>

const SurveySinchNextButton = ( props ) => 
    <SurveySinchButton aria-label="Next Question" {...props}>
        <FontAwesomeIcon icon={faArrowRight}/>
    </SurveySinchButton>

const SurveySinchSubmitButton = ( props ) => 
    <SurveySinchButton type="submit" aria-label="Submit Survey" autoMarginLeft={true} {...props}>
        <FontAwesomeIcon icon={faFile}/>
    </SurveySinchButton>


export { SurveySinchPreviousButton, SurveySinchNextButton, SurveySinchSubmitButton }