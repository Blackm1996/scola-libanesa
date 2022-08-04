import React, { useEffect, useState, useMemo } from "react";
import { Box, TableRow } from "@mui/material";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import "./style.module.css";
import { connect } from "react-redux";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../../languages";
// import language words
import {
  ENGLISHWORDS,
  FRENCHWORDS,
  PORTOWORDS,
} from "../../../../Teachers/AddScores/LangKeys";
import { withRouter } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import swal from "sweetalert";
import Select from "react-select";
import { useParams } from "react-router-dom";

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

const useStyles = makeStyles({
  btn: {
    backgroundColor: "#ffffff",
    boxShadow: "none",
    color: "#ee664e",
    border: "1px solid #ee664e",

    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#ee664e",
      border: "1px solid transparent",
      color: "#fff",
    },
  },
});

//TableRow Component
const Row = (props) => {
  const {
    id,
    name,
    score,
    maxScore,
    scoreType,
    handleInput,
    handleInputChange,
  } = props.obj;

  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(score);
  }, []);
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>
        <input
          type="number"
          className="text-center w-100"
          placeholder={score}
          value={value}
          min="0"
          max={maxScore}
          onBlur={(e) => handleInput(e, id, scoreType)}
          onChange={(e) => {
            if (Number(e.target.value) <= Number(maxScore)) {
              setValue(e.target.value);
              handleInputChange(e, id);
            }
          }}
        />
      </td>
    </tr>
  );
};
const AddScores = (props) => {
  const [scores, setScores] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [courses, setCourses] = useState([]);
  const [idCourse, setIdCourse] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [maxScore, setMaxScore] = useState(0);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });

  //lang keys
  const {
    name,
    studentId,
    score,
    send,
    warning,
    success,
    sendMessage,
    selectCourse,
  } = langKeywords[pageLanguage];

  //var params = useParams();
  var params = useParams();
  var gradesOptions = useMemo(() => {
    let coursesOptions = [];
    coursesOptions.push({
      value: "",
      label: "select course",
      isDisabled: true,
    });
    let coursesOptions2 = courses.map((course) => {
      return {
        value: course.id,
        label: course.Name,
      };
    });

    coursesOptions = [...coursesOptions, ...coursesOptions2];
    return coursesOptions;
  }, [courses]);

  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);

  useEffect(() => {
    axios
      .get(
        `/sectionCourses/${params.id}`
      )
      .then((response) => {
        const { currentSemester, semesterType } = response.data;
        setCourses(response.data.courses);
        setSemesterName(`Semester ${currentSemester} / ${semesterType}`);
      });
  }, []);

  useEffect(() => {
    setCourses([]);
    setLoading(true);
    setIdCourse("");
    axios
      .get(
        `/sectionCourses/${params.id}`
      )
      .then((response) => {
        setLoading(false);
        setScores([]);
        setMaxScore(0);
        setIdCourse("");
        setCourses(response.data.courses);
        const { currentSemester, semesterType } = response.data;
        setSemesterName(`Semester ${currentSemester} / ${semesterType}`);
      });
  }, [props.updatePagesProps]);

  const handleSelect = (event) => {
    const idSection = params.id;
    const idCourse = event.value;
    setLoading(true);
    setMessage(`${idSection}/${idCourse}`);
    setLoading(true);

    axios
      .get(
        `/scoresStatus/${idSection}/${idCourse}`
      )
      .then((response) => {
        setScores(response.data);
        setLoading(false);
        setIdCourse(idCourse);
        if (scores.length > 0) setMaxScore(scores[0].maxScore);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  // on blur event
  const handleInput = (e, studentId, idScoreType) => {
    
    axios.post(`/privelegeScore`, {
      id_score_type: idScoreType,
      id_student: studentId,
      id_course: idCourse,
      //id_course: 243,
      score: e.target.value,
      School_Year: props.year,
      final: "1",
    });
  };

  const handleInputChange = (e, studentId) => {
    let newScores = scores.map((item) => {
      if (studentId === item.id_student) {
        return {
          ...item,
          score: e.target.value,
        };
      }
      return item;
    });
    setScores([...newScores]);
  };

  const submit = () => {
    axios
      .put(`/score/${params.id}/${idCourse}`)
      .then((response) => {
        if (response.status == 200) {
          swal({
            title: sendMessage,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willAdd) => {
            if (willAdd)
              swal(success, {
                icon: "success",
              });
            //.then((x) => window.location.reload());
          });
        }
      })
      .catch((error) => {
        swal(warning, {
          icon: "warning",
        });
      });
  };
  const classes = useStyles();

  return (
    <Box textAlign="center" sx={{ width: 720, margin: "auto" }}>
      <div style={{ width: 219, margin: "30px auto" }}>
        {/* start semester name */}
        <h5 style={{ color: "var(--main-color-1)" }}>{semesterName}</h5>
        {/* end semester name */}
        <Select
          value={gradesOptions.filter((option) => option.value == idCourse)}
          style={{ fontSize: 0 }}
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
      {loading == true ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          {scores.length > 0 && (
            <>
              <table className="mx-auto">
                <thead>
                  <tr>
                    <td>{studentId}</td>
                    <td>{name}</td>
                    <td>{`score ( ${scores[0].maxScore} )`}</td>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((item, index) => {
                    return (
                      <>
                        <Row
                          obj={{
                            id: item.id_student,
                            name: `${item.First_Name} ${item.Last_Name}`,
                            score: item.score,
                            scoreType: item.id_score_type,
                            maxScore: item.maxScore,
                            handleInput: handleInput,
                            handleInputChange: handleInputChange,
                          }}
                        />
                      </>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
    year: state.schoolYear
  };
};

export default connect(mapStateToProps)(withRouter(AddScores));
