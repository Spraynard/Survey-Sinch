import React from 'react';
import styled from "styled-components";

type Props = {
    children : React.ReactNode;
    showFrame : boolean;
}

const Frame = styled.div`
    display: ${ props => props.showFrame ? "block" : "none" }
`;

const SurveyorFrame = ({ children, showFrame } : Props) => <Frame showFrame={showFrame}>{children}</Frame>

export { SurveyorFrame };