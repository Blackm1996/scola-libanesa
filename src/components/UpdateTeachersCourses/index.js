import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function CoursesTeachersSelection(props) {
  const [allTeachers, setAllTeachers] = useState([]);

  const [selectedTeachers, setSelectedTeachers] = useState([]);

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

  //useEffect
  useEffect(() => {
    axios
      .get(`/classInfos/46`)
      .then((response) => {
        if (response.status === 200) {
          setSelectedTeachers(response.data);
        }
      });

    // get all teachers 

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
  }, []);

  return (
    <table>
      div
      <tbody>
        {selectedTeachers.map((item, index) => {
          return (
            <tr>
              <td>{item.Name}</td>
              <td>{`${item.First_Name} ${item.Last_Name}`}</td>
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
                    onChange={(e) => console.log(`e, e.id, item.id`)} // e.id => (id teacher) item.id => (id course)
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
