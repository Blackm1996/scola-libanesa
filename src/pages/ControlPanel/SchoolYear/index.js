import React, { useState, useEffect } from "react";
import OngoingSchoolYear from "../components/OngoingSchoolYear";
import StudentRegistrationYear from "../components/StudentRegistrationYear";
import StartMonth from "../components/StartMonth";
import EndMonth from "../components/EndMonth";
import SetNewSemester from "../components/SetNewSemester";
//import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./langKeys";

import { Box } from "@mui/material";
function SchoolYear(props) {
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const {
    controlPanel
  } = langKeywords[pageLanguage];
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  const themeLight = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: "#f00",
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={themeLight}>
      <Box sx={{ height: "100vh", width: "90%", margin: "30px auto" }}>
        <fieldset className="mx-auto w-100">
          <legend>{controlPanel}</legend>
          <Box sx={{ width: "84%", margin: "auto" }}>
            <OngoingSchoolYear />
            <StudentRegistrationYear />
            <StartMonth />
            <EndMonth />
            <SetNewSemester />
          </Box>
        </fieldset>
      </Box>
    </ThemeProvider>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(SchoolYear);
