import * as React from "react";
import { Box, Button } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Link from "@mui/material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  title: {
    marginBottom: 30,
  },
});

function Home(props) {
  const classes = useStyles();
  const handleClick = (event) => {};
  return (
    <Box sx={{ width: 400, margin: "30px auto" }}>
      <Box className={classes.title}>
        <Typography color="primary" variant="h3">
          {" "}
          1st Trimester
        </Typography>
      </Box>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">Submitted: 5</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Link variant="contained">CP/1º ANO-A : Math</Link>
          <Typography>CP/1º ANO-A : Bio</Typography>
          <Typography>CP/1º ANO-A : Chimie</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Pending: 3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-label="mailbox folders"
          >
            <ListItem button>
              <ListItemText>
                <Link href="/aaa">Inbox</Link>
              </ListItemText>
            </ListItem>
            <Divider />
            <ListItem button divider>
              <ListItemText>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
              </ListItemText>
            </ListItem>
            <ListItem button>
              <Link href="/teacher/about">aaaa</Link>
            </ListItem>
            <Divider light />
            <ListItem button>
              <ListItemText primary="Spam" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Unsubmitted: 6</Typography>
        </AccordionSummary>
      </Accordion>
    </Box>
  );
}

export default Home;
