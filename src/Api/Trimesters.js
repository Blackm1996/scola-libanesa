import axios from "axios";

export const addTrim = async (values) => {
  const response = await axios.post(
    "/addTrimster",
    values
  );
  return response;
};
