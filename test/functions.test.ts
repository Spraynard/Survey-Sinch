import { first, rest, flatten, generateSurveyorData } from "../src/functions";
import { SurveyorSurvey } from "../src/types";


let test_arr = [ 1, 2, 3, 4 ];

let test_survey: SurveyorSurvey = [
    { label : "Test #1", type : "text" },
    { label : "Test #2", type : "number" },
    [
        {
            "type" : "radio",
            "label" : "Which Superhero is Best",
            "items" : [
                { "label" : "Batman", "value" : "batman" },
                { "label" : "Superman", "value" : "superman" }
            ]
        }
    ]
]

test("Obtains the first element of an array", () => {
    let expected = 1;

    expect(first<number>(test_arr)).toBe(expected);
});

test("Obtains every element except the first element of an array", () => {
    let expected = [2, 3, 4];

    expect(rest<number>(test_arr)).toEqual(expected);
})

test("Flatten works as expected", () => {
    let test_flatten_array = [
        1,
        2,
        [ 
            3, 
            4, 
            [
                5,
                6,
            ]
        ]
    ],
    expected = [1,2,3,4,5,6];

    expect(flatten(test_flatten_array)).toEqual(expected)
})

test("Creates a state object with the correct number of keyed objects for each Survey Component", async () => {

    let [ test_survey_state, transformed_test_survey ] = await generateSurveyorData( test_survey );
    
    expect( Object.keys(test_survey_state).length ).toEqual(3);
});

test("IDs in transformed survey match IDs in state object", async () => {

    let [ test_survey_state, transformed_test_survey ] = await generateSurveyorData( test_survey );
    
    let transformed_survey_ids = flatten(transformed_test_survey).map( item => item.id ),
        survey_state_ids = Object.keys(test_survey_state);

    expect(survey_state_ids).toEqual(transformed_survey_ids);
});

