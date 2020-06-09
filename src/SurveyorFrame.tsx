import React from 'react';

type Props = {
    children : React.ReactNode;
    display : boolean;
}

const SurveyorFrame = ({ children, display } : Props) => 
    (display) ? <div className="surveyor-frame">{children}</div> : null;

export { SurveyorFrame }