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
import { MenuItem, FormControl, Select, Box } from "@material-ui/core";
function StartMonth(props) {
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const [month, setMonth] = React.useState("");
  // Language KEywords
  const {
    startMonth,
    cancel,
    confirm,
    progressToNewStartMonth,
    errorRefresh,
    success,
  } = langKeywords[pageLanguage];
  // use effect
  useEffect(() => {
    axios
      .get("/startmonth")
      .then((response) => {
        if (response.status == 200) setMonth(response.data.value);
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
    swal({
      title: `${progressToNewStartMonth} : ${event.target.value} ?`,
      icon: "warning",
      buttons: [cancel, confirm],
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        axios
          .post(`/startmonth`, {
            startMonth: event.target.value,
          })
          .then((response) => {
            if (response.status == 200) {
              setMonth(event.target.value);
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
  };

  return (
    <Box sx={{ marginTop: "30px" }} className="d-flex">
      <span className="d-flex align-items-end">
        <label>{startMonth} :</label>
      </span>
      <div>
        <FormControl
          variant="standard"
          sx={{ m: 1, marginLeft: 3, minWidth: 120 }}
        >
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            displayEmpty
            value={month}
            onChange={handleChange}
            label="Age"
          >
            <MenuItem value="" disabled></MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(StartMonth);
