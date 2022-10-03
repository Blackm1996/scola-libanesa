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
import { MenuItem, FormControl, Box, Select, Checkbox, FormControlLabel } from "@mui/material";

function SetNewSemester(props) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [isLast,setIsLast]=useState(false);
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
      .get("/isSemesterLast")
      .then((response)=>{
        if(response.status===200)
        {
            let st=response.data === 'true';
            setIsLast(st);
        }
      })
      .catch((error) => {
        swal(error, {
          icon: "error",
        });
      });
    axios
      .get("/getSemsters")
      .then((response) => {
        if (response.status === 200) {
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

  const onCheckChanged =(value)=>
  {
    let newValue=value.target.checked;
      let data={isLast: newValue? "true":"false"};
      axios
      .post("setSemesterIsLast",data)
      .then((response)=>{
        console.log(response);
        if(response.status ===200)
        {
          setIsLast(newValue);
          swal(success, {
            icon: "success",
          });
        }
        else{
          swal("Error", {
            icon: "error",
          });
        }
      })
      .catch((error) => {
        swal("Error", {
          icon: "error",
        });
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
          value={selectedSemester}
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
      <FormControlLabel 
        style={{marginLeft: 30}}
        control={
            <Checkbox checked={isLast}
              onChange={onCheckChanged}/>
          }
          label="Last?"
          labelPlacement="end"/>
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(SetNewSemester);
