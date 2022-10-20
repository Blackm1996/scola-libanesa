import React, { useEffect } from "react";
import { Field, ErrorMessage } from "formik";
import { Fieldset } from "../../../../../Utils/Common/style/GlobalStyles.style";
import styled from "styled-components";
import Select from "react-select";
const Wrapper = styled.div`
  margin-top: 30px;
`;
export const Account = (props) => {
  const { values } = props.obj;
  const {role} = props;
  const validate = (val, formikValues) => {
    const { userName, password } = formikValues;
    if (userName !== "" && password === "") return "password field is required";
  };
  const validateConfirmPass = (val, formikValues) => {
    const { confirmPass, password, userName } = formikValues;

    if (userName && password !== confirmPass) return "Password doesn't match";
  };

  const choose=!values.withTeacher;

  useEffect(()=>{console.log("ACCO",props)},[])

  return (
    <Wrapper>
      <Fieldset className="col-lg-6 col-12 mx-auto">
        <legend>Account(optional)</legend>{" "}
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <Field
                name="userName"
                type="text"
                className="form-control"
                id="userName"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="userName" />
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                name="password"
                type="password"
                className="form-control"
                id="password"
                placeholder=""
                validateOnChange={true}
                validate={(val) => validate(val, values)}
              />
              <span className="error">
                <ErrorMessage name="password" />
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPass">Re-enter password</label>
              <Field
                name="confirmPass"
                type="password"
                className="form-control"
                id="confirmPass"
                placeholder=""
                validate={(val) => validateConfirmPass(val, values)}
                validateOnBlur={true}
                validateOnChange={true}
              />
              <span className="error">
                <ErrorMessage name="confirmPass" />
              </span>
            </div>

            {choose && (
              <div className="form-group">
              <label htmlFor="role">Role</label>
              <Field
                name="role"
                component="select"
                className="form-control"
                id="role"
                defaultValue="employee">
                  {role === "admin" && (
                    <option value="manager">manager</option>
                  )}
                  {role === "admin" && (
                    <option value="supervisor">supervisor</option>
                  )}

                  {(role === "admin" ||
                    role === "co-admin") && (
                    <option value="employee">employee</option>
                  )}
              </Field>
              <span className="error">
                <ErrorMessage name="role" />
              </span>
            </div>
            )}

          </div>
        </div>{" "}
      </Fieldset>
    </Wrapper>
  );
};
