/* Readable Scalable Secure */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class GradesList extends Component {
  state = {
    grades: []
  }
  componentDidMount = () => {
    console.log("paraaaams", this.props.match);
    axios
      .get(
        "/grade"
      )
      .then((response) => {
        this.setState({
          grades: [...response.data],
          loadingPage: false
        });
      });
  }

 

   render () {
      return (
          <>
          <ul>
          { this.state.grades.map( (grade, index) => {
              return (
                <li key={ index }>

                  <Link>
                  { grade.Name }
                  </Link>
                </li>
              );
          })
          }
          </ul>
          </>
      );
  }
}

export default GradesList;
