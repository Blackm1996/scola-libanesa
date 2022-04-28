import axios from "axios";

//update books
export async function updateCourses(values) {}

export async function getCourses(gradeId) {
  const response = axios.get(
    "/course/" + gradeId
  );
  return response;
}
