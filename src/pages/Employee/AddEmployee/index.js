import React from "react";
import styled from "styled-components";
import { Formik, FieldArray, Field, ErrorMessage } from "formik";
import { Employment } from "./common/components/Employement";
import { Account } from "./common/components/Account";
import { PersonalInformation } from "./common/components/PersonalInformation";
import axios from "axios";

const Wrapper = styled.div`
  min-height: calc(100vh - 60px);
  padding-bottom: 150px;
`;
const SubmitButton = styled.button``;
export const AddEmployee = () => {
  const onSubmit = (values) => {
    
    const obj = {...values};
    console.log('values', obj)
    // axios.post(`url`, obj)
    // .then(resp => {})
    // .catch(err => {})
  };

  const form = (props) => {
  
    return (
      <form onSubmit={props.handleSubmit}>     
        <PersonalInformation obj={props} />
        <Employment obj={props} />
        <Account obj={props} />
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
          <h2 className="title-of-middle">Add emplyee</h2>
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
            baseSalary: null,
            typeOfEmployment: "",
            withTeacher: false,
            major: "",
            userName: "",
            password: "",
            confirmPass: "",
          }}
          onSubmit={onSubmit}
          // validationSchema={this.schema()}
        >{form}</Formik>
      </div>
    </Wrapper>
  );
};
