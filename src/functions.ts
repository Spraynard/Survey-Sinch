import { SurveySinchSurvey, SurveyComponent, SurveyComponentState, SurveyComponentGroup } from "./types";
import { isArray } from "util";
import { v4 as uuid_generator } from "uuid";
import { IChoicedSurveyComponent, ISurveyComponent } from "./interfaces";

/**
 * Given a "Key" string from a synthetic event, be true if it is the space key.
 * @param key_string Synthetic Event "Key" string
 */
function isSpaceKey(key_string: string): boolean {
    return key_string === " ";
}

/**
 * Returns the first item in a list
 * @param items Array of arbitrary items
 */
function first<T>(items: Array<T>): T {
    return items[0];
}

/**
 * Returns all but the first item in a list
 * @param items Array of arbitrary items
 */
function rest<T>(items: Array<T>): Array<T> {
    return items.slice(1);
}

/**
 * Turn a multi-dimensional array into single-dimension
 * @param items Array of items to be flattened.
 */
function flatten<T>(items: Array<T>): Array<T> {
    return items.reduce((acc, curr) => {
        if (!isArray(curr)) {
            return acc.concat(curr);
        }

        return acc.concat(flatten(curr));
    }, [])
}

/**
 * Constructor function for a SurveyComponentState Type
 * @param id UUID String
 * @param value Value for State
 */
function makeSingleValueSurveyComponentState(id: string, value = ""): SurveyComponentState {
    return {
        [id]: {
            value,
            touched: false,
        }
    }
}

/**
 * Constructor function for a SurveyComponentState Type
 * @param id UUID String
 * @param value Value for State
 */
function makeMultiSelectSurveyComponentState(id: string, value: Array<string> = []): SurveyComponentState {
    return {
        [id]: {
            value,
            touched: false,
        }
    }
}

/**
 * Functional wrapper around providing a initial value for our SurveyComponentState
 * @param id ID of component
 * @param surveyComponent Component being referenced
 */
function makeSurveyComponentState(id : string, surveyComponent : ISurveyComponent | IChoicedSurveyComponent) : SurveyComponentState {
    return ( 
        surveyComponent.type === "checkbox" || 
        surveyComponent.type === "multi-select" 
    ) ? makeMultiSelectSurveyComponentState(id)
        :
        makeSingleValueSurveyComponentState(id);
}


async function transformComponentGroup(item: SurveyComponentGroup): Promise<[SurveyComponentState, SurveyComponentGroup]> {

    let state_object = {}

    const transformGroup = (item) => {
        return item.map((survey_component : ISurveyComponent | IChoicedSurveyComponent) => {
            if (isArray(survey_component)) {
                transformComponentGroup(survey_component)
            }

            const id = uuid_generator(),
                /** Create the initial state for the component */
                initialState = makeSurveyComponentState(id, survey_component)

            state_object = { ...state_object, ...initialState }
            return { id, ...survey_component }
        })
    }

    const transformed_group = await transformGroup(item);

    return [state_object, transformed_group];
}

/**
 * Generates a pair that includes state to use for our generated survey (keyed by a programmatically created id) and
 * survey data transformed to include the programmatically created id.
 * 
 * @param survey_data Initial JSON supplied survey data
 * @param state_object Survey State
 * @param transformed_data Initial JSON supplied survey data that is transformed to include UUIDs
 */
async function generateSurveyorData(survey_data: SurveySinchSurvey, state_object = {}, transformed_data = []): Promise<[SurveyComponentState, SurveySinchSurvey]> {
    if (!survey_data.length) {
        return [state_object, transformed_data];
    }

    const item: SurveyComponent = first<SurveyComponent>(survey_data),
        restItems: SurveySinchSurvey = rest<SurveyComponent>(survey_data);

    /**
     * If our item is an array, recursively generate another array.
     */
    if (isArray(item)) {
        const [state_from_group, transformed_group_data] = await transformComponentGroup(item);

        return generateSurveyorData(
            restItems,
            { ...state_object, ...state_from_group },
            [...transformed_data, transformed_group_data]
        )
    }

    const id = uuid_generator(),
        initialState = makeSurveyComponentState(id, item)

    return generateSurveyorData(
        restItems,
        { ...state_object, ...initialState },
        [...transformed_data, { ...item, id: id }]
    );
}

/**
 * Survey Progress is defined as the number of items that have been interacted with and have a value assigned
 * divided by the total amount of items there are in the survey
 * @param { SurveyComponentState } surveyState Current survey state
 * @returns { number } Percentage decimal
 */
function calculateSurveyProgress(surveyState: SurveyComponentState) : number {
    const rawStateValues = Object.values(surveyState),
        filteredStateValues = rawStateValues.filter((stateValue) => {
            if ( isArray(stateValue.value) )
            {
                return stateValue.touched && stateValue.value.length
            }

            return stateValue.touched && stateValue.value !== ""
        });

    return (filteredStateValues.length / rawStateValues.length) * 100;
}

export {
    calculateSurveyProgress,
    first,
    flatten,
    generateSurveyorData,
    isSpaceKey,
    makeSurveyComponentState,
    rest
};