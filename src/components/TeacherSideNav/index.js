import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => {
  return {
    sideNav: {
      height: "100vh",
      backgroundColor: "#eeeeee17",
      borderRight: "1px solid #0000001f",
    },
    title: {
      color: "#ee664e",
    },
  };
});

// Menu Item
const MenuItem = ({ gradeId, gradeName, courses, changeCourse2 }) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const classes = useStyles();
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        selected={open}
        sx={{ borderBottom: "1px solid #0000001f" }}
      >
        <ListItemText
          disableTypography
          primary={
            <Typography type="body2" className={classes.title}>
              {gradeName}
            </Typography>
          }
        />
        {open ? (
          <ExpandLess sx={{ fontSize: "16px", color: "#ee664e" }} />
        ) : (
          <ExpandMore sx={{ fontSize: "16px", color: "#ee664e" }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {courses.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                history.push({
                  pathname: "/teacher/addscore",
                  state: {
                    idSection: item.idSection,
                    idCourse: item.idCourse,
                  },
                });
              }}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography type="body2" className={classes.title}>
                      {item.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </div>
          ))}
        </List>
      </Collapse>
    </>
  );
};

function TeacherSideNav(props) {
  const [courses, setCourses] = useState([]);
  var params = useParams();

  // Use Effect
  useEffect(() => {
  props.schoolYear &&
      axios
        .get(
          `/instructorCourses/${localStorage.getItem("id")}/${props.schoolYear}`
        )
        .then((res) => {
          setCourses(res.data);
        });
  }, []);
  useEffect(() => {
    props.schoolYear &&
      axios
        .get(
          `/instructorCourses/${localStorage.getItem("id")}/${props.schoolYear}`
        )
        .then((res) => {
          setCourses(res.data);
        });
  }, [props.schoolYear]);

  const classes = useStyles();
  return (
    <Box className={classes.sideNav}>
      <List sx={{ width: "100%", paddingTop: 0 }} component="nav">
        {courses.map((item, index) => (
          <MenuItem
            key={index}
            gradeName={item.gradeName}
            gradeId={item.gradeId}
            courses={item.courses}
          />
        ))}
      </List>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    idInstructor: state.idInstructor,
    schoolYear: state.schoolYear,
  };
};

export default connect(mapStateToProps)(TeacherSideNav);
