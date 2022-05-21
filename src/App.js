import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./Utils/PrivateRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import TeacherDashboard from "./pages/Dashboards/TeacherDashboard";
import Dashboard from "./components/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import { Provider, connect } from "react-redux";
import "./App.css";
import axios from "axios";
// import store
import store from "./redux/store";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
//axios.defaults.baseURL = "https://mmm.escola-libanesa.com/test2/api/";
//axios.defaults.baseURL = "./backend/api/";

class App extends React.Component {
  render() {
    console.log(process.env.REACT_APP_BASE_URL);
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
