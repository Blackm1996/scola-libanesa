import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import {
  ENGLISHWORDS,
  FRENCHWORDS,
  PORTOWORDS,
} from "../../SchoolYear/langKeys";
import swal from "sweetalert";
import axios from "axios";
import { MenuItem, FormControl, Box, Select } from "@material-ui/core";

function SetNewSemester(props) {
  const [selectSemester, setSelectedSemester] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const {
    semester,
    cancel,
    confirm,
    success,
    errorRefresh,
    progressToNewSemester,
  } = langKeywords[pageLanguage];
  // use effect
  useEffect(() => {
    axios
      .get("/semesterdetails")
      .then((response) => {
        if (response.status == 200) {
          let semester = response.data;
          setSelectedSemester(
            `${semester.semester_number}-${semester.semester_type}`
          );
        }
      })
      .catch((error) => {
        swal(errorRefresh, {
          icon: "error",
        });
      });
    axios
      .get("/getSemsters")
      .then((response) => {
        if (response.status == 200) {
          let semesters = response.data;

          setSemesters(semesters);
        }
      })
      .catch((error) => {
        swal(errorRefresh, {
          icon: "error",
        });
      });
  }, []);
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);

  const handleChange = (event) => {
    let newSemester = event.target.value.split("-");
    swal({
      title: ` ${progressToNewSemester}: (trimester ${newSemester[0]} - ${newSemester[1]} ) ? `,
      icon: "warning",
      buttons: [cancel, confirm],
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        axios
          .post(`/semesterdetails`, {
            semester_number: newSemester[0],
            semester_type: newSemester[1],
          })
          .then((response) => {
            if (response.status == 200) {
              swal(success, {
                icon: "success",
              });
              setSelectedSemester(`${newSemester[0]}-${newSemester[1]}`);
            } else {
              swal(errorRefresh, {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal(errorRefresh, {
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <Box className="d-flex" style={{ marginTop: "30px", marginBottom: "30px" }}>
      <span className="d-flex align-items-end">
        <label>{semester} :</label>
      </span>
      <FormControl
        variant="standard"
        style={{ m: 1, marginLeft: 3, minWidth: 180 }}
      >
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          displayEmpty
          value={selectSemester}
          onChange={handleChange}
          label="Age"
        >
          <MenuItem value="" disabled></MenuItem>
          {/* <MenuItem value="1-1⁰P">trimester 1 - 1⁰P</MenuItem>
          <MenuItem value="1-2⁰P">trimester 1 - 2⁰P</MenuItem> */}
          {semesters.map((semester, index) => (
            <MenuItem value={`${semester.semester}-${semester.Name}`}>
              trimester {`${semester.semester} - ${semester.Name}`}
            </MenuItem>
          ))}
          {/*
          
          <MenuItem value="2-1">trimester 2 - 1°p</MenuItem>
          <MenuItem value="2-2">trimester 2 - 2°p</MenuItem>
          <MenuItem value="3-1">trimester 3 - 1°p</MenuItem>
          <MenuItem value="3-2">trimester 3 - 2°p</MenuItem>
          */}
        </Select>
      </FormControl>
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(SetNewSemester);
