import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import {
  ENGLISHWORDS,
  FRENCHWORDS,
  PORTOWORDS,
} from "../../SchoolYear/langKeys";
import { TOGGLE_REGISTRATION_SCHOOL_YEAR } from "../../../../redux/actions";
import axios from "axios";
import swal from "sweetalert";
import {
  MenuItem,
  Menu,
  Link,
  Popover,
  Typography,
  Button,
  FormControl,
  Box,
  Select,
} from "@material-ui/core";
function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        size="small"
        style={{
          borderColor: "#ee664e",
          backgroundColor: "#f00",
          color: "#fff",
          fontSize: "9px",
          "&:hover": {
            color: "#f00",
            backgroundColor: "#fff",
            borderColor: "#f00",
          },
        }}
      >
        {props.goBack}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            props.setBackYear();
            handleClose();
          }}
        >
          {props.goBack}
        </MenuItem>
      </Menu>
    </div>
  );
}

function StudentRegistrationYear(props) {
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const [year, setYear] = React.useState("");
  // Language KEywords
  const {
    progressToNewRegistrationYear,
    registrationForYear,
    registerForNestYear,
    goBack,
    cancel,
    confirm,
    errorRefresh,
    success,
  } = langKeywords[pageLanguage];

  // use effect
  useEffect(() => {
    axios
      .get("/registrationYear")
      .then((response) => {
        if (response.status == 200) setYear(response.data.value);
      })
      .catch((error) => {
        swal(error, {
          icon: "error",
        });
      });
  }, []);
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  // handle click
  const setNewYear = () => {
    let year1, year2, newYear;
    if (year.trim() !== "") {
      year1 = parseInt(year.split("-")[0]) + 1;
      year2 = parseInt(year.split("-")[1]) + 1;
      newYear = `${year1}-${year2}`;
      swal({
        title: `${progressToNewRegistrationYear} : ${newYear}?`,
        icon: "warning",
        buttons: [cancel, confirm],
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          axios
            .post(`/registrationYear`, {
              schoolyear: newYear,
            })
            .then((response) => {
              if (response.status == 200) {
                setYear(newYear);
                props.toggleRegistrationSchoolYear(newYear);
                swal(success, {
                  icon: "success",
                });
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
    } else {
      swal(errorRefresh, {
        icon: "error",
      });
    }
  };

  // handle back year button
  const setBackYear = () => {
    let year1, year2, newYear;
    if (year.trim() !== "") {
      year1 = parseInt(year.split("-")[0]) - 1;
      year2 = parseInt(year.split("-")[1]) - 1;
      newYear = `${year1}-${year2}`;
      swal({
        title: `Progress to a new registration year : ${newYear}?`,
        icon: "warning",
        buttons: [cancel, confirm],
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          axios
            .post(`/registrationYear`, {
              schoolyear: newYear,
            })
            .then((response) => {
              if (response.status == 200) {
                setYear(newYear);
                props.toggleRegistrationSchoolYear(newYear);
                swal(success, {
                  icon: "success",
                });
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
    } else {
      swal(errorRefresh, {
        icon: "error",
      });
    }
  };
  return (
    <Box style={{ display: "flex", marginTop: "30px" }}>
      <span style={{ flexGrow: 2 }}>
        <label>{registrationForYear}</label>
      </span>
      <span style={{ flexGrow: 1, fontSize: 21 }}>{year}</span>
      <div style={{ flexGrow: 1 }}>
        <Button
          size="large"
          style={{
            color: "#ee664e",
            fontSize: "11px",
            color: "#fff",
            backgroundColor: "#ee664e",
            borderColor: "#ee664e",
            "&:hover": {
              color: "#ee664e",
              backgroundColor: "#fff",
              borderColor: "#ee664e",
            },
          }}
          variant="outlined"
          onClick={setNewYear}
        >
          {registerForNestYear}
        </Button>
      </div>
      <div className="d-flex align-items-center" style={{ flexGrow: 1 }}>
        <BasicMenu year={year} setBackYear={setBackYear} goBack={goBack} />
      </div>
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleRegistrationSchoolYear: (newYear) =>
      dispatch({
        type: TOGGLE_REGISTRATION_SCHOOL_YEAR,
        payload: { registrationSchoolYear: newYear },
      }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentRegistrationYear);
