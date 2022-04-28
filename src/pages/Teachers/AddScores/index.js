import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import "./style.module.css";
import { connect } from "react-redux";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import { withRouter } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import swal from "sweetalert";

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
const AddScores = (props) => {
  const [scores, setScores] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageLanguage, setPageLanguage] = useState(props.language);

  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const { name, studentId, score, send, warning, success, sendMessage } =
    langKeywords[pageLanguage];

  //var params = useParams();
  var params = props.location.state;

  useEffect(() => {
    setMessage(`${params.idSection}/${params.idCourse}`);
    setLoading(true);
    axios
      .get(
        `/scoresStatus/${params.idSection}/${params.idCourse}`
      )
      .then((response) => {
        setScores(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [params.idSection, params.idCourse]);

  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  // on blur event
  const handleInput = (e, studentId, idScoreType) => {
    axios.post(`/score`, {
      id_score_type: idScoreType,
      id_student: studentId,
      id_course: params.idCourse,
      score: e.target.value,
      School_Year: "2021-2022",
      final: "0",
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
      .put(
        `/score/${params.idSection}/${params.idCourse}`
      )
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
              }).then((x) => window.location.reload());
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
    <Box py={20} textAlign="center" sx={{ width: 720, margin: "auto" }}>
      {loading == true ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <table className="mx-auto">
            <thead>
              <tr>
                <td>{studentId}</td>
                <td>{name}</td>
                <td>{score}</td>
              </tr>
            </thead>
            <tbody>
              {scores.map((item, index) => {
                return (
                  <tr>
                    <td>{item.id_student}</td>
                    <td>{`${item.First_Name} ${item.Last_Name}`}</td>
                    <td>
                      <input
                        type="number"
                        className="text-center w-100"
                        placeholder={item.score}
                        value={item.score}
                        onBlur={(e) =>
                          handleInput(e, item.id_student, item.id_score_type)
                        }
                        onChange={(e) => handleInputChange(e, item.id_student)}
                        disabled={item.final === "1" ? "disabled" : ""}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Box
            m={4}
            sx={{ display: "flex", justifyContent: "flex-end", marginRight: 0 }}
          >
            <Button
              variant="contained"
              className={classes.btn}
              disabled={
                scores.length > 0 && scores[0].final === "1" ? "true" : ""
              }
              onClick={submit}
            >
              {send}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(withRouter(AddScores));
