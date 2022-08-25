import React, { useState,useEffect } from "react";
import Select from "react-select";
import axios from "axios";


const SelectYear =(props)=> {
  const [years,setYears]=useState([]);
  const[selectedYear,setSelectedYear]=useState("");
  
    useEffect(()=>{
      axios
      .get("/getAllYears")
      .then((response)=>{
        //setYears(response.data);
        var options=[];
        response.data.forEach(element => {
          options.push({label:element, value: element})
        });
        setYears(options);
        axios
        .get("/schoolYear")
        .then(response=>{
          setSelectedYear(response.data["school_year"])
        })
      })

    },[]);

    const defaultValue={label:selectedYear, value: selectedYear}
    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        borderBottom: "1px dotted pink",
        color: state.isDisabled ? "red" : "tomato",
        fontSize: 13,
        color: state.isFocused ? "#fff" : "#958282",
        backgroundColor: state.isFocused ? "tomato" : "transparent",
        cursor: "pointer",
      }),
      singleValue: (provided, state) => {
        const color = state.isDisabled ? "#958282" : "#958282";
        const transition = "opacity 300ms";
  
        return { ...provided, color, transition };
      },
      control: (base) => ({
        ...base,
        fontSize: 13,
        marginBottom: 7,
      }),
    };

    
    //handle section
    const handleSelect = ( e ) => {
      setSelectedYear(e.value);
      props.updateYear( e.value );
    };
    return (
            <div>
              <center>
                <Select
                defaultValue={defaultValue}
                value={defaultValue}
                onChange={handleSelect}
                options={years}
                styles={customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "hotpink",
                      primary: "#ff634766",
                    },
                  })}
                />       
                  
              </center>
            </div>
        );
}

export default SelectYear;