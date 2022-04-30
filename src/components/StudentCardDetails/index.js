import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
import { useParams } from "react-router-dom";
import axios from "axios";

function StudentCardDetails(props) {
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [details, setDetails] = useState({
    studentsCount: "",
    lastTrimesterAVerage: "",
  });
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  // lang keys
  // Language KEywords
  const { studentsCount, lastTrimesterAverage } = langKeywords[pageLanguage];

  const params = useParams();
  useEffect(() => {
    axios
      .get(`/classAverage/${params.id}`)
      .then((response) => {
        setDetails(response.data);
      })
      .catch((error) => {});
  }, []);
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  useEffect(() => {
    axios
      .get(`/classAverage/${params.id}`)
      .then((response) => {
        setDetails(response.data);
      })
      .catch((error) => {});
  }, [params.id]);
  return (
    <div className=" d-print-none">
      {/* start section details card */}
      <div className="details col-md-8 pl-0">
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-sm-4">
                <h6 className="mb-0"> {studentsCount}</h6>
              </div>
              <div className="col-sm-8 text-secondary">
                {details.studentsCount}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-4">
                <h6 className="mb-0">{lastTrimesterAverage}</h6>
              </div>
              <div className="col-sm-8 text-secondary">
                {details.lastTrimesterAVerage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* start second details card
      <div className="details-card">
        <div>
          {studentsCount} : {details.studentsCount}
        </div>
        <div>
          {lastTrimesterAverage} : {details.lastTrimesterAVerage}
        </div>
      </div>
      end second details card*/}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(StudentCardDetails);
