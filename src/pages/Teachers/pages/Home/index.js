import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Box from "@mui/material/Box";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";

const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function CustomizedAccordions(props) {
  const [pageLang, setPageLang] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });

  //language keys
  const pageLanguage = props.language;

  const { submittedState, unsubmittedState, pendingState } =
    langKeywords[pageLanguage];

  const [expanded, setExpanded] = React.useState("panel1");
  const [semester, setSemester] = useState("");
  const [submitted, setSubmitted] = React.useState({ coures: [], count: "" });
  const [pending, setPending] = React.useState({ coures: [], count: "" });
  const [unsubmitted, setUnsubmitted] = React.useState({
    coures: [],
    count: "",
  });
  const [loading, setLoading] = useState(true);

  var params = useParams();
  const history = useHistory();

  React.useEffect(() => {
    //get idTeacher from url
    const idTeacher = params.idTeacher;

    axios
      .get(
        `/instructor/${localStorage.getItem(
          "id"
        )}/${props.schoolYear}`
      )
      .then((response) => {
        setLoading(false);
        setSemester(response.data.name);
        setSubmitted({
          coures: response.data.subbmitted,
          count: response.data.subbmitted.coures.length,
        });
        setPending({
          coures: response.data.pending.coures,
          count: response.data.pending.coures.length,
        });
        setUnsubmitted({
          coures: response.data.unsubbmitted.coures,
          count: response.data.unsubbmitted.coures.length,
        });
      });
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box sx={{ width: 400, margin: "20px auto" }}>
      {loading == true ? (
        <div>...loading</div>
      ) : (
        <>
          <Box>
            <Typography variant="h3" textAlign="center" mb={3}>
              {semester}
            </Typography>
          </Box>

          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography color="primary">
                {submittedState}: {submitted.count}
              </Typography>
            </AccordionSummary>
            {submitted.count > 0 && (
              <AccordionDetails>
                <List sx={style} component="nav" aria-label="mailbox folders">
                  {submitted.coures.coures.map((item, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        //history.push(`teacher/addscore/${item.idSection}/${item.idCourse}`)
                        history.push({
                          pathname: "/teacher/addscore",
                          state: {
                            idSection: item.idSection,
                            idCourse: item.idCourse,
                          },
                        })
                      }
                    >
                      <ListItem button>
                        <ListItemText
                          primary={item.name}
                          sx={{ color: "#ee664e" }}
                        />
                      </ListItem>
                      {submitted.coures.coures.length - 1 !== index && (
                        <Divider />
                      )}
                    </div>
                  ))}
                </List>
              </AccordionDetails>
            )}
          </Accordion>

          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography color="primary">
                {pendingState}: {pending.count}
              </Typography>
            </AccordionSummary>

            {pending.coures.length > 0 && (
              <AccordionDetails>
                <List sx={style} component="nav" aria-label="mailbox folders">
                  {pending.coures.map((item, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        //history.push(`teacher/addscore/${item.idSection}/${item.idCourse}`)
                        history.push({
                          pathname: "/teacher/addscore",
                          state: {
                            idSection: item.idSection,
                            idCourse: item.idCourse,
                          },
                        })
                      }
                    >
                      <ListItem button>
                        <ListItemText
                          primary={item.name}
                          sx={{ color: "#ee664e" }}
                        />
                      </ListItem>
                      {pending.coures.length - 1 !== index && <Divider />}
                    </div>
                  ))}
                </List>
              </AccordionDetails>
            )}
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography color="primary">
                {unsubmittedState}: {unsubmitted.count}
              </Typography>
            </AccordionSummary>

            {unsubmitted.coures.length > 0 && (
              <AccordionDetails>
                <List sx={style} component="nav" aria-label="mailbox folders">
                  {unsubmitted.coures.map((item, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        //history.push(`teacher/addscore/${item.idSection}/${item.idCourse}`)
                        history.push({
                          pathname: "/teacher/addscore",
                          state: {
                            idSection: item.idSection,
                            idCourse: item.idCourse,
                          },
                        })
                      }
                    >
                      <ListItem button>
                        <ListItemText
                          primary={item.name}
                          sx={{ color: "#ee664e" }}
                        />
                      </ListItem>
                      {unsubmitted.coures.length - 1 !== index && (
                        <Divider light />
                      )}
                    </div>
                  ))}
                </List>
              </AccordionDetails>
            )}
          </Accordion>
        </>
      )}
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
    schoolYear: state.schoolYear,
    idInstructor: state.idInstructor,
  };
};

export default connect(mapStateToProps)(CustomizedAccordions);
