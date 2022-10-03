import React, { useEffect, useState, } from "react";
// import languages
import { ENGLISH, FRENCH, PORTO } from "../../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import Select from "react-select";
import BillsModal from "../../../components/BillsModal";
import { getYears, getBills } from "../../../Api/Payments";
import "./style.css";
import swal from "sweetalert";
import { ThemeProvider } from "styled-components";
import { Button } from "@mui/material";
import axios from "axios";

const View =(props)=> {
  const[showTable,setShowTable] =useState(false);
  const[modalVis,setModalVis] =useState(false);
  const[langKeywords,setLangKeywords] =useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const[monthSelected,setMonthSelected]=useState();
  const[yearSelected,setYearSelected]=useState();
  const[type,setType]=useState("Monthly");
  const[years,SetYears]=useState([]);
  const[bills,SetBills]=useState();
  const[other,SetOther]=useState();



  useEffect(()=>{
    loadBills();
  },[yearSelected]);

  useEffect(()=>{

    getYears(props.match.params.id)
      .then((response) => {
        if (response.status === 200)
        {
            SetYears(response.data);
            setYearSelected(response.data[response.data.length-1]["School_Year"]);
        }
        else swal("there is a error, please refresh page", { icon: "error" });
      })
      .catch((error) => {
        swal("there is a error, please refresh page", { icon: "error" });
        //window.location.reload();
      });

  },[]);



  const loadBills = () =>{
    yearSelected !=="" & yearSelected!== undefined &&
    getBills(props.match.params.id, yearSelected) // e.value is year selected
        .then((response) => {
          if (response.status == 200) {
            if (response.data.startMonth != null) {
              SetBills(response.data.bills);
              SetOther(response.data.other);
              setShowTable(true);
            }
          } else
            swal("there is a error, please try again ..", { icon: "error" });
        })
        .catch((error) => {
          swal("there is a error, please try again ..", { icon: "error" });
        });
  }
  //show bills when we click on  month
  const showBills = (type,month) => {
    console.log(type);
    setMonthSelected(month);
    setType(type);
    setModalVis(!modalVis);
  };

  //custom stlyes
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

  //close modal
  const closeModal = () => {
    setModalVis(false);
  };

  //show modal
  const toggleModalVis = () => {
    setModalVis(!modalVis)

  };

  //onDropdownChange
  const onDropdownChange = (e) => {
    setYearSelected(e.value);
  };

  const pardonRest = (bill)=>{
    let titleo="Pardon "+ bill.theRest+" xCfa from "+(bill.month? "Month "+bill.month : bill.type);
    swal({
      title:titleo ,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate)
      {
        const data = {
          School_Year:yearSelected,
          id_student:props.match.params.id,
          Type:bill.month? "Monthly":bill.type,
          paymentType:"pardoned",
          Month:bill.month? bill.month:0,
          Amount:bill.theRest
        };
        console.log(data);
        axios
        .post('/bills',data)
        .then((response)=>{
          if(response.status === 201)
          {
            swal("successAdd", {
              icon: "success",
            }).then(()=>{window.location.reload(true);})
          }
          else
          {
            swal("error1Add", {
              icon: "error",
            })
          }
        })
        .catch((error) => {
          swal("error1Add", {
            icon: "error",
          })});
      }
    })
    
  };
    //years option
    var yearsOptions = [],
      year = "";

    for (var i = 0; i < years.length; i++) {
      year = years[i]["School_Year"];
      yearsOptions.push({ value: year, label: year });
    }

    // Page Lang
    const pageLanguage = props.language;

    // Language KEywords
    const {
      title,
      month,
      total,
      paidAmount,
      rest,
      status,
      completed,
      insertYear,
    } = langKeywords[pageLanguage];

    let btnshown=false;
    return (
      <div className="view-bills">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">{title}</h2>

            {/* Start Bills Modal section */}
            {modalVis ? (
              <BillsModal
                id={props.match.params.id} // id student
                yearSelected={yearSelected} // year selected
                monthSelected={monthSelected} // month selected
                type={type}
                closeModal={closeModal}
                toggleModalVis={toggleModalVis}
              />
            ) : null}
            {/* End Bills Modal section */}

            {/* Start select search */}
            <div className="select-container w-100">
              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select year"
                  defaultValue={{ value: yearSelected, label: yearSelected }}
                  value={{ value: yearSelected, label: yearSelected }}
                  options={yearsOptions}
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
          <div className="row">
            <div className="add-grade col-lg-6 col-12">

              {/* start INscBookUni table*/}
              {showTable ? (
                <div style={{ "overflow-x": "auto" , marginBottom:50}}>
                  <table className="bills-table">
                    <thead>
                      <tr style={{ cursor: "pointer" }}>
                        <th>Type</th>
                        <th>{total}</th>
                        <th>{paidAmount}</th>
                        <th>Pardoned</th>
                        <th>{rest}</th>
                        <th>{status}</th>
                      </tr>
                    </thead>
                    {other.length === 0 ? (
                      <div>empty</div>
                    ) : (
                      other.map((bill, index) => (
                        <tr
                          key={index}
                          onClick={() => showBills(bill.type,bill.month)}
                        >
                          <td>{bill.type}</td>
                          <td>{bill.totalCost}</td>
                          <td>{bill.payed}</td>
                          <td>{bill.pardoned}</td>
                          <td>{bill.theRest}</td>
                          <td>
                            {bill.status === "true" ? (
                              <span
                                style={{ color: "#0f660fbd", fontSize: "13px" }}
                              >
                                <i className="fa fa-check"></i> {completed}
                              </span>
                            ) : (
                              <span
                                style={{ color: "#ff600299", fontSize: "15px" }}
                              >
                                <i className="fa fa-spinner fa-lg"></i>
                              </span>
                            )}
                          </td>
                          <td style={{border:0}} onClick={(e)=>{e.stopPropagation();}}>
                            {bill.status === "false" ? (<button onClick={()=>{pardonRest(bill)}}>Pardon</button>) : (<div></div>) }
                          </td>
                        </tr>
                      ))
                    )}
                  </table>
                </div>
              ) : (
                <div>{insertYear}</div>
              )}
              {/* end INscBookUni table */}

              {/* start payments table*/}
              {showTable ? (
                <div style={{ "overflow-x": "auto" }}>
                  <table className="bills-table">
                    <thead>
                      <tr style={{ cursor: "pointer" }}>
                        <th>{month}</th>
                        <th>{total}</th>
                        <th>{paidAmount}</th>
                        <th>Pardoned</th>
                        <th>{rest}</th>
                        <th>{status}</th>
                      </tr>
                    </thead>
                    {bills.length === 0 ? (
                      <div>empty</div>
                    ) : (
                      bills.map((bill, index) => (
                        <tr
                          key={index}
                          onClick={() => showBills("Monthly",bill.month)}
                        >
                          <td>{bill.month}</td>
                          <td>{bill.totalCost}</td>
                          <td>{bill.payed}</td>
                          <td>{bill.pardoned}</td>
                          <td>{bill.theRest}</td>
                          <td>
                            {bill.status === "true" ? (
                              <span
                                style={{ color: "#0f660fbd", fontSize: "13px" }}
                              >
                                <i className="fa fa-check"></i> {completed}
                              </span>
                            ) : (
                              <span
                                style={{ color: "#ff600299", fontSize: "15px" }}
                              >
                                <i className="fa fa-spinner fa-lg"></i>
                              </span>
                            )}
                          </td>
                          <td style={{border:0}} onClick={(e)=>{e.stopPropagation();}}>
                            {!btnshown && bill.status === "false" ? (<button onClick={()=>{pardonRest(bill)}}>Pardon</button>) : (<div></div>) }
                            {btnshown= btnshown || (!btnshown && bill.status === "false") ? true:false}
                          </td>
                        </tr>
                      ))
                    )}
                  </table>
                </div>
              ) : (
                <div>{insertYear}</div>
              )}
              {/* end payments table */}
            </div>
          </div>
        </div>
      </div>
    );
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    schoolYear: state.schoolYear,
    role: state.role,
  };
};
export default connect(mapStateToProps)(View);
