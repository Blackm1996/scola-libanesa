import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";

import * as Yup from "yup";
import axios from 'axios';
import swal from 'sweetalert';
import { connect } from "react-redux";

import "./shared/styles/style.css";
import { useParams } from "react-router-dom";

const editFamilyInfo = () =>
{
    const [famInfo,setFamInfo]=useState({});
    const {familyID:famID} = useParams();

    useEffect
    return(
        <div className="inscription-student">
        <div className="container-fluid">
            <div className="col-12 text-center">
                <div className="title-of-middle">
                    <h2>Add Family</h2>
                </div>
            </div>

            {/* Start Formik */}
            <Formik
                initialValues={{
                    fatherName : '',
                    fatherProfession : '',
                    fatherAddress : '',
                    motherName : '',
                    motherProfession : '',
                    motherAddress : '',
                    mainCom: '',
                    mainComOwner: 'Father',
                    mainComIsWhats: false,
                }}
                        
                onSubmit={onSubmit}
                validationSchema={schema}
            >
                {form}
            </Formik>
            {/* End Formik */}
        </div>
    </div>
    );
}

const mapStateToProps = (state) => {
    return {
      language: state.language,
    };
  };
  export default connect(mapStateToProps)(editFamilyInfo);