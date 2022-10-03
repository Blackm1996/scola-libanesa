import React, { useState, useEffect } from "react";
//import printImage from "../../../images/new-escola-logo3.png";
import { withRouter, useParams } from "react-router-dom";
import axios from "axios";
import "./style.css";


const MedicalInfo = () => {
    const {id}=useParams();
    const[medical,setMedical]=useState();
    const[medicine,setMedicine]=useState();
    var details;

    useEffect(()=>{
        axios
        .get(`/studentMedicalHistory/${id}`)
        .then((response)=>{
            if(response.status===200)
            {
                let med1=[];
                response.data.medical.forEach(element => 
                {
                    let res=element.Description===null? "":':'+element.Description
                    med1.push(element.Name+res);
                });

                setMedical(med1);
                

                let med2=[];
                response.data.medicine.forEach(element => 
                {
                    med2.push(element.Name);
                });

                setMedicine(med2);
            }
        })
    },[]);

    useEffect(()=>{console.log(medical)},[medical]);
    //const { id, name, grade, telephone, inscriptionTax, booksUniform } = this.props.printDetails;
    return (
        <div style={{ "overflow-x": "auto" , marginBottom:50}} className="medical">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">Medical Information</h2>
                  {medical&&medicine&&<div><table className="medical-table">
                    <thead>
                      <tr>
                        <th>Situation</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    {medical.length === 0 ? (
                      <div>empty</div>
                    ) : (
                      medical.map((cas) => {
                        {details=cas.split(":")}
                        return (
                            <tr>
                          <td>{details[0]}</td>
                          <td>{details.length>1? details[1]:""}</td>
                        </tr>
                        );
                    })
                    )}
                  </table>

                  <table className="medical-table">
                    <thead>
                      <tr>
                        <th>Medication</th>
                      </tr>
                    </thead>
                    {medicine.length === 0 ? (
                      <div>empty</div>
                    ) : (
                        medicine.map((cas) => (
                        <tr>
                          <td>{cas}</td>
                        </tr>
                        ))
                    )}
                  </table></div>}
                </div>
            </div>
        </div>

    );

}

export default withRouter(MedicalInfo);
