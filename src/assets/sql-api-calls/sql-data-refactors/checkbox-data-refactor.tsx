type CheckBoxDataType = {
  question: string;
  possible_answer_one: string;
  possible_answer_two: string;
  possible_answer_three: string;
  possible_answer_four: string;
  possible_answer_five: string;
  possible_answer_one_correct: boolean;
  possible_answer_two_correct: boolean;
  possible_answer_three_correct: boolean;
  possible_answer_four_correct: boolean;
  possible_answer_five_correct: boolean;
};

export const checkboxDataRefactor = (retrievedData: CheckBoxDataType[]) => {
  return retrievedData.map((dataEntry, index: number) => {
    const correctAnswerArray = [
      dataEntry.possible_answer_one_correct,
      dataEntry.possible_answer_two_correct,
      dataEntry.possible_answer_three_correct,
      dataEntry.possible_answer_four_correct,
      dataEntry.possible_answer_five_correct,
    ];

    const possibleAnswersArray = [
      dataEntry.possible_answer_one,
      dataEntry.possible_answer_two,
      dataEntry.possible_answer_three,
      dataEntry.possible_answer_four,
      dataEntry.possible_answer_five,
    ];
    return {
      questionText: dataEntry.question,
      possibleAnswersArray: possibleAnswersArray,
      answerKeyArray: correctAnswerArray,
      questionType: "checkbox",
      id: `checkbox-question-${index}`,
    };
  });
};
