import React, { Component } from "react";
import axios from "axios";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import { Select, MenuItem, FormControl } from "@mui/material";
import "./style.css";
import { withStyles } from "@mui/material/styles";

class GradeDDL extends Component {
  state = {
    pageLang: this.props.language,
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
    grades: [{ gradeId: "0", gradeName: "All", sections: [] }],
    sections: [],
    gradeSelected: "",
    sectionSelected: "",
  };

  componentDidMount() {
    axios.get(`/section/${this.props.year}`).then((resp) => {
      this.setState({
        grades: [...this.state.grades, ...resp.data],
      });
    });
  }
  selectChange(e) {
    this.setState({ gradeSelected: e.target.value });

    this.setState({
      sections: this.state.grades.find((x) => x.gradeId === e.target.value)
        .sections,
    });
    this.props.updateGradeId(e.target.value);
  }

  //handle section
  handleSection = (e) => {
    this.setState({ sectionSelected: e.target.value });
    this.props.updateSectionId(e.target.value);
  };
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { grade, section, all } = this.state.langKeywords[pageLanguage];
    return (
      <div className="grade-ddl">
        <center>
          <FormControl style={{ minWidth: 150, marginRight: 4 }} fullWidth>
            <Select
              value={this.state.gradeSelected}
              onChange={this.selectChange.bind(this)}
              displayEmpty
              MenuProps={{
                style: { zIndex: 35001 },
              }}
            >
              <MenuItem value="" disabled>
                {grade}
              </MenuItem>
              {this.state.grades.map((x) => (
                <MenuItem value={x.gradeId}>
                  {x.gradeName === "All" ? all : x.gradeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {this.state.sections.length > 0 ? (
            <Select
              value={this.state.sectionSelected}
              displayEmpty
              MenuProps={{
                style: { zIndex: 35001 },
              }}
              onChange={this.handleSection}
              fullWidth
            >
              <MenuItem value="" disabled>
                {" "}
                {section}
              </MenuItem>
              {this.state.sections.map((item) => (
                <MenuItem value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          ) : null}
        </center>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.language,
    year: state.schoolYear,
  };
};
export default connect(mapStateToProps)(GradeDDL);
