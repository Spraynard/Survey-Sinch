import React from 'react';
import styled from "styled-components";

const StyledSurveyorContainer = styled.div`
`;

type Props = {
    children : React.ReactNode,
}

const SurveyorContainer = ({ children }: Props): JSX.Element => {
    return (
        <StyledSurveyorContainer>
            {children}
        </StyledSurveyorContainer>
    )
}

export { SurveyorContainer }