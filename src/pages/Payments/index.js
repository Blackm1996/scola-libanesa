import React, { Component } from "react";
import {Link, Route} from "react-router-dom";
import AddPayment from "../Payments/Add";
import ViewPayment from "../Payments/View";
import './style.css';

class Payments extends Component {
  render() {

    //navbar links
    const links = [
      {linkName: "add bill", to: "/admin/payments/add"},
      {linkName: "view bill", to: "/admin/payments/view/3"},
    ];
    return (
      <div className="students row">

        {/* Start left component */}
        <div className="left-component col-12 col-md-3 col-lg-2">
          <ul>
          {links.map((link) => (
            <li>
              <Link to={link.to}>
                {link.linkName}
              </Link>
            </li>
          ))}  
          </ul>
        </div>

        {/* Start main section */}
        <div className="middle-component col-12 col-md-8 col-lg-8">
           <Route  exact path="/admin/payments" component={AddPayment} />
           <Route  exact path="/admin/payments/add" component={AddPayment} />
           <Route  exact path="/admin/payments/view/:id" component={ViewPayment} />
        </div>

        {/* Start right Section */}
        <div className="right-component col-12 col-md-3 col-lg-2">
          
        </div>
      </div>
    );
  }
}

export default Payments;
