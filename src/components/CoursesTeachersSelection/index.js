import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function CoursesTeachersSelection(props) {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const addSelectedTeachers = (e, idTeacher, idCourse) => {
    props.addSelectedTeachers(e, idTeacher, idCourse);
    const selected = [...selectedTeachers];
    let find;

    if (e.value.toString().trim() === "") {
      find = selected.some((item) => {
        return item.idCourse === idCourse;
      });
      if (find) {
        let x = selectedTeachers.filter((item) => item.idCourse !== idCourse);
        setSelectedTeachers([...x]);
      }
    } else {
      //setSelectedTeachers([...selectedTeachers, { idTeacher, idCourse }]);
      find = selected.some((item) => {
        return item.idCourse === idCourse;
      });
      if (find) {
        let x = selectedTeachers.map((item) => {
          if (item.idCourse === idCourse)
            return {
              idTeacher,
              idCourse,
            };
          return item;
        });
        setSelectedTeachers([...x]);
        // setSelectedTeachers(
        //   selectedTeachers.filter(function (selected) {
        //     return selected.idCourse === idCourse;
        //   })
        // );
      } else {
        setSelectedTeachers([...selectedTeachers, { idTeacher, idCourse }]);
        // selectedTeachers.filter(function (selected) {
        //   return selected.idCourse !== idCourse;
        // });
      }
    }
  };

  const customStyle = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isDisabled ? "red" : "tomato",
      fontSize: 13,
      color: state.isFocused ? "#fff" : "#958282",
      backgroundColor: state.isFocused ? "tomato" : "transparent",
      cursor: "pointer",
    }),
    singleValue: (provided, state) => {
      const color = state.isDisabled ? "#958282" : "#958282";
      const transition = "opacity 300ms";

      return { ...provided, color, transition };
    },
    control: (base) => ({
      ...base,
      fontSize: 13,
    }),
  };

  var teachersOptions = [
    {
      id: "",
      value: "",
      label: "None",
    },
  ];

  for (let i = 0; i < teachers.length; i++) {
    const { id, First_Name, Last_Name } = teachers[i];
    teachersOptions.push({
      id,
      value: id,
      label: `${First_Name} ${Last_Name}`,
    });
  }
  //useEffect
  useEffect(() => {
    const {gradeId} = props;
    gradeId && axios.get(`/gradeCourses/${gradeId}`).then((response) => {
      if (response.status === 200) {
        setTeachers([...response.data.teachers]);
        setCourses(response.data.courses);
      }
    });
  }, []);
  //useEffect
  useEffect(() => {
    const {gradeId} = props;
    gradeId && axios.get(`/gradeCourses/${gradeId}`).then((response) => {
      if (response.status === 200) {
        setTeachers([...response.data.teachers]);
        setCourses(response.data.courses);
      }
    });
  }, [props.gradeId]);

  return (
    <table>
      <tbody>
        {courses.map((item, index) => {
          return (
            <tr>
              <td>{item.Name}</td>
              <td>
                <div>
                  <Select
                    styles={{ fontSize: 50 }}
                    placeholder="select"
                    options={teachersOptions}
                    styles={customStyle}
                    theme={(theme) => ({
                      ...theme,
                      fontSize: 40,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "hotpink",
                        primary: "#ff634766",
                      },
                    })}
                    onChange={(e) => addSelectedTeachers(e, e.id, item.id)} // e.id => (id teacher) item.id => (id course)
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
