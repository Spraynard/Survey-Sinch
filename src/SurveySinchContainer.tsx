import React from 'react';
import styled from "styled-components";

const StyledSurveyorContainer = styled.div`
`;

type Props = {
    children : React.ReactNode,
}

const SurveySinchContainer = ({ children }: Props): JSX.Element => {
    return (
        <StyledSurveyorContainer>
            {children}
        </StyledSurveyorContainer>
    )
}

export { SurveySinchContainer }