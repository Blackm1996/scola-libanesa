import React, { useState, useEffect } from "react";
//import printImage from "../../../images/new-escola-logo3.png";
import { withRouter } from "react-router-dom";
import StudentsMarks from "../../../../../components/StudentMarks";
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
    useEffect(() => {
        setLoading(true)
        axios.get('https://management.escola-libanesa.com/test2/api/classScores/9').then(resp => {
            setStudentMarks(resp.data[0])
        })
            .then(resp => setLoading(false))
            .catch(err => setLoading(false))
    }, [])
    //const { id, name, grade, telephone, inscriptionTax, booksUniform } = this.props.printDetails;
    return (
        <Wrapper>

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
