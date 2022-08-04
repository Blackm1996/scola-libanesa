import React from "react";
import Button from "@mui/material/Button";
//import { MenuItem, Menu } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
import { connect } from "react-redux";
import { TOGGLE_LANG } from "../../../redux/actions";
import { MenuItem, Menu } from "@mui/material";

function PositionedMenu(props) {
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
        id="demo-positioned-button"
        aria-controls="demo-positioned-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="secondary"
        startIcon={<TranslateIcon />}
        sx={{ color: "#fff !important" }}
      ></Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            props.toggleLanguages(FRENCH);
          }}
        >
          Fr
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.toggleLanguages(PORTO);
          }}
        >
          Porto
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.toggleLanguages(ENGLISH);
          }}
        >
          Eng
        </MenuItem>
      </Menu>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguages: (newLang) =>
      dispatch({ type: TOGGLE_LANG, payload: { lang: newLang } }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PositionedMenu);
