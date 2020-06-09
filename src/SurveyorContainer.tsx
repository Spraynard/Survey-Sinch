import React from 'react';
import styled from "styled-components";

const StyledSurveyorContainer = styled.div`
`;

const SurveyorContainer = ({ children, depth }) => {
    return (
        <StyledSurveyorContainer>
            {children}
        </StyledSurveyorContainer>
    )
}

export { SurveyorContainer }