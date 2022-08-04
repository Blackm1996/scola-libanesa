/* Readable Scalable Secure */
import React, { Component, useEffect, useState } from "react";
import "./style.css";
import FamilyAddModal from "../../../../components/Family/Add";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "../Add/LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { TOGGLE_LANG } from "../../../../redux/actions";
import swal from "sweetalert";
import { List, ListItem, ListItemText, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GuardianAddModal from "../../../../components/Guardian/Add";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const  EditStudent=(props)=>{
  const[pageLang,setPageLang]=useState(props.language);
  const[langKeywords,setLangKeywords]=useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const[idURL,setIdURL]=useState(null);
  const[vaccineURL,setVaccineURL]=useState(null);
  const[medicalList,setMedicalList]=useState([]);
  const[medicalNew,setMedicalNew]=useState("");
  const[medicineList,setMedicineList]=useState([]);
  const[medicineNew,setMedicineNew]=useState("");
  const[familyID,setFamilyID]=useState("");
  const[famModal,setFamModal]=useState(false);
  const[famIsValid,setFamIsValid]=useState(false);
  const[familyMembers,setFamilyMembers]=useState([]);
  const[guardModal,setGuardModal]=useState(false);
  const[guardiansIsLoading,setGuardiansIsLoading]=useState(false);
  const[guardianData,setGuardianData]=useState({"id":"","Name":"","Comm_Phone":""});
  const [submitting,setSubmitting]=useState(false);
  const[student,setStudent]=useState({});


  
  useEffect(()=>{

    // Page Lang
    const pageLanguage = props.language;

    // All Name

    const { error1Add } = langKeywords[pageLanguage];

    /* start Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    // get language from local storage
    const globalLang = localStorage.getItem("language");
    if (globalLang != null) {
      // when we click update button we should update the update and we need to set language in redux from localstorage
      props.toggleLanguages(globalLang);
    }
    /* end Resole problem when we reload the page and the language is returned to default value in redux [ENGLISH ]*/

    const studentID = props.match.params.id;
    axios
      .get(
        `/student/${studentID}`
      )
      .then((response) => {
        //const id, firstName, lastName, birthDate, birthPlace, phoneNum, sex, tuteur, idURL, vaccineURL;

        //getted student details
        const students = response.data;
        console.log(students);
        const id = students.id;
        const firstName = students.First_Name;
        const lastName = students.Last_Name;

        // birthdate
        var birthDate = students.Birthday;

        if (birthDate === "--") {
          birthDate = {
            day: "",
            month: "",
            year: "",
          };
        } else {
          const splitBirthday = birthDate.split("-");

          birthDate = {
            day: splitBirthday[0],
            month: splitBirthday[1],
            year: splitBirthday[2],
          };
        }

        //birthplace
        const birthPlace = students.Birthplace === null ? "" : students.Birthplace;

        const nationality= students.Nationality === null? "" : students.Nationality;
        const guardian_id= students.id_guardian === null? "" : students.id_guardian;
        const famId= students.id_family === null? "" : students.id_family;
        if(famId!=="")
          setFamilyID("fam_"+famId);
        //sex
        const sex = students.Sex === null ? "" : students.Sex;

        //idURL
        const idURLs =
          students.ID_URL === null
            ? ""
            : process.env.REACT_APP_BACKEND+`project/storage/app/${students.ID_URL}`;
        //vaccineURL
        const vaccineURLs =
          students.ID_URL === null
            ? ""
            : process.env.REACT_APP_BACKEND+`project/storage/app/${students.Vaccine_URL}`;
        let med1=[];
        students.medical.forEach(element => 
        {
          let res=element.Description===null? "":':'+element.Description
          med1.push(element.Name+res);
        });

        setMedicalList(med1);
        let med2=[];
        students.medicine.forEach(element => 
          {
            med2.push(element.Name);
          });
        setMedicineList(med2);
        setStudent({
            id,
            firstName,
            lastName,
            birthDate,
            birthPlace,
            sex,
            nationality,
            guardian_id,
            famId,
            idURLs,
            vaccineURLs,
          }
         );

         setIdURL(idURLs);
         setVaccineURL(vaccineURLs)
         if(guardian_id!=="")
         {axios
          .get(`/guardian/${guardian_id}`)
          .then((response)=>{
            if(response.status===200)
            {
              setGuardianData(response.data);
            }
      });}
      })
      .catch((error) => {
        console.log(error);
        swal(error1Add, { icon: "error" });
      });
  },[]);

  useEffect(()=>{
    
    var famid=familyID.split("_");
    if(famid.length>1){

      axios
      .get("getMembers/"+famid[1])
      .then((response)=>{

        if(response.status===200)
        {
          setFamIsValid(true);
          setFamilyMembers(response.data);

        }
        else
        {
          setFamIsValid(false);
          setFamilyMembers([]);
        }
      });
    }
    else{
      setFamIsValid(false);
      setFamilyMembers([]);
    }
  },[familyID]);


  const setFamily = (value)=>{setFamilyID(value)};
  const openFamModal = ()=>{setFamModal(true)};
  const closeFamModal = ()=>{setFamModal(false)};
  const openGuardModal = ()=>{setGuardModal(true)};
  const closeGuardModal = ()=>{setGuardModal(false)};
  const toogleLoading=()=>{setGuardiansIsLoading(!guardiansIsLoading)}

  const fetchGuardians=(InputValue,callback)=>{
    toogleLoading();
    axios
      .get("/guardians")
      .then((response)=>{
        if(response.status===200)
        {
          toogleLoading();
          callback(response.data);
        }
      })
  };


  
  // Submit Form
  const onSubmit = (values,actions) => {
    setSubmitting(true);
    // Page Lang
      // Language KEywords
    const { updateMessage, successUpdate, error1 } =
    langKeywords[pageLang];
  // date after concat day with month with year [ex 1-1-2008]
  var appendedDate = `${values.birthDate.day}-${values.birthDate.month}-${values.birthDate.year}`;

  var medl=[];
  medicalList.map((item)=>{
    var tiw=item.split(":");
    var des=tiw.length===2?tiw[1]:"";
    medl.push({"Name":tiw[0],"Description":des});
  })
  const famidfi=familyID===""?"":familyID.split("_")[1];
  const student ={
    First_Name  : values.firstName,
    Last_Name : values.lastName,
    Birthday : appendedDate,
    Sex : values.sex,
    Birthplace : values.birthPlace,
    Nationality : values.nationality,
    id_family : famidfi,
    id_guardian : guardianData.id,
    medical : medl,
    medicine : medicineList
  }

  if (values.idURL != "") student["ID_URL"]=values.idURL;
  if (values.vaccineURL != "")
    student["Vaccine_URL"]=values.vaccineURL;
    const studentID = props.match.params.id;
    console.log(student);
    
      swal({
        title: updateMessage,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          axios
            .post(
              `/student/${studentID}`,
              student
            )
            .then((response) => {
              setSubmitting(false);
              actions.setSubmitting(false);
              if (response.status == 200) {
                swal(successUpdate, {
                  icon: "success",
                }).then((response) => {
                  window.location.reload();
                });
              } else {
                swal(error1, {
                  icon: "error",
                });
              }
            })
            .catch((error) => {
              swal(error1, {
                icon: "error",
              });
            });
        }
      });
  };

  const deleteMedical = (index) => () =>
  {
    setMedicalList(medicalList.filter((_, i) => i !== index));
  };

  const deleteMedicine = (index) => () =>
  {
    setMedicineList(medicineList.filter((_, i) => i !== index));
  };

  const formatOptionLabel=(option)=>{
      return(
        <div>
        <div>{option.Name}</div>
        <div>{option.Comm_Phone}</div>
      </div>
      );
  };
  // Inscription Form
  const form = (props) => {
    //days array
    var days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }

    //Years
    var years = [];
    let ye = new Date().getFullYear();
    for (let i = 0; i <= 25; i++) {
      years.push(ye-i);
    }

    // Language KEywords
    const {
      //titlePage,
      name,
      prename,
      birthDate,
      sexLabel,
      phoneNumber,
      classLevel,
      placeOfBirth,
      guardian,
      nationality,
      studentId,
      vaccination,
      update,
      months,
      sex,
    } = langKeywords[pageLang];

    const thema=createTheme();
    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="first-section col-lg-6 col-12">
            
            {/* Student prename */}
            <div className="form-group">
              <label htmlFor="firstName">{prename}</label>
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

           
            {/* Date of birthday  */}
            <div className="form-group birth-date">
              <label htmlFor="firstName">{birthDate}</label>

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
                  {langKeywords[pageLang].months.map(item => {
                    return (
                      <option key={item.value} value={item.name}>
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

            {/*Nationality*/}
            <div className="form-group">
              <label htmlFor="nationality">{nationality}</label>
              <Field
                name="nationality"
                type="text"
                className="form-control"
                id="nationality"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="nationality" />
              </span>
            </div>

            {/* Student Id */}
            <div className="form-group">
              <label htmlFor="idURL">{studentId}</label>
              <input
                name="idURL"
                type="file"
                className="form-control-file w-50 float-left"
                id="idURL"
                accept="image/*"
                placeholder={studentId}
                onChange={(event) => {
                  let img = event.target.files[0];
                  props.setFieldValue("idURL", event.currentTarget.files[0]);
                  setIdURL(URL.createObjectURL(img));
                }}
              />
              <span className="error">
                <ErrorMessage name="idURL" />
              </span>

              <img className="upload-img" src={idURL} />
            </div>
            
            {/*Family ID*/}
          <div className="form-group">
              <label htmlFor="famId">Family ID</label>
              <Field
                name="famId"
                type="text"
                className="form-control"
                id="famId"
                placeholder=""
                autoComplete="off"
                value={familyID}
                onChange={e=>{setFamilyID(e.target.value)}}
              />
              <span className="error">
                <ErrorMessage name="famId" />
              </span>
                <button className="btn btn-primary" onClick={(e)=>{e.preventDefault();openFamModal();}} style={{marginTop:14}}>New Family</button>
                <FamilyAddModal
                  isOpen={famModal}
                  onClose={closeFamModal}
                  setFamily={setFamily}
                />
                {famIsValid && <ThemeProvider theme={thema}><MaterialTable
                  options={{search : false,
                              paging : false,
                              }}
                  columns={[
                    { title: studentId, field: "id" },
                    { title: prename, field: "First_Name" },
                    { title: name, field: "Last_Name" },
                    { title: classLevel, field: "Grade_Name" },
                  ]}
                  data={familyMembers}
                /></ThemeProvider>}
          </div>

            {/* Medical */}
            <div className="form-group">
              <label htmlFor="medical">Medical</label>
              <Field
                className="list_m"
                //component={TextField}
                //style={{width : 300}}
                onBlur={props.handleBlur}
                value={medicalNew}
                onChange={e=>{setMedicalNew(e.target.value)}}/>
                <IconButton style={{position : "relative"}} onClick={()=>{
                  if(medicalNew !=="")
                  {
                    
                  setMedicalList([...medicalList,medicalNew]);
                  setMedicalNew('');
                  }
                }} 
                  ><ArrowForwardIcon /></IconButton>
              <List sx={{ border: 1 }} style={{minHeight : 90}}>
                {
                    medicalList.map((item,key) =>
                    {
                      let keye=key;
                        return(<ListItem
                        key={keye}
                          secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={deleteMedical(keye)}>
                            <DeleteIcon />
                          </IconButton>
                        }>
                          <ListItemText
                                primary={item}
                            />
                        </ListItem>);
                    })
                }
              </List>
              </div>   
          </div>
{/*_________________________________________________________________________________________________________________*/}
          <div className="first-section col-lg-6 col-12">
             {/* Student Name */}
             <div className="form-group">
              <label htmlFor="lastName">{name}</label>
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

            {/* Student sex */}
            <div className="form-group">
              <label htmlFor="sex">{sexLabel}</label>
              <Field
                name="sex"
                id="sex"
                className="form-control"
                component="select"
              >
                <option value=""></option>
                {sex.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {" "}
                      {item.name}
                    </option>
                  );
                })}
              </Field>
              <span className="error">
                <ErrorMessage name="sex" />
              </span>
            </div>

            {/* Place of birthday */}
            <div className="form-group">
              <label htmlFor="birthPlace">{placeOfBirth}</label>
              <Field
                name="birthPlace"
                type="text"
                className="form-control"
                id="birthPlace"
                placeholder=""
                autoComplete="off"
              />
              <span className="error">
                <ErrorMessage name="birthPlace" />
              </span>
            </div>

            {/* Vaccination */}
            <div className="form-group">
              <label htmlFor="vaccineURL">{vaccination}</label>
              <input
                name="vaccineURL"
                type="file"
                className="form-control-file w-50 float-left"
                id="vaccineURL"
                accept="image/*"
                placeholder={vaccination}
                onChange={(event) => {
                  let img = event.target.files[0];
                  props.setFieldValue(
                    "vaccineURL",
                    event.currentTarget.files[0]
                  );
                 setVaccineURL(URL.createObjectURL(img));
                }}
              />
              <span className="error">
                <ErrorMessage name="vaccineURL" />
              </span>

              <img className="upload-img" src={vaccineURL} />
            </div>

            {/*Guardian ID*/}
          <div className="form-group">
              <label htmlFor="guardian_id">{guardian+" ID"}</label>
              <AsyncCreatableSelect
                name="guardian_id"
                id="guardian_id"
                key={guardianData.id}
                value={guardianData}
                isLoading={guardiansIsLoading}
                isSearchable
                isClearable
                defaultOptions
                loadOptions={fetchGuardians}
                formatOptionLabel={e => e.Name + '-' + e.Comm_Phone}
                onChange={(value)=>{setGuardianData(value)}}
                getOptionValue={e => e.id}
              />
              <button className="btn btn-primary" onClick={(e)=>{e.preventDefault();openGuardModal();}} style={{marginTop:14}}>New Guardian</button>
                <GuardianAddModal
                  isOpen={guardModal}
                  onClose={closeGuardModal}
                  setGuardian={setGuardianData}
                />
              <span className="error">
                <ErrorMessage name="guardian_id" />
              </span>
            </div>     

             {/* Medicien */}
            <div className="form-group">
              <label htmlFor="medine">Medicine</label>
              <Field
                className="list_m"
                //component={TextField}
                //style={{width : 300}}
                onBlur={props.handleBlur}
                value={medicineNew}
                onChange={e=>{setMedicineNew(e.target.value)}}/>
                <IconButton style={{position : "relative"}} onClick={()=>{
                  if(medicineNew !=="")
                  {
                    
                  setMedicineList([...medicineList,medicineNew]);
                  setMedicineNew('');
                  }
                }} 
                  ><ArrowForwardIcon /></IconButton>
              <List sx={{ border: 1 }} style={{minHeight : 90}}>
                {
                    medicineList.map((item,key) =>
                    {
                      let keye=key;
                        return(<ListItem
                        key={keye}
                          secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={deleteMedicine(keye)}>
                            <DeleteIcon />
                          </IconButton>
                        }>
                          <ListItemText
                                primary={item}
                            />
                        </ListItem>);
                    })
                }
              </List>
              </div>     
          </div>
{/*_____________________________________________________________________________________________________*/}


          {/* Submit Input*/}
          <div className="form-group col-12">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              id="test"
              disabled={submitting}
            >
              <i className="fa fa-user-plus "></i>
              <span>{update}</span>
            </button>
          </div>
        </div>
      </form>
    );
  };

  // Schema Of Yup
  const schema = () => {

    // Language KEywords
    const { required, number } = langKeywords[pageLang];

    const schema = Yup.object().shape({
      firstName: Yup.string().required(required),
      lastName: Yup.string().required(required),
      // birthPlace: Yup.string().required(required),
      birthDate: Yup.object().shape({
        day: Yup.string().required(required),
        month: Yup.string().required(required),
        year: Yup.string().required(required),
      }),
      //famId: Yup.string().min(12,"tiw").required(required),
      nationality: Yup.string().required(required),
      //guardian_id : Yup.mixed().required(required),
      // sex: Yup.string().required(required),
      // phoneNum: Yup.number()
      //   .typeError(number)
      //   .required(required),
      // tuteur: Yup.string().required(required),
      // vaccineURL: Yup.mixed().required(required),
      // idURL: Yup.mixed().required(required),
    });
    return schema;
  };

  
    // All Name

    const {
      titlePage,
    } = langKeywords[pageLang];

    return (
      <div className="inscription-student">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <div className="title-of-middle">
              <h2>{titlePage}</h2>
            </div>
          </div>

          {/* Start Formik */}
          <Formik
            enableReinitialize={true}
            initialValues={{ ...student, idURL: "", vaccineURL: "" }}
            onSubmit={onSubmit}
            validationSchema={schema}
          >{form}</Formik>
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

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguages: (newLang) =>
      dispatch({ type: TOGGLE_LANG, payload: { lang: newLang } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditStudent);
