import { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import swal from "sweetalert";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { addPayment, getYears, getStudent } from "../../../Api/Payments";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme, Checkbox } from '@mui/material';
import NumberFormat from 'react-number-format';
import { useParams } from "react-router-dom";


import "./shared/styles/style.css";

const AddFamilyBills = (props)=>
{
    const[selectedYear,setSelectedYear]=useState("");
    const[inscriptionYears,setInscriptionYears]=useState([]);
    const[familyID,setFamilyID]=useState(props.familyID === undefined? "":props.familyID);
    const[famIsValid,setFamIsValid]=useState(false);
    const[familyMembers,setFamilyMembers]=useState([]);
    const[billers,setBillers]=useState([]);
    const[billType,setBillType]=useState("Monthly");
    const[totalAmount,setTotalAmount]=useState(0);
    const[monthsNb,setMonthsNb]=useState(1);
    const[monthlyLess,setMonthlyLess]=useState(false);
    const[startMonth,setStartMonth]=useState(0);
    const[paymentType,setPaymentType]=useState("cash");
    const [submitting,setSubmitting]=useState(false);

    const selectTableRef= useRef();

    const {familyID:famID} =useParams();

    useEffect(()=>{
      
      if(billType==="Monthly")
      {
        calculateTotal(monthsNb);
      }
      else
      {
        let total=0;
        billers.forEach((biller)=>
        {
          total+=Number(biller.paying);
        });
        setTotalAmount(total);
      }
    },[billers])
    useEffect(()=>{
       console.log("props:"+JSON.stringify(props));
        let pattern = /^fam_[0-9]{8}$/;
        let result = pattern.test(familyID);
        setBillers([]);
        if(result){
          let famid=familyID.split("_");
          axios
          .get("getFinance/"+selectedYear+"/"+famid[1])
          .then((response)=>{
            console.log(response);
            if(response.status==200)
            {
              setFamIsValid(true);
              setFamilyMembers(response.data);
              //console.log(familyMembers);
              setMonthlyLess(false);
            }
            else
            {
              setFamIsValid(false);
              setFamilyMembers([]);
              setMonthlyLess(false);
            }
          });
        }
        else{
          setFamIsValid(false);
          setFamilyMembers([]);
          setMonthlyLess(false);
        }
        
      },[familyID,selectedYear]);
      const studentID = props.match.params.id;
    useEffect(()=>{
    axios
        .get("/schoolYear")
        .then((response) => {
                //console.log(response.data.school_year);
                setSelectedYear(response.data.school_year);
            })
      .catch((error) => {
        swal("ERROR", { icon: "error" });
        //window.location.reload();
      });
    },[]);
   
    useEffect(()=>{
      setFamilyID("fam_"+famID);
      axios
      .get('/getAllYears')
      .then((response) => {setInscriptionYears(response.data)})
      .catch((error) => {
        swal("ERROR", { icon: "error" });
        //window.location.reload();
      });
    },[])
    
    
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

      const onDropdownChange = (e) => {
          setSelectedYear(e.value);        
      };

      const disableRow=(row)=>{
        switch (billType){
          case "BooksUniforms": return row['Books/Uniform_Rest']===0;
          case "Inscription": return row.Inscription_Rest===0;
          default:return (row.Rest === 0||(startMonth!=0 && row.Pay_Start!=startMonth));
        }
        
        //return true;

      };
      const onBillTypeChange = (e) => {
        setBillType(e.value);
        selectTableRef.current.onAllSelected(false)
        setMonthlyLess(false);
        var temp=[];
        for(i=0;i<billers.length;i++){
            var da={...billers[i]};
            da.pardoned=false;
            switch (billType){
                case "BooksUniforms":{da.paying = da.Books_Uniform_Rest; break;}
                case "Inscription":{da.paying = da.Inscription_Rest; break;}
                default:{da.paying = da.Monthly_Total;break;}
            }
            temp.push(da);
        }
        setBillers(temp);     
    };

    const onPayementTypeChange = (e) =>{
      setPaymentType(e.value);
    }

    const calculateTotal = (m)=>
    {
      let total=0;
      billers.map((bill)=>{
        total+=bill.fmpaying;
        total+=(bill.paying*(m-1));
      })
      //console.log(total);
      setTotalAmount(total);
    }
    const handleNBMonthChange = (e)=>
    {
      console.log(e.target.value);
      console.log(startMonth);
      let m=Number(e.target.value)>=0?Number(e.target.value):0;
      if(startMonth>=9)
      {
        if(m+startMonth>19)
          m=19-startMonth;
      }
      else
        if(m+startMonth>7)
          m=7-startMonth;
      setMonthsNb(m);
      calculateTotal(m);
      
    };

    /*const handlePriceChange = (values, sourceInfo) =>{
      
        if(sourceInfo.event!==null)
        {
          setTotalAmount(values.floatValue);
            let nbMonths=1;
            let fmonth=0;
            let mn=0;
            billers.forEach((bill)=>{
                fmonth+=bill.fmpaying;
                mn+=bill.paying;
            })
            let total=values.floatValue;
            if(total>fmonth)
              {
                total-=fmonth;
                setLastMonthRest(0);
              }
              else
              {
                setLastMonthRest(fmonth-total);
                total=-1;
              }
            while(total>0)
            {
              nbMonths++;
              if(total>=mn)
              {
                total-=mn;
                setLastMonthRest(0);
              }
              else
              {
                setLastMonthRest(mn-total);
                total=-1;
              }
              if(total===0)
                setLastMonthRest(0);
            }
            setMonthsNb(nbMonths);
        }
    };*/

    const submit = ()=>{
        setSubmitting(true);
        /*console.log("less? "+monthlyLess)
        console.log("number of months: "+monthsNb)
        console.log("Total Amount: "+totalAmount);
        console.log(billers);*/

        let data=[];
        let name="";
        let grade="";
        let description="";
        switch (billType)
        {
            case "Inscription" :{
              description="Inscrição";
              billers.forEach(biller => {
                name+=biller.First_Name+" "+biller.Last_Name+" ,";
                grade+=biller.Grade_Name+", ";
                data.push({
                  School_Year:selectedYear,
                  id_student:biller.id,
                  Type:billType,
                  paymentType:paymentType,
                  Month:0,
                  Amount:biller.paying
                });
                if(monthlyLess && biller.pardoned)
                {
                  let am = biller.Inscription_Rest-biller.paying;
                  if(am > 0)
                  {
                    data.push({
                      School_Year:selectedYear,
                      id_student:biller.id,
                      Type:billType,
                      paymentType:"pardoned",
                      Month:0,
                      Amount:biller.Inscription_Rest-biller.paying
                    })
                  }
                  
                }
              });
              break;
            }
            case "BooksUniforms" :{
              description="Livros e Uniforms";
              billers.forEach(biller => {
                name+=biller.First_Name+" "+biller.Last_Name+", ";
                grade+=biller.Grade_Name+", ";
                data.push({
                  School_Year:selectedYear,
                  id_student:biller.id,
                  Type:billType,
                  paymentType:paymentType,
                  Month:0,
                  Amount:biller.paying
                });
                if(monthlyLess && biller.pardoned)
                {
                  let am = biller['Books/Uniform_Rest']-biller.paying;
                  if(am > 0)
                  {
                    data.push({
                    School_Year:selectedYear,
                    id_student:biller.id,
                    Type:billType,
                    paymentType:"pardoned",
                    Month:0,
                    Amount:biller['Books/Uniform_Rest']-biller.paying
                    })
                  }
                  
                }
              });
              break;
            }
            default :{
              const months = {1:'janeiro',	2:'fevereiro',3:'março',4:'abril',5:'maio',6:'junho',9:'setembro',10:'outubro',11:'novembro',12:'dezembro'};
              description="Mensalidade: "
              let month=startMonth;
              for(i=0;i<monthsNb;i++)
              {
                description+=months[month]+", ";
                month++;
                if(month>12)
                  month=1;
              }
              let fmonth=0;
              let mn=0;
              billers.forEach((biller)=>{
                  name+=biller.First_Name+" "+biller.Last_Name+", ";
                  grade+=biller.Grade_Name+", ";
                  fmonth+=biller.fmpaying;
                  mn+=biller.paying;
              })
      
              billers.forEach(biller => {
                
                let month=biller.Pay_Start;
                data.push({
                  School_Year:selectedYear,
                  id_student:biller.id,
                  Type:billType,
                  paymentType:paymentType,
                  Month:month,
                  Amount:biller.fmpaying
                });
                if(biller.pardoned && biller.fmpaying<biller.Rest)
                {
                  let am = biller.Monthly_Total-biller.paying;
                  if(am > 0)
                  {
                    data.push({
                      School_Year:selectedYear,
                      id_student:biller.id,
                      Type:billType,
                      paymentType:"pardoned",
                      Month:month,
                      Amount:biller.Monthly_Total-biller.paying
                      });
                  } 
                }
                for(i=1;i<monthsNb;i++)
                {
                  month++;
                  data.push({
                    School_Year:selectedYear,
                    id_student:biller.id,
                    Type:billType,
                    paymentType:paymentType,
                    Month:month,
                    Amount:biller.paying
                  });
                  if(monthlyLess && biller.pardoned)
                  {
                    let am = biller.Monthly_Total-biller.paying;
                    if(am > 0)
                    {
                      data.push({
                        School_Year:selectedYear,
                        id_student:biller.id,
                        Type:billType,
                        paymentType:"pardoned",
                        Month:month,
                        Amount:biller.Monthly_Total-biller.paying
                        });
                    }
                    
                  }

                }

              });}
        }
        let fatura={
          School_Year:selectedYear,
          id_family:Number(familyID.split("_")[1]),
          Amount:totalAmount,
          Students:name,
          Classes:grade,
          Description:description,
        };
        const body={"data":data,"fatura":fatura}
        console.log(body);
        axios
            .post('/familyBill',body)
            .then((response)=>{
                if(response.status == 201) {
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
                            
                          }
                          window.location.reload(true);
                      })
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

/*_____________________________________________________________________________________________________*/
      //Year Options
      const defaultYearValue = {mvalue: selectedYear, label: selectedYear };
      var years = [],
      year = "";
    for (var i = 0; i < inscriptionYears.length; i++) {
      year = inscriptionYears[i];
      years.push({ value: year, label: year });
    }
      //console.log(years);
      
/*____________________________________________________________________________________________________-*/
    //Payement Options
      var paymentOptions=[{label:"Cash", value:"cash"},
                          {label:"Bank Transfer", value:"bank_transfer"},
                          {label:"Check", value:"check"},
                          {label:"Orange Money", value:"orange_money"},];
      const defaultPaymentValue = {label:paymentType, value:paymentType};
/*_____________________________________________________________________________________________________*/
      //Bill Options
      var billOptions = [{label: "Monthly", value: "Monthly"},
                            {label: "Inscription Tax", value: "Inscription"},
                            {label: "Books and Uniforms", value: "BooksUniforms"}];
      
      const defaultBillValue = {label: billType, value: billType};
/*____________________________________________________________________________________________________-*/

    const paymentForm = () =>{
        switch (billType)
        {
            case "Inscription" :{
                return(
                  <div>
                    <ThemeProvider theme={MUITabletheme}><MaterialTable
                    style={{marginBottom : 25}}
                    options={{search : false,
                                paging : false,
                                showTextRowsSelected: false,
                                //tableLayout: "fixed",
                                toolbar: false
                                }}
                    columns={[
                        { title: "studentId", field: "id", editable:'never',align: 'center' },
                        { title: "prename", field: "First_Name" , editable:'never' ,align: 'center'},
                        { title: "Inscription Tax", field: "Inscription_Tax", editable:'never' ,align: 'center'},
                        { title: "Rest", field: "Inscription_Rest", type:"numeric", editable:'never',align: 'center'},
                        { title: "Pay", field: "paying", type:"numeric", align: 'center'},
                        { title: "Pardon?", field: "pardoned", type:"boolean",hidden:!monthlyLess, align: 'center',
                        editComponent: props => (
                          <Checkbox
                            value={props.value}
                            onChange={e => props.onChange(e.target.value)}
                          />
                        )}
                        
                    ]}
                    data={billers}
                    
                    cellEditable={{
                       cellStyle:{width: "20%"},
                        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                            return new Promise((resolve, reject) => {
                                var temp=[];
                                
                                for(i=0;i<billers.length;i++){
                                    var da={...billers[i]};
                                    if(i===rowData.tableData.id)
                                        {
                                         
                                          if(columnDef.field === "paying")
                                            {
                                              if(Number(newValue) === 0)
                                                newValue = 1;
                                              if(Number(newValue)<Number(da["Inscription_Rest"]))
                                                setMonthlyLess(true);
                                              else
                                                {
                                                  setMonthlyLess(false);
                                                  if(Number(newValue)>Number(da["Inscription_Rest"]))
                                                    newValue=da["Inscription_Rest"];
                                                }
                                              da[columnDef.field]= Number(newValue);
                                            }
                                          else
                                            {
                                              da[columnDef.field]= newValue;
                                            }
                                          
                                        }
                                    temp.push(da);
                                }
                                setBillers(temp);
                                setTimeout(resolve, 1000);
                            });
                        }
                    }}
                /></ThemeProvider>
                </div>
                );
            }

            case "BooksUniforms" :{
                return(
                  <div>
                    <ThemeProvider theme={MUITabletheme}><MaterialTable
                    style={{marginBottom : 25}}
                    options={{search : false,
                                paging : false,
                                showTextRowsSelected: false,
                                //tableLayout: "fixed",
                                toolbar: false
                                }}
                    columns={[
                        { title: "studentId", field: "id", editable:'never',align: 'center' },
                        { title: "prename", field: "First_Name" , editable:'never' ,align: 'center'},
                        { title: "Books/Uniform Tax", field: "Books_Uniform_total", editable:'never' ,align: 'center'},
                        { title: "Rest", field: "Books/Uniform_Rest", type:"numeric", editable:'never',align: 'center'},
                        { title: "Pay", field: "paying", type:"numeric", align: 'center'},
                        { title: "Pardon?", field: "pardoned", type:"boolean",hidden:!monthlyLess, align: 'center',
                        editComponent: props => (
                          <Checkbox
                            value={props.value}
                            onChange={e => props.onChange(e.target.value)}
                          />
                        )}
                        
                    ]}
                    data={billers}
                    
                    cellEditable={{
                       cellStyle:{width: "20%"},
                        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                            return new Promise((resolve, reject) => {
                                var temp=[];
                                for(i=0;i<billers.length;i++){
                                    var da={...billers[i]};
                                    if(i===rowData.tableData.id){
                                      
                                      if(columnDef.field === "paying")
                                            {
                                              if(Number(newValue) === 0)
                                                newValue = 1;
                                              if(Number(newValue)<Number(da["Books/Uniform_Rest"]))
                                                setMonthlyLess(true);
                                              else
                                                {
                                                  setMonthlyLess(false);
                                                  if(Number(newValue)>Number(da["Books/Uniform_Rest"]))
                                                    newValue=da["Books/Uniform_Rest"];
                                                }
                                              da[columnDef.field]= Number(newValue);
                                            }
                                          else
                                            {
                                              da[columnDef.field]= newValue;
                                            }
                                      
                                    }
                                    temp.push(da);
                                }
                                setBillers(temp);
                                setTimeout(resolve, 1000);
                            });
                        }
                    }}
                /></ThemeProvider>
                </div>
                );
            }

            default : {
                return(
                    <div>
                    <ThemeProvider theme={MUITabletheme}><MaterialTable
                    style={{marginBottom : 25}}
                    options={{search : false,
                                paging : false,
                                showTextRowsSelected: false,
                                //tableLayout: "fixed",
                                toolbar: false
                                }}
                    columns={[
                        { title: "studentId", field: "id", editable:'never',align: 'center' },
                        { title: "prename", field: "First_Name" , editable:'never' ,align: 'center'},
                        { title: "Pay Start", field: "Pay_Start", editable:'never' ,align: 'center'},
                        { title: "Monthly total", editable:'never',align: 'center',
                            cellStyle:(cellValue,rowData)=>{
                                return rowData.Rest===rowData.Monthly_Total?{}:{border:"1.5px solid #ff6347"}},
                                render: (rowData) => {
                                        return rowData.Rest===rowData.Monthly_Total?
                                            rowData.Monthly_Total
                                            :rowData.Monthly_Total + " (first month: " + rowData.Rest+")"}},
                        { title: "Pay per month", field: "paying", type:"numeric", align: 'center',
                        editComponent: props => (
                          <input
                            type="text"
                            style={{minWidth:100}}
                            value={props.value}
                            onChange={e => props.onChange(e.target.value)}
                          />
                        )},
                        { title: "Pardon?", field: "pardoned", type:"boolean",hidden:!monthlyLess, align: 'center',
                        editComponent: props => (
                          <Checkbox
                            value={props.value}
                            onChange={e => props.onChange(e.target.value)}
                          />
                        )}
                        
                    ]}
                    data={billers}
                    
                    cellEditable={{
                       cellStyle:{width: "20%"},
                        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                            return new Promise((resolve, reject) => {
                                var temp=[];
                                for(i=0;i<billers.length;i++){
                                    var da={...billers[i]}; 
                                    if(i===rowData.tableData.id){
                                      if(columnDef.field === "paying")
                                            {
                                              if(Number(newValue) === 0)
                                                newValue = 1;
                                              if(Number(newValue)<Number(da["Monthly_Total"]))
                                                setMonthlyLess(true);
                                              else
                                                {
                                                  setMonthlyLess(false);
                                                  if(Number(newValue)>Number(da["Monthly_Total"]))
                                                    newValue=da["Monthly_Total"];
                                                }
                                              da[columnDef.field]= Number(newValue);
                                              da["fmpaying"] = Number(newValue)>da.Rest? da.Rest:Number(newValue);
                                            }
                                          else
                                            {
                                              da[columnDef.field]= newValue;
                                            }
                                    }
                                    temp.push(da);
                                }
                                setBillers(temp);
                                setTimeout(resolve, 1000);
                            });
                        }
                    }}
                /></ThemeProvider>

                <div className="form-group" style={{align:"center",marginLeft:125,marginBottom:20}}>
                <fieldset>
                    <label>Number of months</label>
                    <input
                        type="number"
                        className="form-control"
                        onWheel={(e) => e.target.blur()}
                        value={monthsNb}
                        onChange={(e)=>{setMonthsNb(e.target.value)}}
                        onBlur={handleNBMonthChange}
                        />
                </fieldset>
            </div>
            </div>
                );
            }
        }
        
    };

      return(
        <div className="add-bill">
        <div className="container-fluid">
          <div className="col-12 text-center">
            <h2 className="title-of-middle">Create Family Payement</h2>


            <div className="select-container w-100 " >
            <input value={familyID} style={{width:300, height:35, padding:5, marginBottom:10}} onChange={(e)=>{setFamilyID(e.target.value)}}/>

              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select class"
                  defaultValue={defaultBillValue}
                  value={defaultBillValue}
                  options={billOptions}
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
                  onChange={onBillTypeChange}
                />
              </div>
          
            {/* Start select search */}
      
              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select class"
                  defaultValue={defaultYearValue}
                  value={defaultYearValue}
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
            {/* end select search */}
            
            <ThemeProvider className="col-12" theme={MUITabletheme} >
                {famIsValid && <MaterialTable
                    tableRef={selectTableRef}
                    style={{marginBottom : 25}}
                    options={{search : false,
                                paging : false,
                                selection : true,
                                selectionProps: rowData => ({
                                    disabled: rowData.tableData.disabled
                                }),
                                showSelectAllCheckbox: false,
                                toolbar: false
                              }}
                    columns={[
                        { title: "studentId", field: "id" },
                        { title: "prename", field: "First_Name" },
                        { title: "name", field: "Last_Name" },
                        { title: "classLevel", field: "Grade_Name" },
                    
                    ]}
                    data={familyMembers.map(row=>{
                        row.tableData = {...row.tableData, disabled: disableRow(row)};
                        return row;})}
                    onSelectionChange={(rows) => {
                        var temp=[];
                        if(rows.length===0)
                        {
                          setStartMonth(0);
                          familyMembers.map(row=>{
                          row.tableData.disabled=disableRow(row);
                          return row;})
                        }
                        let total=0;
                        rows.forEach(row => {
                          if(startMonth===0)
                            setStartMonth(row.Pay_Start);
                           var da={...row};
                           da.pardoned=false;
                           switch (billType){
                            case "BooksUniforms":{da.paying = row["Books/Uniform_Rest"];break;}
                            case "Inscription":{da.paying = row.Inscription_Rest; break;}
                            default:{da.paying = row.Monthly_Total;da.fmpaying = row.Rest;break;}
                           }
                           temp.push(da);
                        });
                        setBillers(temp);
                    }}
                />}
            </ThemeProvider>
            {/*Select Payement Type*/}
            

            {
                famIsValid && billers.length!==0 && paymentForm()
            }

            <div className="form-group w-100 p-3" /*style={{align:"center",marginLeft:125,marginBottom:20,maxWidth:400}}*/>
                    <label> Total Amount</label>
                    <NumberFormat
                        thousandSeparator
                        suffix=' xCfa'
                        //className="form-control"
                        //onWheel={(e) => e.target.blur()}
                        value={totalAmount}
                        disabled
                        />
            </div>
            <div className="select-container w-100 " >
              <div className="select">
                <Select
                  style={{ fontSize: 0 }}
                  placeholder="Select class"
                  defaultValue={defaultPaymentValue}
                  options={paymentOptions}
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
                  onChange={onPayementTypeChange}
                />
              </div>
            </div>
            
            <button className="ss" onClick={submit} disabled={submitting || billers.length===0 || totalAmount===0} style={{marginBottom:100}}> Confirm </button>
          </div>
         </div>
         </div>
      );
};
const mapStateToProps = (state) => {
    return {
      language: state.language,
    };
  };
  
  export default connect(mapStateToProps)(AddFamilyBills);