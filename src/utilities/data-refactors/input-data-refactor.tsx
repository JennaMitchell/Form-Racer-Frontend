type InputDataFromDatabase = {
  input_name: string;
  input_question_data_id: number;
  input_question_data_id_ref: number;
  input_question_props_id: number;
  label: string;
  max_number_of_characters: number;
  min_number_of_characters: number;
  pattern: string;
  placeholder: string;
  question_text: string;
  input_required: number;
  type: string;
};

export const inputDataRefactor = (retrievedData: InputDataFromDatabase[]) => {
  return retrievedData.map((dataEntry, index: number) => {
    return {
      input_question_data_id: dataEntry.input_question_data_id,
      label: dataEntry.label,
      question_text: dataEntry.question_text,
      questionType: "input",
      inputProps: {
        name: dataEntry.input_name,
        type: dataEntry.type,
        placeholder: dataEntry.placeholder,
        pattern: dataEntry.pattern,
        required: dataEntry.input_required === 1 ? true : false,
        min: dataEntry.min_number_of_characters,
        max: dataEntry.max_number_of_characters,
      },
      id: `input-question-${index}`,
    };
  });
};
