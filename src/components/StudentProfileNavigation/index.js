import React, { Component } from "react";
import "./style.css";

class StudentProfileNavigation extends Component {
  render() {
    return (
      <div className="topnav" id="myTopnav">
        <a href="#home" className="active">Home</a>
        <a href="#news">News</a>
        <a href="#contact">Contact</a>
        <div className="dropdown">
            <button className="dropbtn">Dropdown 
             <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
            </div>
        </div>       
        <a href="#about">About</a>
        <a className="icon">&#9776;</a>
        <h2>Responsive Topnav with Dropdown</h2>
        <p>Resize the browser window to see how it works.</p>
        <p>Hover over the dropdown button to open the dropdown menu.</p>
    </div>
    );
  }
}

export default StudentProfileNavigation;