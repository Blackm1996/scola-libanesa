import styled from "styled-components";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import axios from "axios";
import swal from "sweetalert";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  min-height: calc(100vh - 60px);
  padding-bottom: 150px;
`;
const SaveButton = styled.button`
border-radius: 3px;
width: 11rem;
margin: 0.5em 1em;
padding: 0.25em 1em;`;

const ResetButton = styled.button`
border-radius: 3px;
background: #f5f5f2;
color: red;
border:solid red;
margin: 0.5em 1em;
padding: 0.25em 1em;`;

const Row = (props) => {
    const {
      id,
      name,
      hours,
      minutes,
      handleHourChange,
      handleMinuteChange
    } = props.obj;

    return (
      <tr>
        <td>{id}</td>
        <td>{name}</td>
        <td>
          <input
            type="number"
            className="text-center w-100"
            placeholder={hours}
            value={hours}
            min="0"
            onChange={(e) => {
                  //setHValue(e.target.value);
                  handleHourChange(e.target.value,id);
              }}
          />
        </td>
        <td>
          <input
            type="number"
            className="text-center w-100"
            placeholder={minutes}
            value={minutes}
            min="0"
            max="59"
            onChange={(e) => {
              if (Number(e.target.value) <= 59) {
                //setMValue(e.target.value);
                handleMinuteChange(e.target.value,id);
              }
            }}
          />
        </td>
      </tr>
    );
  };


const HourlyEmployeeAttendance = () => {
    const [date, setDate] = useState(dayjs());
    const [data, setData] = useState([]);
    const [original, setOriginal] = useState([]);
    useEffect(() => {
        
        loadSheet(date);
    }, [date]);

    /*useEffect(() => {
        loadSheet(dayjs())
    }, []);*/

    const save = () => {
        let inp={
                    data: data,
                    date:dayjs(date).format('YYYY-MM-DD'),
                }
        console.log("HIIII",inp);
        axios.post(`/updateDailyAttendance`, inp)
        .then(resp => {
            if(resp.status === 201)
            {
              swal("Success", {
                icon: "success",
              })
              .then(()=>loadSheet(date));
            }
            else {
                swal("Error: "+resp.data.status, {
                  icon: "error",
                });
            }
          })
          .catch(err => {swal(err, {
            icon: "error",
          });})

      };
    const reset=()=>{setData([...original])}

      const handleHourChange = (e, id) => {
        let newData = data.map((item) => {
          if (id === item.id) {
            return {
              ...item,
              hours: e,
            };
          }
          return item;
        });
        setData([...newData]);
      };

      const handleMinuteChange = (e, id) => {
        let newData = data.map((item) => {
          if (id === item.id) {
            return {
              ...item,
              minutes: e,
            };
          }
          return item;
        });
        setData([...newData]);
      };

    const loadSheet=(inputDate)=>{
        const input = dayjs(inputDate).format('YYYY-MM-DD');
        axios.get(`HourlyAttendanceDaily/${input}`)
        .then(response=>{
                setData([...response.data]);
                setOriginal(response.data);
                console.log("aaaa",response.data);
            }
        )
        .catch(err => {swal(err, {
            icon: "error",
          });})
    };
    return (
        <Wrapper>
            <div className="main-table">
            <div className="container-fluid">
            <div className="col-12 text-center">
                <h2 className="title-of-middle">Attendance</h2>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="d-flex col-10 mx-auto" style={{ marginBottom: 20 }}>
                    <DesktopDatePicker
                        label="date"
                        inputFormat="DD-MM-YYYY"
                        minDate={dayjs('2022-10-01')}
                        maxDate={new Date()}
                        value={date}
                        onChange={(newValue) =>setDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>
            </LocalizationProvider>

            <div className="d-flex col-10 mx-auto flex-row" style={{ marginBottom: 20 }}>
                <SaveButton
                    style={{ marginRight: 70 }}
                    onClick={save}
                    type="button"
                >
                    Save
                </SaveButton>

                <ResetButton
                    onClick={reset}
                    type="button"
                >
                    Reset
                </ResetButton>
            </div>
            
            { (
            <>
              <table className="mx-auto">
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>Name</td>
                    <td>Hours</td>
                    <td>Minutes</td>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    return (
                      <>
                        <Row
                          obj={{
                            id: item.id,
                            name: item.name,
                            hours: item.hours,
                            minutes: item.minutes,
                            handleHourChange: handleHourChange,
                            handleMinuteChange:handleMinuteChange,
                          }}
                        />
                      </>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
            </div>
            </div>
        </Wrapper>
    );
}

const mapStateToProps = (state) => {
    return {
      language: state.language,
      role: state.role,
    };
  };
 
export default connect(mapStateToProps)(HourlyEmployeeAttendance);