import { AxiosResponse } from "axios";
export const apiErrorHandler = (response: AxiosResponse<any, any>) => {
  if (typeof response.data === "object") {
    const keysOfReturnedData = Object.keys(response.data);

    if (keysOfReturnedData.includes("errno")) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
