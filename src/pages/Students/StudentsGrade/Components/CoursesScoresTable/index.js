import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";

function CoursesScoresTable({ coursesObj, language }) {
  const [pageLanguage, setPageLanguage] = useState(language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });

  const { score, cours } = langKeywords[pageLanguage];

  //use Effect
  useEffect(() => {
    setPageLanguage(language);
  }, [language]);
  return (
    <div>
      <fieldset className="mx-auto mt-5">
        <legend>{cours}</legend>
        <table>
          <thead>
            <tr>
              <td>{cours}</td>
              <td>{score}</td>
            </tr>
          </thead>
          <tbody>
            {coursesObj.courses.length > 0 &&
              coursesObj.courses.map((item, index) => (
                <tr>
                  <td>{item.Name}</td>
                  <td>{item.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(CoursesScoresTable);
