type RetrievedSliderDataType = {
  question_text: string;
  slider_lower_limit: number;
  slider_higher_limit: number;
  slider_question_higher_limit: number;
  slider_question_lower_limit: number;
};

export const sliderDataRefactorer = (
  retrievedData: RetrievedSliderDataType[]
) => {
  return retrievedData.map((dataType, index) => {
    return {
      questionText: dataType.question_text,
      sliderLowerLimit: dataType.slider_lower_limit,
      sliderHigherLimit: dataType.slider_higher_limit,
      sliderQuestionHigherLimit: dataType.slider_question_higher_limit,
      sliderQuestionLowerLimit: dataType.slider_question_lower_limit,
      questionType: "slider",
      id: `slider-question-${index}`,
    };
  });
};
