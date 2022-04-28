import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import axios from "axios";
import { useParams, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./langKeys";
import { ENGLISH, FRENCH, PORTO } from "../../../../../languages";

const Page1 = (props) => {
  const [teachersCourses, setTeachersCourses] = useState([]);
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });

  // lang keys
  // Language KEywords
  const { course, teacher } = langKeywords[pageLanguage];
  const params = useParams();
  //useeffect
  useEffect(() => {
    axios
      .get(`/instructor/${params.id}`)
      .then((response) => {
        setTeachersCourses(response.data);
      })
      .catch((error) => {});
  }, []);

  console.log("teachers courses props", props);
  useEffect(() => {
    console.log("teachersCourses", teachersCourses);
    axios
      .get(`/instructor/${params.id}`)
      .then((response) => {
        //console.log(response.data);
        setTeachersCourses(response.data);
      })
      .catch((error) => {
        console.log("error");
      });
  }, [props.updatePagesProps]);
  
  //when language is changed
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  return (
    <div>
      {teachersCourses.length === 0 ? (
        <div className="text-center">There are no registered teachers</div>
      ) : (
        <table className={` ${styles.teachersCourses} mx-auto`}>
          <thead>
            <tr>
              <td>{course}</td>
              <td>{teacher}</td>
            </tr>
          </thead>
          <tbody>
            {teachersCourses.map((item, index) => (
              <tr key={index}>
                {" "}
                <td>{item.Name}</td>
                <td>{`${item.First_Name} ${item.Last_Name}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(Page1);
