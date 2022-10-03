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
      monthSelected = this.props.monthSelected,
      typeSelected = this.props.type;
    console.log("HAHAHA")
    // Page Lang
    const pageLanguage = this.props.language;
    // Language Keywords

    const { error1 } = this.state.langKeywords[pageLanguage];

    if(typeSelected === "Monthly")
    {
      axios
      .get(`/bills/${idStudent}/${monthSelected}/${yearSelected}`)
      .then((response) => {
        if (response.status == 200) {
          // adjust the date time when bills is !== []
          if (response.data.length > 0) {
            console.log(response.data);
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
             error1 ,
            {
              icon: "error",
            }
          );
        }
      })
      .catch((error) => {
        swal(
           error ,
          {
            icon: "error",
          }
        );
      });
    }
    else
    {
      console.log(`/billsOther/${idStudent}/${typeSelected}/${yearSelected}`);
      axios
      .get(`/billsOther/${idStudent}/${typeSelected}/${yearSelected}`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
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
    }

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


  getInvoice = (id)=>{
    console.log(`/invoice/${id}`);
    axios
    .get(`/invoice/${id}`)
    .then((response)=>{
        if(response.data.pdf)
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
    })
  };

  deleteBill=(id)=>{
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Bill!!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal({
          title: "Are you Absolutly sure?",
          text: "This is a Bill information, you will need to re-submit again and a new fatura will be generated",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            axios
            .delete(`/bills/${id}`)
            .then( (response)=>
            {
              if(response.status===204)
              swal("Bill was deleted!!", {
                icon: "success",
              });
            }

            )
          }
        });
      }
    });
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
                  <th>{this.props.type==="Monthly"? month : "Type"}</th>
                  <th>{date}</th>
                  <th>{amount}</th>
                  <th>Payemnet Type</th>
                  <th>Fatura</th>
                  {this.props.role === "admin" && <th></th>}
                </tr>
              </thead>
              {this.state.bills.length == 0 ? (
                <div>empty</div>
              ) : (
                this.state.bills.map((bill, index) => (
                  <tr key={index}>
                    <td>{this.props.type==="Monthly"? bill.Month: bill.Type} </td>
                    <td>{bill.created_at}</td>
                    <td>{bill.Amount}</td>
                    <td>{bill.paymentType}</td>
                    <td><button onClick={()=>{this.getInvoice(bill.id_invoice)}} disabled={bill.id_invoice===null}>Invoice</button></td>
                    {this.props.role === "admin" && <td><button onClick={()=>{this.deleteBill(bill.id)}}>delete</button></td>}
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
    role: state.role,
  };
};
export default connect(mapStateToProps)(BillsModal);
