import React from "react";
import { Field, ErrorMessage } from "formik";
import { Fieldset } from "../../../../../Utils/Common/style/GlobalStyles.style";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 30px;
`;
export const Employment = (props) => {
  const { values } = props.obj;
  const { withTeacher } = values;
  return (
    <Wrapper>
      <Fieldset>
        <legend>Employee</legend>{" "}
        <div className="row">
          <div className="col-lg-6 col-12">
            <div className="form-group">
              <label htmlFor="baseSalary">Base Salary</label>
              <Field
                name="baseSalary"
                type="number"
                className="form-control"
                id="baseSalary"
                placeholder=""
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
              />
              <span className="error">
                <ErrorMessage name="baseSalary" />
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="form-group">
              <label htmlFor="typeOfEmployment">Type of Employment</label>
              <Field
                name="typeOfEmployment"
                id="typeOfEmployment"
                className="form-control"
                component="select"
              >
                <option value="full-time">Full Time</option>
                <option value="half-time">Half Time</option>
              </Field>
              <span className="error">
                <ErrorMessage name="monthStart" />
              </span>
            </div>
          </div>
        </div>{" "}
        <div className="row">
          <div className="col-lg-6 col-12">
            <div class="form-check">
              <Field
                className="form-check-input"
                type="checkbox"
                id="withTeacher"
                name="withTeacher"
                checked={withTeacher}
              />
              <label class="form-check-label">Teacher ?</label>
              <span className="error">
                <ErrorMessage name="withTeacher" />
              </span>
            </div>
          </div>
          {withTeacher && (
            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label htmlFor="major">Major</label>
                <Field
                  name="major"
                  type="text"
                  className="form-control"
                  id="major"
                  placeholder=""
                  autoComplete="off"
                />
                <span className="error">
                  <ErrorMessage name="major" />
                </span>
              </div>
            </div>
          )}
        </div>{" "}
        <div className="row"></div>
      </Fieldset>
    </Wrapper>
  );
};
