import React, { useState,useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import axios from "axios";


const SelectYear =(props)=> {
  const [years,setYears]=useState([]);
  const[selectedYear,setSelectedYear]=useState("");

    useEffect(()=>{
      axios
      .get("/getAllYears")
      .then((response)=>{
        setYears(response.data);
        setSelectedYear(years[years.length-1]);
      })

    },[]);

    //handle section
    const handleSelect = ( e ) => {
      setSelectedYear(e.target.value);
      props.updateYear( e.target.value );     
    };
    return (
            <div>
              <center>
                <Select value={selectedYear} onChange={handleSelect} >
            
                  {
                      years.map( year => 
                        <MenuItem value={ year }>{ year }</MenuItem>
                      )
                  }
                </Select>
              </center>
            </div>
        );
}

export default SelectYear;