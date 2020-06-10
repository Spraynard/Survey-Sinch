import React from 'react';
import styled from "styled-components";

type Props = {
    children : React.ReactNode;
    show_frame : boolean;
}

const Frame = styled.div`
    display: ${ props => props.show_frame ? "block" : "none" }
`;

const SurveyorFrame = ({ children, show_frame } : Props) => <Frame show_frame={show_frame}>{children}</Frame>

export { SurveyorFrame };