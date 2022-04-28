import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from "@material-ui/core";
import TeacherAppBar from "../../../components/TeacherAppBar";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../../Teachers/pages/Home/index";
import About from "../../Teachers/pages/Home/index";
import AddScore from "../../Teachers/AddScores";
import TeacherSideNav from "../../../components/TeacherSideNav";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { connect } from "react-redux";
import { TOGGLE_LANG, TOGGLE_ROLE } from "../../../redux/actions";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ee664e",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: theme.palette.grey[300],
  },
}));

const TeacherDashboard = (props) => {
  useEffect(() => {
    /* start Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    // get language from local storage
    const globalLang = localStorage.getItem("language");
    if (globalLang != null) {
      // when we click update button we should update the update and we need to set language in redux from localstorage
      props.toggleLanguages(globalLang);
    }
    /* end Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    /* start resolve problem when we reload the page and user role should reset in redux */
    const role = localStorage.getItem("role");
    if (role != null) {
      // when we click update button we should update the update and we need to set role in redux from localstorage
      props.setRole(role);
    }
    /* end resolve problem when we reload the page and user role should reset in redux */
  }, []);

  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      {props.role === "instructor" ? (
        <BrowserRouter>
          <TeacherAppBar />
          <Grid container>
            <Grid item md={3}>
              <TeacherSideNav />
            </Grid>
            <Grid item md={7}>
              <Switch>
                <Route exact path="/teacher">
                  <About />
                </Route>
                <Route exact path="/home" component={Home} />
                <Route exact path="/teacher/about" component={About} />
                {/* 
                <Route
                  exact
                  path="/teacher/addscore/:idSection/:idCourse"
                  component={AddScore}
                />
                */}
                <Route
                  exact
                  path="/teacher/addscore"
                  component={AddScore}
                />
              </Switch>
            </Grid>
            <Grid item md={2}></Grid>
          </Grid>
        </BrowserRouter>
      ) : (
        <div>You dont have permission access this page</div>
      )}
    </ThemeProvider>
  );
};
const mapStateToProps = (state) => {
  return {
    role: state.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguages: (newLang) =>
      dispatch({ type: TOGGLE_LANG, payload: { lang: newLang } }),
    setRole: (role) => dispatch({ type: TOGGLE_ROLE, payload: { role } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherDashboard);
