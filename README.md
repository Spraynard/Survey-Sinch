# Survey Sinch

React component that allows you to build a fully featured survey in a short amount of time.

## Installation 

## Testing

Survey Sinch can be tested by running `npm run test`. Tests are located in the `test/` folder.

## Usage

Only the `SurveySinch` component is needed for display. This allows you to place the survey anywhere within your application, as it is just a React component.

Example usage for the component is shown below

```js
import React from "react";
import ReactDOM from "react-dom";

import { SurveySinch } from "survey-sinch";
import survey_data from "./survey_data.json";

ReactDOM.render(
  <SurveySinch survey_data={survey_data}/>,
  document.getElementById("root")
)
```

### SurveySinch Component

Below are the typings for the `SurveySinch` component as well as the typings for those types

```typescript
// SurveySinch.tsx

type Props = {
    survey_data?: SurveySinchSurvey;
    onSubmit?: SurveySinchFormEventHandler;
}
```

So, it just needs two properties:

* `survey_data` - Contains all information about the survey. This is sourced through an actual JavaScript object that can be created and exported in a `.js` file, or you can create and transform a `.json` file to a javascript object.

* `onSubmit` - The event handler that is called when a user fully completes the survey and submits it. Default form behaviour is always prevented. The function that is supplied to this function is considered to be a `SurveySinchFormEventHandler`.

Information on the typing of these two properties is available below.

### SurveySinchFormEventHandler

```typescript
// types.ts

type SurveySinchFormEventHandler = ( e : SurveySinchFormEvent ) => void;

type SurveySinchFormEvent = {
    SyntheticEvent : React.FormEvent
    FormData : SurveySinchReport
}

type SurveySinchReport = Array<SurveySinchReportItem>

type SurveySinchReportItem = {
    question : string,
    answer : string,
}
```
A `SurveySinchFormEventHandler` is an event handler function that takes in a `SurveySinchFormEvent`. This is an object that contains a `SyntheticEvent` property, which is the raw event given from a `React.FormEvent`. It also has the property `FormData`, which is a listing of the questions and answers of each form.

Use this event handler to do whatever you would like with the collected data. Post it to your backend, whatever. We don't care.

### SurveySinchSurvey
```typescript
// types.ts

// Just an Array of SurveyComponents
type SurveySinchSurvey = Array<SurveyComponent>

type SurveyComponent = ISurveyComponent | IChoicedSurveyComponent | SurveyComponentGroup

type SurveyComponentGroup = Array<ISurveyComponent | IChoicedSurveyComponent>
```

```typescript
// interfaces.ts
interface ISurveyComponent {
    id?: string;
    type : string;
    label : string;
}

interface IChoicedSurveyComponent extends ISurveyComponent {
    items : Array<SurveyComponentItem>
}
```

With the typings and interfaces above, you can see that a single `SurveySinchSurvey` is just a collection of `ISurveyComponents`, `IChoicedSurveyComponents`. 

They can also be included with `SurveyComponentGroups`, which themselves are arrays of `ISurveyComponents` or `IChoicedSurveyComponents`.

To view actual examples of usage, you can view the survey examples in the `example/` folder.

## Made With
* React
* Styled Components
* Material UI (Progress Bar)
