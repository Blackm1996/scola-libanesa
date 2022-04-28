import axios from "axios";

// get student file year by id
export async function getStudentFileYear(id_student, inscriptionYear) {
  const response = await axios.get(
    `/studentFileYear/${id_student}/${inscriptionYear}`
  );
  return response;
}

//add student year file
export async function addStudentYearFile(values) {
  const response = await axios.post("/studentFileYear", values);
  return response;
}

//update student year file
export async function updateStudentYearFile(id, values) {}

//delete stydent year file
export async function deleteStudentYearFile(id) {}

// get years iscripted by student
export async function getYears(studentId) {
  const response = axios.get("/billsYear/" + studentId);
  return response;
}
