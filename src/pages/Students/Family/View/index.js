import { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import MaterialTable from "material-table";
import { Link, withRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material';
import "./shared/styles/style.css";
const ViewFamily=(props)=>
{
    
    const[familyInfo,setFamilyInfo]=useState({
        Father_Name: "",
        Father_Profession: "",
        Father_Address: "",
        Mother_Name: "",
        Mother_Profession: "",
        Mother_Address: "",
        Comm_Phone: "",
        Comm_Owner: "",
        is_Whats: 0,
        phones: [],
        current_students:[],
        next_year:[],
        others:[],

    });

    const[pdf,setPdf]=useState(null);

    const familyID = props.match.params.id === undefined? "":"fam_"+props.match.params.id;
    useEffect(()=>{console.log(props)},[]);
    useEffect(()=>{
         let pattern = /^fam_[0-9]{8}$/;
         let result = pattern.test(familyID);
         if(result){
           let famid=familyID.split("_");
           axios
           .get("family/"+famid[1])
           .then((response)=>{
             console.log(response);
             if(response.status==200)
             {
              console.log("LENgTH: "+response.data.data.current_students.length );
               setFamilyInfo(response.data.data);
               setPdf(response.data.pdf);
             }
             
           });
         }
         
       },[]);


       const printID = ()=>{
        let binaryString = window.atob(pdf);

                            let binaryLen = binaryString.length;
                            
                            let bytes = new Uint8Array(binaryLen);
                            
                            for (let i = 0; i < binaryLen; i++) {
                                let ascii = binaryString.charCodeAt(i);
                                bytes[i] = ascii;
                            }
                            
                            let blob = new Blob([bytes], {type: "application/pdf"});
                            var blobURL = URL.createObjectURL(blob);
                            window.open(blobURL);
       };


       const MUITabletheme = createTheme({
        palette: {
          primary: {
            main: '#c2b6b4',
          },
          secondary: {
            main: '#ff6347',
          },
        },
        
      });


    return(
        <div className="student-profile">
          <div className="container-fluid">
          {/*  Start title sectio */}
          <div className="col-12 text-center">
            <div className="title-of-middle">
              <h2>Family Profile</h2>
            </div>
          </div>
          <div className="row" >
          <div className="col-md-8 pl-0">
            <div className="card mb-3">
              <div className="card-body">
              <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">ID</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyID}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Father Name</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.Father_Name}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Father Adress</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.Father_Address}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Father Profession</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.Father_Profession}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Mother Name</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.Mother_Name}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Mother Adress</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.Mother_Address}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Mother Profession</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.Mother_Profession}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.Comm_Phone}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">Whatsapp?</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {familyInfo.is_Whats == 1 ? "Yes": "No"}
                  </div>
                </div>
                              
              </div>
              
              
             
              <div className="trash-and-edit">
                <Link
                  to={``}
                >
                  <i className="fa fa-edit" ></i>
                </Link>

                
                {props.role === "admin" && (
                  <i className="fa fa-trash" ></i>
                )}
              </div>
           
            </div>
          </div>
            </div>
            {pdf && <button onClick={printID} style={{marginBottom : 30,paddingLeft:20,paddingRight:20}}>Print ID</button>}

             {familyInfo.current_students.length>0 && <ThemeProvider theme={MUITabletheme}>
                <MaterialTable
                    style={{marginBottom : 30}}
                    options={{search : false,
                                paging : false,
                                showTextRowsSelected: false,
                                //tableLayout: "fixed",
                                }}
                    title={"Current Year students"}
                    columns={[
                      {title: "studentId", field: "id"},
                      {title: "First Name", field: "First_Name"},
                      {title: "Last Name", field: "Last_Name"},
                      {title: "Grade", field: "Grade_Name"},
                    ]}
                    data={familyInfo.current_students}
                  />
              </ThemeProvider>}

              {familyInfo.next_year.length>0 && <ThemeProvider theme={MUITabletheme}>
                <MaterialTable
                    style={{marginBottom : 30}}
                    options={{search : false,
                                paging : false,
                                showTextRowsSelected: false,
                                //tableLayout: "fixed",
                                }}
                    title={"Next Year students"}
                    columns={[
                      {title: "studentId", field: "id"},
                      {title: "First Name", field: "First_Name"},
                      {title: "Last Name", field: "Last_Name"},
                      {title: "Grade", field: "Grade_Name"},
                    ]}
                    data={familyInfo.next_year}
                  />
              </ThemeProvider>}

              {familyInfo.others.length>0 && <ThemeProvider theme={MUITabletheme}>
                <MaterialTable
                    style={{marginBottom : 30}}
                    options={{search : false,
                                paging : false,
                                showTextRowsSelected: false,
                                //tableLayout: "fixed",
                                }}
                    title={"Older Students"}
                    columns={[
                      {title: "studentId", field: "id"},
                      {title: "First Name", field: "First_Name"},
                      {title: "Last Name", field: "Last_Name"},
                    ]}
                    data={familyInfo.others}
                  />
              </ThemeProvider>}

            </div>
        </div>
    );
}


const mapStateToProps = (state) => {
    return {
      language: state.language,
    };
  };
  
  export default connect(mapStateToProps)(ViewFamily);