import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from "react-router";

export default function UpdateCoursesTeachers(props) {
  const [allTeachers, setAllTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachersSelection, setTeachersSelection] = useState([]);
  const [addedInstructor, setAddedInstructor] = useState([]);
  const [removedInstructor, setRemovedInstructor] = useState([]);
  
  const params = useParams();
  //custom select style
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
  for (let i = 0; i < allTeachers.length; i++) {
    const { id, First_Name, Last_Name } = allTeachers[i];
    teachersOptions.push({
      id,
      value: id,
      label: `${First_Name} ${Last_Name}`,
    });
  }
  //useEffect
  useEffect(() => {
    axios
      .get(`/classStats/${params.id}`)
      .then((response) => {
        if (response.status === 200) {
          setCourses(response.data.courses);
          setAllTeachers(response.data.teachers[0]);
          setTeachersSelection([...teachersOptions]);
          props.addCoursesAndTeachers(
            response.data.courses,
            response.data.teachers[0]
          );
        }
      });
    // get all teachers
  }, []);

  //update teachers
  const update = (idTeacher, idCourse) => {
    let added = [];
    let removed = [];
    let find1, find2, find3;

    //when we send None
    if (idTeacher.toString().trim() === "") {
      find1 = addedInstructor.some((item) => item.idCourse == idCourse);
      //exist in addedInstructor array
      if (find1) {
        let x = addedInstructor.filter((item) => item.idCourse != idCourse);
        setAddedInstructor([...x]);
      }

      // exists in courses array
      find2 = courses.some(
        (item) => item.id_course == idCourse && item.instructor_id != null
      );
      if (find2) {
        removed = [...removedInstructor];
        let foundIndex = courses.findIndex(
          (item) => item.id_course == idCourse
        );
        let removedObj = {
          idCourse: courses[foundIndex].id_course,
          idInstructor: courses[foundIndex].instructor_id,
        };

        removed = removed.filter((item) => item.idCourse != idCourse);
        removed.push(removedObj);
        setRemovedInstructor([...removed]);
      }
      // exist already in addedInstructor
      find3 = addedInstructor.some(
        (item) => item.idCourse == idCourse && item.idInstructor == idTeacher
      );
      if (find3) {
        removed = [...removedInstructor];
        removed = removed.filter(
          (item) => item.idCourse != idCourse || item.idInstructor != idTeacher
        );
        setRemovedInstructor([...removed]);
      }
    } else {
      added = [...addedInstructor];
      removed = [...removedInstructor];
      //find in courses list
      find1 = courses.some((item) => {
        return item.instructor_id == idTeacher && item.id_course == idCourse;
      });
      find2 = addedInstructor.some((item) => {
        return item.idInstructor == idTeacher && item.idCourse == idCourse;
      });
      find3 = addedInstructor.some((item) => {
        return item.idCourse == idCourse;
      });

      added = added.filter((item) => item.idCourse != idCourse);
      added.push({
        idInstructor: idTeacher,
        idCourse,
      });
      if (find1) {
        removed = removed.filter(
          (item) => item.idCourse != idCourse || item.idInstructor != idTeacher
        );
        setRemovedInstructor([...removed]);
      }
      setAddedInstructor([...added]);
    }
  };
  return (
    <table>
      <tbody>
        {courses.map((item, index) => {
          return (
            <tr>
              <td>{item.course_Name}</td>
              <td>
                <div>
                  <Select
                    styles={{ fontSize: 50 }}
                    placeholder={
                      item.instructor_id !== null
                        ? `${item.course_First_Name} ${item.course_Last_Name}`
                        : "select teachers"
                    }
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
                    onChange={(e) => props.update(e.value, item.id_course)} // e.id => (id teacher) item.id => (id course)
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
