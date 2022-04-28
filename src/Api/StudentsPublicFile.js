import axios from "axios";

//add student public file
export async function addPublicStudentFile(values) {
 
  const response = await axios.post(
    //"https://escola-elissa.com/laravel-testing/test2/api/student"
    "/student",
    values
  );
  return response;

}

//get student by id
export async function getStudent(studentId) {
  const response = axios.get("/student/" + studentId);
  return response;
}
