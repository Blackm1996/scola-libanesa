import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';
import React, { useState } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";

import * as Yup from "yup";
import axios from 'axios';
import swal from 'sweetalert';

const FamilyAddModal = (props)=>{
    const [submitting,setSubmitting]=useState(false);


    const onSubmit = (values,actions) => {
        setSubmitting(true);
        const family ={
            Father_Name:values.fatherName,
            Father_Profession : values.fatherProfession,
            Father_Address : values.fatherAddress,
            Mother_Name: values.motherName,
            Mother_Profession: values.motherProfession,
            Mother_Address: values.motherAddress,
            Comm_Phone: values.mainCom,
            Comm_Owner: values.mainComOwner,
            is_Whats : values.mainComIsWhats,
            phones: values.phonenbs
        }
        console.log(family);
        axios
            .post('/addfamily',family)
            .then((response)=>{
                if(response.status == 201) {
                    setSubmitting(false);
                    console.log(response);
                    swal("added successfully", {
                        icon: "success",
                        buttons : {
                            printpdf:{
                                text : "Print Identification",
                                value : "print",
                            },
                        },
                      })
                      .then((value)=>{
                          if(value==="print")
                          {
                            let binaryString = window.atob(response.data.pdf);

                            let binaryLen = binaryString.length;
                            
                            let bytes = new Uint8Array(binaryLen);
                            
                            for (let i = 0; i < binaryLen; i++) {
                                let ascii = binaryString.charCodeAt(i);
                                bytes[i] = ascii;
                            }
                            
                            let blob = new Blob([bytes], {type: "application/pdf"});
                            var blobURL = URL.createObjectURL(blob);
                            window.open(blobURL);
                            /*let link = document.createElement('a');
                            
                            link.href = window.URL.createObjectURL(blob);
                            link.download = response.data.id;
                            
                            link.click();*/
                            
                           /* let iframe =  document.createElement('iframe'); //load content in an iframe to print later
                            document.body.appendChild(iframe);

                            iframe.style.display = 'none';
                            iframe.src = blobURL;
                            iframe.onload = function() {
                                setTimeout(function() {
                                    iframe.focus();
                                    iframe.contentWindow.print();
                                }, 1);
                                };*/
                          }
                      })
                    props.setFamily('fam_'+response.data.id);
                    actions.setSubmitting(false);
                    props.onClose();
                }else {
                    setSubmitting(false);
                    swal(
                       "error1\n"+response,
                      {
                        icon: "error",
                      }
                    );
                  }
            })
            .catch((error) => {
                setSubmitting(false);
                swal(
                 ' error2'+error,
                  {
                    icon: "error",
                  }
                );
              });
        
    };

    const form = (props) => {
        return(
            <form onSubmit={(props.handleSubmit)}>
                <div className='add-family'>
                <div className='row'>
{/*________________________Father_______________________________________________________________________________________*/}
                    <div className="first-section col-lg-6 col-12">

                        {/*Father Name*/}
                            <div className="form-group">
                                <label htmlFor="fatherName">Father Name</label>
                                <Field
                                    name="fatherName"
                                    type="text"
                                    className="form-control"
                                    id="fatherName"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="fatherName" />
                                </span>
                            </div>

                        {/*Father Address*/}
                            <div className="form-group">
                                <label htmlFor="fatherAddress">Father Address</label>
                                <Field
                                    name="fatherAddress"
                                    type="text"
                                    className="form-control"
                                    id="fatherAddress"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="fatherAddress" />
                                </span>
                            </div>

                        {/*Father Profession*/}
                            <div className="form-group">
                                <label htmlFor="fatherProfession">Father Profession</label>
                                <Field
                                    name="fatherProfession"
                                    type="text"
                                    className="form-control"
                                    id="fatherProfession"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="fatherProfession" />
                                </span>
                            </div>
                    </div>
{/*________________________Mother_______________________________________________________________________________________*/}
                    <div className="first-section col-lg-6 col-12">

                        {/*Mother Name*/}
                        <div className="form-group">
                                <label htmlFor="motherName">Mother Name</label>
                                <Field
                                    name="motherName"
                                    type="text"
                                    className="form-control"
                                    id="motherName"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="motherName" />
                                </span>
                            </div>

                        {/*Mother Address*/}
                            <div className="form-group">
                                <label htmlFor="motherAddress">Mother Address</label>
                                <Field
                                    name="motherAddress"
                                    type="text"
                                    className="form-control"
                                    id="motherAddress"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="motherAddress" />
                                </span>
                            </div>

                        {/*Mother Profession*/}
                            <div className="form-group">
                                <label htmlFor="motherProfession">Mother Profession</label>
                                <Field
                                    name="motherProfession"
                                    type="text"
                                    className="form-control"
                                    id="motherProfession"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="motherProfession" />
                                </span>
                            </div>
                    </div>
                </div>
 {/*_______________________________________________________________________________________________________________________ */}
                    {/*Main Phone */}               
                    <fieldset>
                        <legend>Main Communication Phone</legend>
                        <div className='form-group'>
                            <label htmlFor='mainCom'>Phone Number</label>
                            <Field
                                name="mainCom"
                                type="text"
                                className="form-control"
                                id="mainCom"
                                autoComplete='off'/>
                            <span className="error">
                                <ErrorMessage name="mainCom" />
                            </span>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='mainComOwner'>Owner
                                <Field
                                    name='mainComOwner'
                                    id='mainComOwner'
                                    className="form-control"
                                    component="select"
                                    style={{with:50}}
                                    placeholder="Owner"
                                    >
                                        <option value="Father" selected={true}>Father</option>
                                        <option value="Mother">Mother</option>
                                </Field>
                                </label>
                            </div>
                            <div className='form-group'>
                            <label>Whatsapp?</label>
                            <Field
                                name="mainComIsWhats"
                                type="checkbox"
                                />
                        </div>
                    </fieldset>
 {/*_______________________________________________________________________________________________________________________ */}
                    {/* Phones */} 
                    <fieldset>
                        <legend>Phone numbers</legend>
                        <FieldArray
                            name="phonenbs"
                            render={(arrayHelper) => (
                                <div className="add-phone">
                                    {props.values.phonenbs.map((item, index) => (
                                        <div key={index}>
                                            <label htmlFor={`phonenbs.${index}.Phone_Nb`}>
                                                phone {index + 1} :
                                            </label>
                                        {/* Phone Nb*/}
                                        <div className="form-group">
                                            <Field
                                            id={`phonenbs.${index}.Phone_Nb`}
                                            name={`phonenbs.${index}.Phone_Nb`}
                                            className="form-control"
                                            placeholder='number'
                                            autoComplete="off"
                                            />
                                            <span className="error">
                                                <ErrorMessage
                                                className="error"
                                                name={`phonenbs.${index}.Phone_Nb`}
                                                />
                                            </span>
                                        </div>
                                        {/* Phone Owner*/}
                                        <div className='form-group'>
                                            <label htmlFor={`phonenbs.${index}.Owner_Type`}>Owner
                                                <Field
                                                name={`phonenbs.${index}.Owner_Type`}
                                                id={`phonenbs.${index}.Owner_Type`}
                                                className="form-control"
                                                component="select"
                                                style={{with:50}}
                                                placeholder="Owner"
                                                
                                                >
                                                    <option value="Father">Father</option>
                                                    <option value="Mother">Mother</option>
                                                </Field>
                                            </label>
                                        </div>
                                    <div className='form-group'>
                                        <label>Whatsapp?</label>
                                        <Field
                                            name={`phonenbs.${index}.is_Whats`}
                                            type="checkbox"
                                        />
                                    </div>

                                        <button
                                            type="button"
                                            className="btn btn-primary minus"
                                            onClick={() => arrayHelper.remove(index)}
                                        >
                                            <i className="fa fa-minus fa-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            <button
                                type="button"
                                className="btn btn-primary plus"
                                onClick={() =>
                                    arrayHelper.push({ Phone_Nb: "", Owner_Type: "Father", is_Whats:false, })
                                }
                            >
                            {" "}
                            +{" "}
                            </button>
                        </div>
                        )}
                        />
                    </fieldset>
                <div className="form-group col-12">
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        id="test"
                        disabled={submitting}
                    >
                        <i className="fa fa-user-plus "></i>
                        <span>add</span>
                    </button>
                </div>
                </div>
            </form>
        );
    };
    const schema = ()=>{
        const schema = Yup.object().shape({
            fatherName : Yup.string().required("Requierd"),
            fatherProfession : Yup.string().required("Requierd"),
            fatherAddress : Yup.string().required("Requierd"),
            motherName : Yup.string().required("Requierd"),
            motherProfession : Yup.string().required("Requierd"),
            motherAddress : Yup.string().required("Requierd"),
            mainCom : Yup.string().required("Requierd"),

        });
        return schema;
    };

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            fullWidth="true"
            maxWidth="lg"
        >
            <DialogContent>
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
                            phonenbs:[{ Phone_Nb: "", Owner_Type: "Father", is_Whats:false, }],
                        }}
                        
                        onSubmit={onSubmit}
                        validationSchema={schema}
                    >{form}</Formik>
                {/* End Formik */}
                </div>
            </div>
            </DialogContent>
        </Dialog>
    );
}
export default FamilyAddModal;