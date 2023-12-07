export type checkboxQuestionType = {
  question: string;
  possible_answer_one: string;
  possible_answer_two: string;
  possible_answer_three: string;
  possible_answer_four: string;
  possible_answer_five: string;
  possible_correct_answer_one: Boolean;
  possible_correct_answer_two: Boolean;
  possible_correct_answer_three: Boolean;
  possible_correct_answer_four: Boolean;
  possible_correct_answer_five: Boolean;
};

export type colorQuestionType = {
  firstColor: string;
  secondColor: string;
};

export type dateQuestionType = {
  question_text: string;
  start_date: string;
  end_date: string;
};

export type inputQuestionType = {
  label: string;
  question_text: string;
  input_name: string;
  type: string;
  placeholder: string;
  pattern: string;
  input_required: Boolean;
  min_number_of_characters: Number;
  max_number_of_characters: Number;
};

export type multipleChoiceQuestionType = {
  question_text: string;
  possible_answer_one: string;
  possible_answer_two: string;
  possible_answer_three: string;
  possible_answer_four: string;
  correct_answer: string;
};

export type sliderQuestionType = {
  question_text: string;
  slider_lower_limit: Number;
  slider_higher_limit: Number;
  slider_question_lower_limit: Number;
  slider_question_higher_limit: number;
};
