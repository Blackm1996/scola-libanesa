import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export const Card = () => {
  const [empDetails, setEmpDetails] = useState({
    id: 1,
    First_Name: "mohamad",
    Last_Name: "mohyeddine",
    Birthday: "26-5-1996",
    Tel: "955589998",
    Address: "zrarieh",
    Nationality: "Lebanese",
    Type: "full_time",
    base_salary: 500000,
    debt_pay_perMonth: 0,
    position: "prof",
    start_position: "2022-04-04",
    end_position: null,
    is_Working: 1,
  });
  const {
    First_Name,
    Last_Name,
    Birthday,
    Tel,
    Address,
    Nationality,
    Type,
    base_salary,
    debt_pay_perMonth,
    position,
    start_position,
    end_position,
    is_Working,
  } = { ...empDetails };

  const params = useParams();
  const {id} = {...params} ;

  useEffect(() => {
    id && axios.get();
  }, [id]);

   // delete student
   const deleteStudent = () => {
    axios
    .delete(`/student/${id}`)
  };

  //update student
  const updateStudent = () => {
    window.scrollTo(550, 550);
  };

  return (
    <div className="studentID-section">
      <div className="row">
        {/* Start Section of images */}
        <div className="col-md-4 mb-3 pr-0">
          <div className="images"></div>
        </div>
        {/* end section of images */}

        <div className="col-md-8 pl-0">
          <div className="card mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">ID</h6>
                </div>
                <div className="col-sm-8 text-secondary">{id}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">prename</h6>
                </div>
                <div className="col-sm-8 text-secondary">{First_Name}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">name</h6>
                </div>
                <div className="col-sm-8 text-secondary">{Last_Name}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Birth Date</h6>
                </div>
                <div className="col-sm-8 text-secondary">{Birthday}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Tel</h6>
                </div>
                <div className="col-sm-8 text-secondary">{Tel}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Address</h6>
                </div>
                <div className="col-sm-8 text-secondary">{Address}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Nationality</h6>
                </div>
                <div className="col-sm-8 text-secondary">{Nationality}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Type</h6>
                </div>
                <div className="col-sm-8 text-secondary">{Type}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Base salary</h6>
                </div>
                <div className="col-sm-8 text-secondary">{base_salary}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">debt pay perMonth</h6>
                </div>
                <div className="col-sm-8 text-secondary">
                  {debt_pay_perMonth}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">position</h6>
                </div>
                <div className="col-sm-8 text-secondary">{position}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Start position</h6>
                </div>
                <div className="col-sm-8 text-secondary">{start_position}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">Working</h6>
                </div>
                <div className="col-sm-8 text-secondary">
                  {is_Working === 1 ? "Yes" : "No"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="mb-0">End position</h6>
                </div>
                <div className="col-sm-8 text-secondary">{end_position}</div>
              </div>
              <hr />
            </div>

            {/* start trash edit icons sectio*/}
            <div className="trash-and-edit">
              <Link to={`/admin/profile-employee/${id}/update`}>
                <i className="fa fa-edit" onClick={updateStudent}></i>
              </Link>
              <i className="fa fa-trash" onClick={deleteStudent}></i>
            </div>
            {/* end trash edit icons sectio*/}
          </div>
        </div>
      </div>
    </div>
  );
};
