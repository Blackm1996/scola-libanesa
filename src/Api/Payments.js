import axios from "axios";

//add payment
export async function addPayment(values) {
    const response = await axios.post('/bills', values);
    return response;
  
  }

  // get years iscripted by student
  export async function getYears(studentId) {
    const response = axios.get("/billsYear/" + studentId);
    return response;
  }

  // get student details who is paying cost
  export async function getStudent(studentID, yearSelected) {
    const response = axios.get(`/student/${studentID}/${yearSelected}`);
    return response;
  }

  //get bills 
  export async function getBills(studentID, yearSelected) {
    const response = axios.get(`/bills/${studentID}/${yearSelected}`);
    return response;
  }