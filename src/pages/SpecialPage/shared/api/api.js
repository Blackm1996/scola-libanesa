import axios from "axios";

export const getDataForTesting = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response;
};
