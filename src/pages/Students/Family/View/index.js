import { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material';
const ViewFamily=(props)=>
{
    const[familyID,setFamilyID]=useState(props.match.params.id === undefined? "":"fam_"+props.match.params.id);
    const[famIsValid,setFamIsValid]=useState(false);
    const[familyMembers,setFamilyMembers]=useState([]);


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
               setFamIsValid(true);
               setFamilyMembers(response.data.members);
               console.log(familyMembers);
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


    return(
        <div className="container-fluid">
            <div className="col-12 text-center">
                <h2 className="title-of-middle">Create Family Payement</h2>
                <div className="w-100" style={{marginBottom : 30}}>
                    <input value={familyID} style={{width:300, height:35, padding:5}} onChange={(e)=>{setFamilyID(e.target.value)}}/>
                </div>
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