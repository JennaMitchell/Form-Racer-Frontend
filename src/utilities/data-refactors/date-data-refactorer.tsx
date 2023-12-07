type DatabaseEntryType = {
  question_text: string;
  start_date: string;
  end_date: string;
};
export const dateDataRefactorer = (retrievedData: DatabaseEntryType[]) => {
  return retrievedData.map((dataEntry, index) => {
    const fomattedStartDate = new Date(dataEntry.start_date).toLocaleDateString(
      "en-us"
    );

    const formattedEndDate = new Date(dataEntry.end_date).toLocaleDateString(
      "en-us"
    );
    return {
      questionText: dataEntry.question_text,
      startDate: fomattedStartDate,
      endDate: formattedEndDate,
      questionType: "dates",
      id: `date-question-${index}`,
    };
  });
};
