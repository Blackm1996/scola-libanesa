import React, { useEffect, useState } from "react";
//
import { connect } from "react-redux";
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import {
  ENGLISHWORDS,
  FRENCHWORDS,
  PORTOWORDS,
} from "../../SchoolYear/langKeys";
import axios from "axios";
import swal from "sweetalert";
import Popover from "@mui/material/Popover";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
//
import {
  Button,
  Box,
  Typography,
  Link,
  FormControl,
  Select,
  Menu,
  MenuItem,
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

function OngoingSchoolYear(props) {
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const [year, setYear] = React.useState("");
  // Language KEywords
  const {
    ongoingSchoolYear,
    startNewYear,
    goBack,
    progressToNewYear,
    cancel,
    confirm,
    errorRefresh,
    success
  } = langKeywords[pageLanguage];

  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);

  // use effect
  useEffect(() => {
    axios
      .get("/schoolYear")
      .then((response) => {
        if (response.status == 200) setYear(response.data.value);
      })
      .catch((error) => {
        swal(errorRefresh, {
          icon: "error",
        });
      });
  }, []);

  // handle click
  const setNewYear = () => {
    let year1, year2, newYear;
    if (year.trim() !== "") {
      year1 = parseInt(year.split("-")[0]) + 1;
      year2 = parseInt(year.split("-")[1]) + 1;
      newYear = `${year1}-${year2}`;
      swal({
        title: `${progressToNewYear}  : ${newYear}?`,
        icon: "warning",
        buttons: [cancel, confirm],
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          axios
            .post(`/schoolYear`, {
              schoolyear: newYear,
            })
            .then((response) => {
              if (response.status == 200) {
                setYear(newYear);
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
        title: `${progressToNewYear} : ${newYear}?`,
        buttons: [cancel, confirm],
        icon: "warning",
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          axios
            .post(`/schoolYear`, {
              schoolyear: newYear,
            })
            .then((response) => {
              if (response.status == 200) {
                setYear(newYear);
                swal(success, {
                  icon: "success",
                });
              } else {
                swal("error", {
                  icon: "error",
                });
              }
            })
            .catch((error) => {
              swal("error", {
                icon: "error",
              });
            });
        }
      });
    } else {
      swal("error, please refresh the page", {
        icon: "error",
      });
    }
  };
  return (
    <Box sx={{ display: "flex", marginTop: "30px" }}>
      <span style={{ flexGrow: 2 }}>
        <label>{ongoingSchoolYear} :</label>
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
          {startNewYear}
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

export default connect(mapStateToProps)(OngoingSchoolYear);
