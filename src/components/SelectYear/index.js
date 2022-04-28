import React, { Component } from "react";
import { Select, MenuItem } from "@material-ui/core";

class GradeDDL extends Component {
    constructor() {
      super();
      this.state = {
        years: ["2021-2022"],
        selectedYear: "2021-2022"
      }
    }

    //handle section
    handleSelect = ( e ) => {
      this.setState({
        selectedYear: e.target.value
      });
      this.props.updateYear( e.target.value );     
    }
    render() {
        return (
            <div className="mb-2 mr-2">
              <center>
                <Select value={ this.state.selectedYear } onChange={ this.handleSelect } >
            
                  {
                      this.state.years.map( year => 
                        <MenuItem value={ year }>{ year }</MenuItem>
                      )
                  }
                </Select>
              </center>
            </div>
        );
    }
}

export default GradeDDL;