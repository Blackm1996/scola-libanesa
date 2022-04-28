// Logout Component
import React, { Component } from 'react';
import {Link} from "react-router-dom";
import './style.css';
import { removeUserSession } from '../../Utils/Common/common.js';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
class Logout extends Component {
    // handle click event of logout button
    handleLogout = (e) => {
        //e.preventDefault();
        //console.log(this.props);
        //this.props.history.push("/Login");
        //const history = useHistory();
        //history.push('/login')
        removeUserSession();
        localStorage.removeItem("id");
        localStorage.removeItem("new");
        <Redirect to='/' />     
    }
    render() {
        return (
            <>
                <Link to="/Login" className='logout' onClick={this.handleLogout}>
                    <span>{ this.props.logOut }</span>
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                </Link>
            </>
        );
    }
}
export default Logout;