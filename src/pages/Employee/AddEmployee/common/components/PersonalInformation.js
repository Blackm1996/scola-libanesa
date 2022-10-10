import React from "react";
import { Fieldset } from "../../../../../Utils/Common/style/GlobalStyles.style";
import { ErrorMessage, Field } from "formik";
import { months, getDays, getYears } from "../helpers";

export const PersonalInformation = () => {
  const days = getDays();
  const years = getYears();

  return (
    <Fieldset>
      <legend>Personal Informations</legend>{" "}
      <div className="row">
        <div className="col-lg-6 col-12">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <Field
              name="firstName"
              type="text"
              className="form-control"
              id="firstName"
              placeholder=""
              autoComplete="off"
            />
            <span className="error">
              <ErrorMessage name="firstName" />
            </span>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div className="form-group">
            <label htmlFor="gradeName">Last Name</label>
            <Field
              name="lastName"
              type="text"
              className="form-control"
              id="lastName"
              placeholder=""
              autoComplete="off"
            />
            <span className="error">
              <ErrorMessage name="lastName" />
            </span>
          </div>
        </div>
      </div>{" "}
      <div className="row">
        <div className="col-lg-6 col-12">
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <Field
              name="address"
              type="text"
              className="form-control"
              id="address"
              placeholder=""
              autoComplete="off"
            />
            <span className="error">
              <ErrorMessage name="address" />
            </span>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div className="form-group birth-date">
            <label htmlFor="birthDate">birth Date</label>

            {/* Day */}
            <div className="w-25 float-left mr-2">
              <Field
                name="birthDate.day"
                id="birthDate.day"
                className="form-control"
                component="select"
                defaultValue=""
              >
                <option value=""></option>
                {days.map((item, index) => {
                  return (
                    <option key={index} value={`${index + 1}`}>
                      {item}
                    </option>
                  );
                })}
              </Field>
              <span className="error">
                <ErrorMessage name="birthDate.day" />
              </span>
            </div>

            {/* Months */}
            <div className="w-25 float-left mr-2">
              <Field
                name="birthDate.month"
                id="birthDate.month"
                className="form-control"
                component="select"
                defaultValue=""
              >
                <option value=""></option>
                {months.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  );
                })}
              </Field>
              <span className="error">
                <ErrorMessage name="birthDate.month" />
              </span>
            </div>

            {/* Year */}
            <div className="w-25 float-left">
              <Field
                name="birthDate.year"
                id="birthDate.year"
                className="form-control"
                component="select"
                defaultValue=""
              >
                <option value=""></option>
                {years.map((item, index) => {
                  return (
                    <option key={index} value={`${item}`}>
                      {item}
                    </option>
                  );
                })}
              </Field>
              <span className="error">
                <ErrorMessage name="birthDate.year" />
              </span>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="row">
        <div className="col-lg-6 col-12">
          <div className="form-group">
            <label htmlFor="gradeName">Nationality</label>
            <Field
              name="nationality"
              type="text"
              className="form-control"
              id="nationnality"
              placeholder=""
              autoComplete="off"
            />
            <span className="error">
              <ErrorMessage name="nationality" />
            </span>
          </div>
        </div>

        <div className="col-lg-6 col-12">
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone number</label>
            <Field
              name="phoneNumber"
              type="text"
              className="form-control"
              id="phoneNumber"
              placeholder=""
              autoComplete="off"
            />
            <span className="error">
              <ErrorMessage name="phoneNumber" />
            </span>
          </div>
        </div>
      </div>
    </Fieldset>
  );
};
