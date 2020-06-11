import React from 'react';
import styled from "styled-components";

type Props = {
    children : React.ReactNode;
    show_frame : boolean;
}

const Frame = styled.div`
    display: ${ props => props.show_frame ? "block" : "none" }
`;

const SurveySinchFrame = ({ children, show_frame } : Props) : JSX.Element => <Frame show_frame={show_frame}>{children}</Frame>

export { SurveySinchFrame };