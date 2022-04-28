import axios from "axios";

//add grade
export async function addGrade(values) {}

//update books
export async function updateBooks(values) {}

export async function getBooks(gradeId) {
  const response = axios.get("/getbooks/" + gradeId);
  return response;
}
