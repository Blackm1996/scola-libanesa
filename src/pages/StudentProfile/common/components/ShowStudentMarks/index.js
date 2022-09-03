import React, { useState, useEffect } from "react";
import Select from "react-select";
//import printImage from "../../../images/new-escola-logo3.png";
import { useParams, withRouter } from "react-router-dom";
import StudentsMarks from "../../../../../components/StudentMarks";
import { getYears } from "../../../../../Api/Payments";
import axios from "axios";
import styled from "styled-components";

const Wrapper = styled.div`
.printBill {
    display: block !important;
    position: relative;
    height: auto;
    z-index: 0
}
.marks .first-section {
    width: 100% !important;
    border-top: 1px solid;
}
.markHeader {
    display: none !important
}
.markObservation {
    display: none !important;
}
.markSignature {
    display: none !important;
}
`

const PrintTable = () => {
    const [studentMarks, setStudentMarks] = useState(null);
    const [loading, setLoading] = useState(false)
    const [selectedYear,setSelectedYear]=useState(null);
    const [inscriptionYears,setInscriptionYears] = useState([]);
    const {id} = useParams();
    useEffect(() => {
        
        setLoading(true)
        axios.get("schoolYear").then(resp=>{
            setSelectedYear(resp.data['school_year'])
        })
        .then(
                ()=>{
                    console.log("Done");
                    getYears(id)
                    .then(
                        response=>{
                            setInscriptionYears(response.data);
                            axios.get(`studentScores/${id}/${selectedYear}`).then(resp => {
                                console.log(resp);
                                setStudentMarks(resp.data)
                            })
                            .then(resp => setLoading(false))
                            .catch(err => setLoading(false))
                        }
                    )
                }
            )
       
    }, [])

    useEffect(()=>{
        axios.get(`studentScores/${id}/${selectedYear}`).then(resp => {
            console.log(resp);
            setStudentMarks(resp.data)
        })
            .then(resp => setLoading(false))
            .catch(err => setLoading(false))
    },[selectedYear])
    const changeSelectedYear = e=>{
        setSelectedYear(e.value);
    };
    var years = [],
      year = "";

    for (var i = 0; i <inscriptionYears.length; i++) {
      year = inscriptionYears[i]["School_Year"];
      years.push({ value: year, label: year });
    }
    //const { id, name, grade, telephone, inscriptionTax, booksUniform } = this.props.printDetails;
    return (
        <Wrapper>


              <div className="select">
                <Select
                  disabled={true}
                  style={{ fontSize: 0 , marginTop : 20 }}
                  placeholder="Select class"
                  defaultValue={{
                    label: selectedYear,
                    value: selectedYear,
                  }}
                  value={{
                    label: selectedYear,
                    value: selectedYear,
                  }}
                  options={years}
                  
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "hotpink",
                      primary: "#ff634766",
                    },
                  })}
                  onChange={changeSelectedYear}
                />
                
              </div>
              
            {loading ? <div>... loading</div> :
                <div className="printBill">
                    <div className="marks d-block d-print-none">
                        {studentMarks && <StudentsMarks obj={studentMarks} />}
                    </div>
                    <div className="print-bill"></div>
                </div>}
        </Wrapper>

    );

}

export default withRouter(PrintTable);
