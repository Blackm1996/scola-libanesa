import axios from "axios";

//add grade
export async function addGrade(values) {
  const json = JSON.stringify({
    name: values.gradeName,
    def_inscription_tax: values.defInscriptionTax,
    def_monthly_pay: values.defMonthlyPay,
    def_uniform_cost: values.defUniformCost,
    def_books_cost: values.defBooksCost,
    books: values.books,
    courses: values.courses,
  });

  //send post
  axios.post("http://localhost:8000/api/addgrade", json, {
    headers: {
      // Overwrite Axios's automatically set Content-Type
      "Content-Type": "application/json",
    },
  });
  return Response;
}

//update books
export async function updateBooks(values) {
  //send post
  axios.put("/book/74", values);
  return Response;
}

export async function getBooks(gradeId) {
  //console.log(values);

  const response = axios.get("/book/" + gradeId);
  return response;
}
