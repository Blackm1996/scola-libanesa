import axios from 'axios';

export async function addTeacher(values) {
  const response = await axios.post('/instructor', values);
  return response;
}

export async function addScore() {
  
}