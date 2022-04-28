import React, { Component } from "react";
import { Select, MenuItem } from "@material-ui/core";

class SelectMonth extends Component {
    constructor() {
      super();
      this.state = {
        months: ["9", "10", "11", "12", "1", "2", "3", "4", "5", "6"],
        selectedMonth: "9"
      }
    }

    //handle section
    handleSelect = ( e ) => {
      this.setState({
        selectedMonth: e.target.value
      });
      this.props.updateMonth( e.target.value );     
    }
    render() {
        return (
            <div className="mb-2 mr-2">
              <center>
                <Select 
                  value={ this.state.selectedMonth } 
                  onChange={ this.handleSelect } 
                  MenuProps={{
                    style: { zIndex: 35001 },
                  }}
                >
            
                  {
                      this.state.months.map( (month, index) => 
                        <MenuItem value={ month } key={ index }>{ month }</MenuItem>
                      )
                  }
                </Select>
              </center>
            </div>
        );
    }
}

export default SelectMonth;