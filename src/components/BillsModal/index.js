import axios from "axios";
import React from "react";
import { ENGLISH, FRENCH, PORTO } from "../../languages";
// import language words
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "./LangKeys";
// import connect from react-redux
import { connect } from "react-redux";
import swal from "sweetalert";
import "./style.css";

class BillsModal extends React.Component {
  state = {
    loading: false,
    modalVis: true,
    id: 3,
    startMonth: 9,
    bills: [],
    langKeywords: {
      [ENGLISH]: ENGLISHWORDS,
      [PORTO]: PORTOWORDS,
      [FRENCH]: FRENCHWORDS,
    },
  };

  // component did mount
  componentDidMount = () => {
    const idStudent = this.props.id,
      yearSelected = this.props.yearSelected,
      monthSelected = this.props.monthSelected;

    // Page Lang
    const pageLanguage = this.props.language;
    // Language Keywords

    const { error1 } = this.state.langKeywords[pageLanguage];

    axios
      .get(`/bills/${idStudent}/${monthSelected}/${yearSelected}`)
      .then((response) => {
        if (response.status == 200) {
          // adjust the date time when bills is !== []
          if (response.data.length > 0) {
            let bills = response.data.map((bill) => {
              //date before ajusting
              const date = new Date(bill.created_at);
              // date string after formatting
              const day = `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()}   ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

              return {
                ...bill,
                created_at: day,
              };
            });

            this.setState({
              bills,
            });
          }
        } else {
          swal(
            { error1 },
            {
              icon: "error",
            }
          );
        }
      })
      .catch((error) => {
        swal(
          { error1 },
          {
            icon: "error",
          }
        );
      });

    // add listener for exit modal when we press exit key
    document.addEventListener("keydown", this.closeModal2);
  };

  //close modal when we press exit key
  closeModal2 = (e) => {
    if (e.keyCode === 27) this.props.closeModal();
  };
  //close modal when we click out table
  closeModal = (e) => {
    if (e.target.nodeName === "DIV") this.props.closeModal();
  };
  render() {
    // Page Lang
    const pageLanguage = this.props.language;

    // Language KEywords
    const { month, amount, date } = this.state.langKeywords[pageLanguage];

    return (
      <div id="billsModal" className="modal d-block" onClick={this.closeModal}>
        <span className="close" onClick={this.props.toggleModalVis}>
          &times;
        </span>
        <div className="modal-content">
          {/* start payments table*/}
          <div style={{ "overflow-x": "auto" }}>
            <table className="table table-hover">
              <thead>
                <tr style={{ cursor: "pointer" }}>
                  <th>{month}</th>
                  <th>{date}</th>
                  <th>{amount}</th>
                </tr>
              </thead>
              {this.state.bills.length == 0 ? (
                <div>empty</div>
              ) : (
                this.state.bills.map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.Month} </td>
                    <td>{bill.created_at}</td>
                    <td>{bill.Amount}</td>
                  </tr>
                ))
              )}
            </table>
          </div>
          {/* end table payment */}
        </div>
        <div id="caption"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(BillsModal);
