type MultipleChoiceQuestionDatabaseType = {
  multiple_choice_question_data_id: number;
  possible_answer_one: string;
  possible_answer_two: string;
  possible_answer_three: string;
  possible_answer_four: string;
  question_text: string;
  correct_answer: number;
};

export const multipleChoiceDataRefactorer = (
  retrievedData: MultipleChoiceQuestionDatabaseType[]
) => {
  console.log(retrievedData);
  return retrievedData.map((dataEntry, index) => {
    return {
      possibleAnswers: [
        dataEntry.possible_answer_one,
        dataEntry.possible_answer_two,
        dataEntry.possible_answer_three,
        dataEntry.possible_answer_four,
      ],
      questionType: "multiple choice",
      question: dataEntry.question_text,
      correctAnswerIndex:
        dataEntry.correct_answer > 4 ? 0 : +dataEntry.correct_answer,
      id: `multiple-choice-question-${index}`,
    };
  });
};
