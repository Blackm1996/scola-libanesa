import React, { useState, useEffect, useMemo } from "react";
import styles from "./style.module.css";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
//import Select from "@mui/material/Select";
import Select from "react-select";
import axios from "axios";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router";

//custom stlyes
const customStyles = {
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
    marginBottom: 7,
  }),
};

const ScoresTable = (props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [semester, setSemester] = React.useState("");
  const [semesters, setSemesters] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [scores, setScores] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const params = useParams();

  // useEffect
  useEffect(() => {
    axios
      .get(`/getSemsters`)
      .then((response) => {
        setSemesters(response.data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    setSemester("");
    setScores([]);
    setCourses([]);
    axios
      .get(`/getSemsters`)
      .then((response) => {
        setSemesters(response.data);
      })
      .catch((error) => {});
  }, [props.updatePagesProps]);

  const handleSelect = (event) => {
    setLoading(true);
    setSemester(event.value);
    axios
      .get(`/semsters${event.value}`)
      .then((response) => {
        setLoading(false);
        setScores(response.data.scores);
        setCourses(response.data.courses);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  var gradesOptions = [];
  gradesOptions.push({
    value: ``,
    label: `select semester`,
    isDisabled: true,
  });
  // for (var i = 1; i <= 1; i++) {
  //   gradesOptions.push({
  //     value: `/2021-2022/${params.id}/${i}/1⁰P`,
  //     label: `trimester ${i} - 1⁰P`,
  //   });
  //   gradesOptions.push({
  //     value: `/2021-2022/${params.id}/${i}/2⁰P`,
  //     label: `trimester ${i} - 2⁰P`,
  //   });
  // }
  for (let semester of semesters) {
    gradesOptions.push({
      value: `/${props.schoolYear}/${params.id}/${semester.semester}/${semester.Name}`,
      label: `trimester ${semester.semester} - ${semester.Name}`,
    });
  }

  return (
    <div>
      <div style={{ width: 219, margin: "30px auto" }}>
        <Select
          style={{ fontSize: 0 }}
          value={gradesOptions.filter((option) => option.value === semester)}
          placeholder=""
          options={gradesOptions}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "hotpink",
              primary: "#ff634766",
            },
          })}
          onChange={handleSelect}
        />
      </div>
      {/* end select section*/}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {loading === false && courses.length > 0 && scores.length > 0 ? (
        <table className={` ${styles.studentsScores} mx-auto`}>
          <thead>
            <tr>
              <td></td>
              {courses.map((item) => {
                return <td>{item}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {scores.map((item) => {
              return (
                <tr>
                  <td>{`${item.First_Name} ${item.Last_Name}`}</td>
                  {item.values.map((item) => {
                    return <td>{item === "null" ? "" : item}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !loading &&
        semester !== "" && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            No courses or No students
          </Box>
        )
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    schoolYear: state.schoolYear,
  };
};

export default connect(mapStateToProps)(withRouter(ScoresTable));
