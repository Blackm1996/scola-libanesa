import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'
import React,{useState} from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import {Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import * as Yup from "yup";
import axios from 'axios';
import swal from 'sweetalert';

const GuardianAddModal = (props)=>{
    const [submitting,setSubmitting]=useState(false);



    const onSubmit = (values,actions) => {
        setSubmitting(true);
        const guardian ={
            Name:values.name,
            Profession : values.profession,
            Address : values.address,
            Comm_Phone: values.mainCom,
            is_Whats : values.mainComIsWhats,
            phones: values.phonenbs
        }
        console.log(guardian);
        axios
            .post('/addguardian',guardian)
            .then((response)=>{
                if(response.status == 201) {
                    setSubmitting(false);
                    console.log(response);
                    swal("added successfully", {
                        icon: "success"
                      })
                      
                    //props.update();
                    props.setGuardian({"id":response.data.id,"Name":guardian.Name,"Comm_Phone":guardian.Comm_Phone});
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

                        {/*Name*/}
                            <div className="form-group">
                                <label htmlFor="name">name</label>
                                <Field
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="name" />
                                </span>
                            </div>

                        {/*Address*/}
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

                        {/*Profession*/}
                            <div className="form-group">
                                <label htmlFor="profession">Profession</label>
                                <Field
                                    name="profession"
                                    type="text"
                                    className="form-control"
                                    id="profession"
                                    placeholder=""
                                    autoComplete="off"
                                />
                                <span className="error">
                                    <ErrorMessage name="profession" />
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
                                    arrayHelper.push({ Phone_Nb: "", is_Whats:false, })
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
            name : Yup.string().required("Requierd"),
            profession : Yup.string().required("Requierd"),
            address : Yup.string().required("Requierd"),
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
                                <h2>Add Guardian</h2>
                            </div>
                        </div>

                    {/* Start Formik */}
                    <Formik
                        initialValues={{
                            name : '',
                            profession : '',
                            address : '',
                            mainCom: '',
                            mainComIsWhats: false,
                            phonenbs:[{ Phone_Nb: "", is_Whats:false, }],
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
export default GuardianAddModal;