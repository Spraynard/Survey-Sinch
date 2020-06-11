import SurveySinchSurvey, SurveyComponent, SurveyComponentState, SurveyComponentGroup } from "./types";
import { isArray } from "util";
import { v4 as uuid_generator } from "uuid";

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
function makeSurveyComponentState(id: string, value: string): SurveyComponentState {
    return {
        [id]: {
            value,
            touched: false,
        }
    }
}

async function transformComponentGroup(item: SurveyComponentGroup): Promise<[SurveyComponentState, SurveyComponentGroup]> {

    let state_object = {}

    const transformGroup = (item) => {
        return item.map((survey_component) => {
            if (isArray(survey_component)) {
                transformComponentGroup(survey_component)
            }

            const id = uuid_generator();

            state_object = { ...state_object, ...makeSurveyComponentState(id, "") }
            return { id, ...survey_component }
        })
    }

    const transformed_group = await transformGroup(item);

    return [state_object, transformed_group];
}

/**
 * Global survey item "onUpdate" handler. Provides a general method of taking
 * the value of the item that has been interacted with and saving it within
 * state.
 * 
 * @param surveyState Survey State Object Getter Hook
 * @param setSurveyState Survey State Object Setter Hook
 */
function onSurveyorElementUpdate(
    surveyState: SurveyComponentState,
    setSurveyState: React.Dispatch<React.SetStateAction<SurveyComponentState>>
) {
    return (id: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        return setSurveyState({
            ...surveyState,
            [id]: {
                ...surveyState[id],
                value: event.target.value
            }
        })
    }
}

/**
 * Global survey item "onFocus" event handler. Handles side effects of focusing
 * for all elements that are created.
 * 
 * @param surveyState Surrvey state object getter hook
 * @param setSurveyState Survey state object setter hook
 * @param setCurrentQuestionID Setter Hook for the current question id
 */
function onSurveyorElementFocus(
    surveyState: SurveyComponentState,
    setSurveyState: React.Dispatch<React.SetStateAction<SurveyComponentState>>,
    setCurrentQuestionID: React.Dispatch<React.SetStateAction<string>>
) {
    return (id: string) => (): void => {
        setCurrentQuestionID(id);

        if (surveyState[id].touched) {
            return;
        }

        return setSurveyState({
            ...surveyState,
            [id]: {
                ...surveyState[id],
                touched: true
            }
        })
    }
}

/**
 * Generates a pair that includes state to use for our generated survey (keyed by a programmatically created id) and
 * survey data transformed to include the programmatically created id.
 * 
 * @param survey_data Initial JSON supplied survey data
 * @param state_object Survey State
 * @param transformed_data Initial JSON supplied survey data that is transformed to include UUIDs
 */
async function generateSurveyorData(survey_data: SurveyorSurvey, state_object = {}, transformed_data = []): Promise<[SurveyComponentState, SurveyorSurvey]> {
    if (!survey_data.length) {
        return [state_object, transformed_data];
    }

    const item: SurveyComponent = first<SurveyComponent>(survey_data),
        rest_items: SurveyorSurvey = rest<SurveyComponent>(survey_data);

    /**
     * If our item is an array, recursively generate another array.
     */
    if (isArray(item)) {
        const [state_from_group, transformed_group_data] = await transformComponentGroup(item);

        return generateSurveyorData(
            rest_items,
            { ...state_object, ...state_from_group },
            [...transformed_data, transformed_group_data]
        )
    }

    const item_id = uuid_generator();

    return generateSurveyorData(
        rest_items,
        { ...state_object, ...makeSurveyComponentState(item_id, "") },
        [...transformed_data, { ...item, id: item_id }]
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
            return (stateValue.touched && stateValue.value !== "")
        });

    return (filteredStateValues.length / rawStateValues.length) * 100;
}

export {
    first,
    rest,
    flatten,
    makeSurveyComponentState,
    generateSurveyorData,
    isSpaceKey,
    calculateSurveyProgress,
    onSurveyorElementFocus,
    onSurveyorElementUpdate
};