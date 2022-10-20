import React from "react";
import styled from "styled-components";
import { Formik, FieldArray, Field, ErrorMessage } from "formik";
import { Employment } from "./common/components/Employement";
import { Account } from "./common/components/Account";
import { PersonalInformation } from "./common/components/PersonalInformation";
import { connect } from "react-redux";
import axios from "axios";
import swal from "sweetalert";

const Wrapper = styled.div`
  min-height: calc(100vh - 60px);
  padding-bottom: 150px;
`;
const SubmitButton = styled.button``;

const AddEmployee = (props) => {
  const role=props.role;
  const onSubmit = (values, { resetForm }) => {
    
    const obj = {...values};
    if(obj.withTeacher)
      obj.role="instructor";
    var appendedDate = `${obj.birthDate.day}-${obj.birthDate.month}-${obj.birthDate.year}`;
    

    const employee={
      First_Name: obj.firstName,
      Last_Name: obj.lastName,
      Birthday :appendedDate,
      Address: obj.address,
      Nationality: obj.nationality,
      Tel: obj.phoneNumber,
      Type: obj.typeOfEmployment,
      position: obj.job,
      base_salary: obj.baseSalary,
      isInstructor: obj.withTeacher,
      Major: obj.major,
      userName: obj.userName,
      password: obj.password,
      role: obj.withTeacher? "instructor":obj.role,

    };

    console.log('values', employee)
    axios.post(`addEmployee`, employee)
    .then(resp => {
      if(resp.status === 201)
      {
        swal("Success", {
          icon: "success",
        })
        .then(()=>resetForm());
      }
      else {
        if (resp.status === 400)
          swal("Already Exists", {
            icon: "error",
          });
        else
          swal("Error: "+resp.data.status, {
            icon: "error",
          });
      }
    })
    .catch(err => {swal(err, {
      icon: "error",
    });})
  };

  const form = (props) => {
  
    return (
      <form onSubmit={props.handleSubmit}>     
        <PersonalInformation obj={props} />
        <Employment obj={props} />
        <Account obj={props} role={role}/>
        <div className="text-center mt-4">
          <SubmitButton
            disabled={!props.isValid}
            className={`btn ${!props.isValid && `disabled`}`}
            type="submit"
          >
            Submit
          </SubmitButton>
        </div>
      </form>
    );
  };

  return (
    <Wrapper>
      <div className="container-fluid">
        <div className="col-12 text-center">
          <h2 className="title-of-middle">Add employee</h2>
        </div>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            address: "",
            birthDate: {
              day: "",
              month: "",
              year: "",
            },
            nationality: "",
            phoneNumber: "",
            baseSalary: 0,
            typeOfEmployment: "full_time",
            job:"prof",
            withTeacher: false,
            major: "",
            userName: "",
            password: "",
            confirmPass: "",
            role:"employee",
          }}
          onSubmit={onSubmit}
          // validationSchema={this.schema()}
        >{form}</Formik>
      </div>
    </Wrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
    role: state.role,
  };
};
export default connect(mapStateToProps)(AddEmployee);
