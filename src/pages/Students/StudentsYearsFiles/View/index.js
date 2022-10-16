/* Readable Scalable Secure */
import { useEffect, useState,useRef } from "react";
import Select from "react-select";
import "./style.css";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "../Add/LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import axios from "axios";
import { getYears } from "../../../../Api/Payments";
import swal from "sweetalert";

const ViewInscription=(props)=>
{
  const [idStudent,setIdStudent]=useState(props.match.params.id);
  const [schoolYear,setSchoolYear]=useState(props.schoolYear);
  const [loading,setLoading]=useState(true);
  const [inscriptionYears,setInscriptionYears]=useState([]);
  const [inscriptionDetails,setInscriptionDetails] = useState({
    inscriptionTax: "",
    booksUniformTotal: "",
    monthTotalPay: "",
    monthStart: "",
    gradeName: "",
    sectionName: "",
    attending: -1,
  });
  const [langKeywords,setLangKeywords]=useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });

  useEffect(()=>{
    axios
    .get(`/studentFileYear/${idStudent}/${schoolYear}`)
    .then((response)=>{
        setInscriptionDetails({
          inscriptionTax:response.data.Inscription_Tax,
          booksUniformTotal:response.data.Books_Uniform_total,
          monthTotalPay:response.data.Monthly_Total,
          monthStart:response.data.Month_Start,
          gradeName:response.data.gradeName,
          sectionName:response.data.sectionName,
          attending:response.data.attending,
        })
    });
  },[schoolYear]);

  useEffect(()=>{
    console.log("propsINsc",props);
    getYears(idStudent)
    .then((response) => {
      if (response.status === 200)
      {
        setInscriptionYears(response.data);
        setSchoolYear(response.data[response.data.length-1]["School_Year"]);
        setLoading(false);
        //console.log(response.data[response.data.length-1])
        
      }
    })
    .catch((error) => {
      //window.location.reload();
    });
  },[]);

  const onDropdownChange = (e) => {
    setSchoolYear(e.value);
  }

  const kikckout_resume = () =>{
    swal({
      title: inscriptionDetails.attending === 1 ?"Are you sure you want to kick this student out?":"Are you sure you want to bring this student back?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if(willDelete)
      {
        const data={
          id_student: idStudent,
          attendance:inscriptionDetails.attending=== 1 ? 0:1,
        };
        console.log(data);
        axios
        .post('/attendanceChange',data)
        .then((response) => {
          if (response.status === 200) {
            setInscriptionDetails({
              ...inscriptionDetails,
              attending:inscriptionDetails.attending === 1 ? 0:1,
            });
            swal(inscriptionDetails.attending === 1? "Student Rejoined class":"Student kicked out of class", {
              icon: "success",
            });
          }
        })
        .catch((error) => {
          swal("ERROR", {
            icon: "error",
          });
        });
      }
    });
    
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isDisabled ? "red" : "tomato",
      fontSize: 13,
      color: state.isFocused ? "#fff" : "#958282",
      backgroundColor: state.isFocused ? "tomato" : "transparent",
      cursor: "pointer",
    }),
    singleValue: (provided, state) => {
      const color = state.isDisabled ? "#958282" : "#958282";
      const transition = "opacity 300ms";

      return { ...provided, color, transition };
    },
    control: (base) => ({
      ...base,
      fontSize: 13,
      marginBottom: 7,
    }),
  };

  // page language
  const pageLanguage = props.language;
  const { grade, section, inscriptionTitle,
    inscriptionTax,
    booksUniformTotal,
    monthTotalPay,
    discount,
    startOfPayment, } =langKeywords[pageLanguage];

  // years of select
  //years option
  var years = [],
    year = "";

  for (var i = 0; i < inscriptionYears.length; i++) {
    year =inscriptionYears[i]["School_Year"];
    years.push({ value: year, label: year });
  }
  return loading === true ? (
    <div className="loading">loading ... </div>
  ) : (

    <div className="edit-inscription">
    <div className="container-fluid">
    {/*  Start title sectio */}
    <div className="col-12 text-center">
      <div className="title-of-middle">
        <h2>{inscriptionTitle}</h2>
      </div>
      <div className="select-container w-100">
              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select Year"
                  defaultValue={{
                    label: `${schoolYear}`,
                    value: `${schoolYear}`,
                  }}
                  value={{
                    label: `${schoolYear}`,
                    value: `${schoolYear}`,
                  }}
                  options={years}
                  styles={customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "hotpink",
                      primary: "#ff634766",
                    },
                  })}
                  onChange={onDropdownChange}
                />
                
              </div>
              
            </div>
    </div>

    {inscriptionDetails.attending>=0 && <div className="form-group text-center mx-auto col-lg-6 col-12 pl-2 m-b-20">
          <div className={inscriptionDetails.attending===1?"p-2 bg-success text-white":
                                "p-2 bg-danger text-white"}>
                                  {inscriptionDetails.attending===1? "Attending":"OUT"}
          </div>
          </div>}
          <div className="w-100" style={{marginTop:55,marginLeft:290}}>
          <div className="row p-2" >
          <div className="col-md-8 pl-0">
            <div className="card mb-3">
              <div className="card-body">
              <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{grade}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {inscriptionDetails.gradeName}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{section}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {inscriptionDetails.sectionName}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{startOfPayment}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {inscriptionDetails.monthStart}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{monthTotalPay}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {inscriptionDetails.monthTotalPay}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{inscriptionTax}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {inscriptionDetails.inscriptionTax}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-4">
                    <h6 className="mb-0">{booksUniformTotal}</h6>
                  </div>
                  <div className="col-sm-8 text-secondary">
                    {inscriptionDetails.booksUniformTotal}
                  </div>
                </div>
                              
              </div>

            </div>
          </div>
        </div>
        </div>
        {inscriptionDetails.attending>=0 && <div className="mx-auto col-lg-6 col-12 pl-2">
            <button style={inscriptionDetails.attending===1? {backgroundColor:'#F93154',color:'#FBFBFB'}:{backgroundColor:'#00B74A',color:'#FBFBFB'}}
                  onClick={kikckout_resume}>{inscriptionDetails.attending===1? 'Kick out':'Attend Again'} </button>
          </div>}
    </div>
    </div>
  );
}


const mapStateToProps = (state) => {
    return {
      language: state.language,
      schoolYear: state.schoolYear,
    };
  };
  
  export default connect(mapStateToProps)(ViewInscription);