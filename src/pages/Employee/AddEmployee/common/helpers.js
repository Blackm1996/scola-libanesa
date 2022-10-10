export const getDays = () => {
  var days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i);
  }
  return days;
};

export const getYears = () => {
  //Years
  var years = [];
  let ye = new Date().getFullYear();
  for (let i = 0; i <= 25; i++) {
    years.push(ye - i);
  }
  return years;
};

export const months = [
  { name: "Jan", value: "1" },
  { name: "Feb", value: "2" },
  { name: "Mar", value: "3" },
  { name: "Apr", value: "4" },
  { name: "May", value: "5" },
  { name: "June", value: "6" },
  { name: "July", value: "7" },
  { name: "Aug", value: "8" },
  { name: "Sept", value: "9" },
  { name: "Oct", value: "10" },
  { name: "Nov", value: "11" },
  { name: "Dec", value: "12" },
];
