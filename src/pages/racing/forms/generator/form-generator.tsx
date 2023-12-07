import GeneratedInput from "./components/inputs/generated-input";
import GeneratedMultipleChoice from "./components/multiple-choice/generated-multiple-choice";
import GeneratedDate from "./components/dates/generated-dates";
import GeneratedColorInput from "./components/color/generated-color-input";
import GeneratedCheckboxQuestion from "./components/checkbox/generated-checkbox-question";
import GeneratedRangeInput from "./components/ranges/generated-ranges";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../store/typescript-hooks";

import { formStoreActions } from "../../../../store/form-store";

import { inputDataRefactor } from "../../../../assets/sql-api-calls/sql-data-refactors/input-data-refactor";
import { multipleChoiceDataRefactorer } from "../../../../assets/sql-api-calls/sql-data-refactors/multiple-choice-data-refactor";
import { getMongoDBQuestionDataWithLimit } from "../../../../utilities/mongo-db-requests/questions/questions-api-functions";
import { dateDataRefactorer } from "../../../../assets/sql-api-calls/sql-data-refactors/date-data-refactorer";
import { colorDataRefactor } from "../../../../assets/sql-api-calls/sql-data-refactors/color-data-refactor";
import { checkboxDataRefactor } from "../../../../assets/sql-api-calls/sql-data-refactors/checkbox-data-refactor";
import { randomNumberGeneratorWithNumberOfQuestionRemaining } from "../../../../components/random-number-generator/random-number-generator";
import { sliderDataRefactorer } from "../../../../assets/sql-api-calls/sql-data-refactors/slider-data-refactorer";
import { useEffect } from "react";
import { updateActiveQuestionNumber } from "./components/shared-components-functions";
import { acceptedMongoDBAPICallObject } from "../../../../assets/constants/constants";

const FormGeneratorMainPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const userGameSettings = useAppSelector(
    (state) => state.userInfo.gameSettings
  );
  const generatedQuestionData = useAppSelector(
    (state) => state.formRacing.generatedQuestionData
  );

  const activeQuestionNumber = useAppSelector(
    (state) => state.formRacing.activeQuestionNumber
  );
  const endOfTestReached = useAppSelector(
    (state) => state.formRacing.endOfTestReached
  );
  const astroidDestroyed = useAppSelector(
    (state) => state.formRacing.astroidDestroyed
  );
  const astroidExplosionTriggered = useAppSelector(
    (state) => state.formRacing.astroidExplosionTriggered
  );
  const startTest = useAppSelector((state) => state.formRacing.startTest);

  const testStarted = useAppSelector((state) => state.formRacing.testStarted);

  useEffect(() => {
    if (astroidDestroyed && astroidExplosionTriggered) {
      updateActiveQuestionNumber(
        dispatch,
        activeQuestionNumber,
        generatedQuestionData.length
      );
      dispatch(formStoreActions.setAstroidDestroyed(false));

      dispatch(formStoreActions.setAstroidExplosionTriggered(false));
      dispatch(formStoreActions.setFireShipWeapons(false));
    }
  }, [
    astroidDestroyed,
    dispatch,
    activeQuestionNumber,
    generatedQuestionData,
    astroidExplosionTriggered,
  ]);

  // Use Effect to Generate New Data

  useEffect(() => {
    if (startTest && !testStarted) {
      const generateGameData = async () => {
        const generatedNumberOfQuestionsPerType =
          numberOfQuestionsPerTypeGenerator(
            userGameSettings.numberOfQuestions,
            userGameSettings.selectedQuestionTypes
          );

        const generatedDataArray = await questionDataRetriever(
          generatedNumberOfQuestionsPerType,
          userGameSettings.selectedQuestionTypes
        );

        // there is a max of ten questions pet type so this accounts for when

        if (
          userGameSettings.numberOfQuestions === 20 &&
          userGameSettings.selectedQuestionTypes.length === 1
        ) {
          const copyOfGeneratedDataArray = JSON.parse(
            JSON.stringify(generatedDataArray)
          );
          const numberOfQuestionsToAdd =
            userGameSettings.numberOfQuestions - generatedDataArray.length;

          for (
            let indexOfCopy = 0;
            indexOfCopy < numberOfQuestionsToAdd;
            indexOfCopy++
          ) {
            generatedDataArray.push(copyOfGeneratedDataArray[indexOfCopy]);
          }
        }
        const userAnswerArray = generatedDataArray.map(() => {
          return "";
        });
        dispatch(formStoreActions.setGeneratedQuestionData(generatedDataArray));
        dispatch(formStoreActions.setUserAnswersArray(userAnswerArray));
        dispatch(formStoreActions.setResetTestTimer(true));
        dispatch(formStoreActions.setTestStarted(true));
        dispatch(formStoreActions.setStartTest(false));
      };
      const numberOfQuestionsPerTypeGenerator = (
        numberOfQuestions: number,
        questionTypeArray: string[]
      ) => {
        let numberOfQuestionsRemaining = numberOfQuestions;

        const numberOfQuestionsPerQuestionArray = [];
        for (
          let indexOfSelectedQuestionTypes = 0;
          indexOfSelectedQuestionTypes < questionTypeArray.length;
          indexOfSelectedQuestionTypes++
        ) {
          if (indexOfSelectedQuestionTypes === questionTypeArray.length - 1) {
            numberOfQuestionsPerQuestionArray.push(numberOfQuestionsRemaining);
          } else {
            const randomlyGeneratedNumber =
              randomNumberGeneratorWithNumberOfQuestionRemaining(
                numberOfQuestionsRemaining
              );
            numberOfQuestionsRemaining =
              numberOfQuestionsRemaining - randomlyGeneratedNumber;
            numberOfQuestionsPerQuestionArray.push(randomlyGeneratedNumber);
          }
        }
        return numberOfQuestionsPerQuestionArray;
      };

      const getQuestionDataWithLimit = async (
        database: string,
        numberOfQuestions: number
      ) => {
        /// 1
        console.log(database);
        console.log(numberOfQuestions);
        const retrievedData = await getMongoDBQuestionDataWithLimit(
          `${database}-${numberOfQuestions}`
        );

        return retrievedData.retrievedData;
      };

      const questionDataRetriever = async (
        arrayOfQuestionNumbers: number[],
        arrayOfQuestionTypes: string[]
      ) => {
        let generatedDataArray: any[] = [];

        for (
          let indexOfArrayQuestionNumbers = 0;
          indexOfArrayQuestionNumbers < arrayOfQuestionNumbers.length;
          indexOfArrayQuestionNumbers++
        ) {
          const questionType =
            arrayOfQuestionTypes[indexOfArrayQuestionNumbers];

          switch (questionType) {
            case "multiple choice":
              console.log(arrayOfQuestionNumbers[indexOfArrayQuestionNumbers]);
              const retrievedData = await getQuestionDataWithLimit(
                acceptedMongoDBAPICallObject.multipleChoice.databaseName,
                arrayOfQuestionNumbers[indexOfArrayQuestionNumbers]
              );

              const renderReadyInputData =
                multipleChoiceDataRefactorer(retrievedData);

              generatedDataArray =
                generatedDataArray.concat(renderReadyInputData);

              break;
            case "dates":
              const retrievedDatesData = await getQuestionDataWithLimit(
                acceptedMongoDBAPICallObject.date.databaseName,
                arrayOfQuestionNumbers[indexOfArrayQuestionNumbers]
              );
              const renderReadyDateData =
                dateDataRefactorer(retrievedDatesData);

              generatedDataArray =
                generatedDataArray.concat(renderReadyDateData);
              break;
            case "inputs":
              const retrievedInputData = await getQuestionDataWithLimit(
                acceptedMongoDBAPICallObject.input.databaseName,
                arrayOfQuestionNumbers[indexOfArrayQuestionNumbers]
              );

              const renderReadyInputsData =
                inputDataRefactor(retrievedInputData);

              generatedDataArray = generatedDataArray.concat(
                renderReadyInputsData
              );
              break;
            case "color":
              const retrievedColorData = await getQuestionDataWithLimit(
                acceptedMongoDBAPICallObject.color.databaseName,
                arrayOfQuestionNumbers[indexOfArrayQuestionNumbers]
              );
              const renderReadyRetrievedColorData =
                colorDataRefactor(retrievedColorData);

              generatedDataArray = generatedDataArray.concat(
                renderReadyRetrievedColorData
              );
              break;

            case "checkbox":
              const checkBoxData = await getQuestionDataWithLimit(
                acceptedMongoDBAPICallObject.checkbox.databaseName,
                arrayOfQuestionNumbers[indexOfArrayQuestionNumbers]
              );
              const renderReadyCheckboxData =
                checkboxDataRefactor(checkBoxData);

              generatedDataArray = generatedDataArray.concat(
                renderReadyCheckboxData
              );

              break;

            case "slider":
              const retrievedSliderData = await getQuestionDataWithLimit(
                acceptedMongoDBAPICallObject.slider.databaseName,
                arrayOfQuestionNumbers[indexOfArrayQuestionNumbers]
              );
              const renderReadySliderData =
                sliderDataRefactorer(retrievedSliderData);

              generatedDataArray = generatedDataArray.concat(
                renderReadySliderData
              );
              break;
            default:
              break;
          }
        }

        return generatedDataArray;
      };
      generateGameData();
    }
  }, [
    dispatch,
    testStarted,
    userGameSettings.difficulty,
    userGameSettings.numberOfQuestions,
    userGameSettings.selectedQuestionTypes,
    startTest,
  ]);

  return (
    <>
      {!endOfTestReached && (
        <>
          {generatedQuestionData.length !== 0 &&
            generatedQuestionData[activeQuestionNumber - 1].questionType ===
              "input" && (
              <GeneratedInput
                label={generatedQuestionData[activeQuestionNumber - 1].label}
                id={generatedQuestionData[activeQuestionNumber - 1].id}
                inputProps={
                  generatedQuestionData[activeQuestionNumber - 1].inputProps
                }
                key={`input-question-${activeQuestionNumber - 1}-top-component`}
                questionNumber={activeQuestionNumber}
                questionText={
                  generatedQuestionData[activeQuestionNumber - 1].question_text
                }
                totalNumberOfQuestions={generatedQuestionData.length}
              />
            )}
          {generatedQuestionData.length !== 0 &&
            generatedQuestionData[activeQuestionNumber - 1].questionType ===
              "multiple choice" && (
              <GeneratedMultipleChoice
                possibleAnswersArray={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .possibleAnswers
                }
                questionNumber={activeQuestionNumber}
                totalNumberOfQuestions={generatedQuestionData.length}
                questionId={generatedQuestionData[activeQuestionNumber - 1].id}
                correctAnswerIndex={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .correctAnswerIndex
                }
                questionText={
                  generatedQuestionData[activeQuestionNumber - 1].question
                }
              />
            )}
          {generatedQuestionData.length !== 0 &&
            generatedQuestionData[activeQuestionNumber - 1].questionType ===
              "dates" && (
              <GeneratedDate
                questionId={generatedQuestionData[activeQuestionNumber - 1].id}
                questionNumber={activeQuestionNumber}
                dateQuestion={
                  generatedQuestionData[activeQuestionNumber - 1].questionText
                }
                totalNumberOfQuestions={generatedQuestionData.length}
                startDate={
                  generatedQuestionData[activeQuestionNumber - 1].startDate
                }
                endDate={
                  generatedQuestionData[activeQuestionNumber - 1].endDate
                }
              />
            )}
          {generatedQuestionData.length !== 0 &&
            generatedQuestionData[activeQuestionNumber - 1].questionType ===
              "color" && (
              <GeneratedColorInput
                totalNumberOfQuestions={generatedQuestionData.length}
                circleColorOneHexCode={
                  generatedQuestionData[activeQuestionNumber - 1].firstColor
                }
                circleColorTwoHexCode={
                  generatedQuestionData[activeQuestionNumber - 1].secondColor
                }
                resultColorLowerEnd={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .resultRangeStartColor
                }
                resultColorHigherEnd={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .resultRangeEndColor
                }
                questionNumber={activeQuestionNumber}
                questionId={generatedQuestionData[activeQuestionNumber - 1].id}
              />
            )}
          {generatedQuestionData.length !== 0 &&
            generatedQuestionData[activeQuestionNumber - 1].questionType ===
              "checkbox" && (
              <GeneratedCheckboxQuestion
                questionNumber={activeQuestionNumber}
                questionText={
                  generatedQuestionData[activeQuestionNumber - 1].questionText
                }
                possibleAnswersArray={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .possibleAnswersArray
                }
                totalNumberOfQuestions={generatedQuestionData.length}
                correctCheckBoxOptions={
                  generatedQuestionData[activeQuestionNumber - 1].answerKeyArray
                }
                questionId={generatedQuestionData[activeQuestionNumber - 1].id}
              />
            )}
          {generatedQuestionData.length !== 0 &&
            generatedQuestionData[activeQuestionNumber - 1].questionType ===
              "slider" && (
              <GeneratedRangeInput
                questionNumber={activeQuestionNumber}
                questionText={
                  generatedQuestionData[activeQuestionNumber - 1].questionText
                }
                slideMin={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .sliderLowerLimit
                }
                slideMax={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .sliderHigherLimit
                }
                totalNumberOfQuestions={generatedQuestionData.length}
                questionId={generatedQuestionData[activeQuestionNumber - 1].id}
                questionTextMinValue={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .sliderQuestionLowerLimit
                }
                questionTextMaxValue={
                  generatedQuestionData[activeQuestionNumber - 1]
                    .sliderQuestionHigherLimit
                }
              />
            )}
        </>
      )}
    </>
  );
};
export default FormGeneratorMainPage;
