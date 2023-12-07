/// Getting all Data
export const getAllMongoDBQuestionFromSelectedDatabase = async (
  selectedDatabase: string,
  dispatch: any
) => {
  try {
    const fetchedResponse = await fetch(
      `${process.env.REACT_APP_DATABASE_URL}/questions/get-all-selected-question-data/${selectedDatabase}`,
      {
        method: "GET",
      }
    );

    const jsonedResponse = await fetchedResponse.json();
    return jsonedResponse;
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    throw new Error(`${message}`);
  }
};

// Get Data With Limit

export const getMongoDBQuestionDataWithLimit = async (
  databaseLimitPair: string
) => {
  try {
    const fetchedResponse = await fetch(
      `${process.env.REACT_APP_DATABASE_URL}/questions/get-all-selected-question-data-with-limit/${databaseLimitPair}`,
      {
        method: "GET",
      }
    );

    const jsonedResponse = await fetchedResponse.json();
    if (+jsonedResponse.status !== 201) {
      throw new Error(`${jsonedResponse.error[0].error}`);
    }
    return jsonedResponse;
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    throw new Error(`${message}`);
  }
};
