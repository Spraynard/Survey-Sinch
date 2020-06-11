import React from "react";
import SurveySinch } from "./SurveySinch";
import example from "../example/example_survey.json";
import styled, { createGlobalStyle } from "styled-components";

/**
 * Component used during development to display the surveyor component.
 */

const GlobalStyles = createGlobalStyle`
html, body {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin: 0;
}

#root {
    height: 100%;
    width: 100%;
}
`

const AppWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`

export const App = () => {
    return (
        <AppWrapper>
            <GlobalStyles/>
            <SurveySinch survey_data={example}/>
        </AppWrapper>
    )
}