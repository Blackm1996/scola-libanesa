import React, { useState, useEffect } from "react";
//import printImage from "../../../images/new-escola-logo3.png";
import { withRouter } from "react-router-dom";
import StudentsMarks from "../../../../../components/StudentMarks";
import axios from "axios";
import styled from 'styled-components'
const Wrapper = styled.div`
.marks .first-section {
    width: 100% !important;}
`
const PrintTable = () => {
    const [studentMarks, setStudentMarks] = useState(null);

    useEffect(() => {
        axios.get('/classScores/9').then(resp => {
            setStudentMarks(resp.data[0])
        }).then(resp => {
          setTimeout(() => window.print(), 2000)
        })
    }, [])
    //const { id, name, grade, telephone, inscriptionTax, booksUniform } = this.props.printDetails;
    return (
        <Wrapper> <div className="printBill">
            <div className="marks d-block d-print-block">
                {studentMarks && <StudentsMarks obj={studentMarks} withEmptyRows />}
            </div>
            <div className="print-bill"></div>
        </div></Wrapper>

    );

}

export default withRouter(PrintTable);
