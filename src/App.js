import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./Utils/PrivateRoute";
import Navbar from "./components/Navbar";
import { getToken } from "./Utils/Common/common";
import Login from "./pages/Login";
import Students from "./pages/Students";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import TeacherDashboard from "./pages/Dashboards/TeacherDashboard";
import Dashboard from "./components/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import { Provider } from "react-redux";
import "./App.css";
import axios from "axios";
// import store
import store from "./redux/store";
axios.defaults.baseURL = "https://management.escola-libanesa.com/test2/api/";
//axios.defaults.baseURL = "./test2/api/";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/Login" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/admin" component={AdminDashboard} />
            <PrivateRoute path="/teacher" component={TeacherDashboard} />
          </Switch>
        </BrowserRouter>
        {/* start scroll to to button */}
        <ScrollToTop />
        {/* end scroll to to button */}
      </div>
    );
  }
}

function AppWithStore() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWithStore;
