export const randomNumberGeneratorWithNumberOfQuestionRemaining = (
  numberOfQuestionsRemaining: number
) => {
  let maxNumberGenerated = 10;

  if (numberOfQuestionsRemaining < 10) {
    maxNumberGenerated = numberOfQuestionsRemaining;
  }

  return Math.floor(Math.random() * maxNumberGenerated);
};
