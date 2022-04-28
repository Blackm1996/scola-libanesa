/* Readable Scalable Secure */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./style.css";

class ItemMenu extends Component {
  state = {
    showMatiersItems: false,
    chevronToggle: "fa-chevron-right",
  };
  // Show Or Hide Matiers List
  toggleShow = () => {
    const { chevronToggle } = this.state;
    if (chevronToggle === "fa-chevron-right") {
      this.setState({
        showMatiersItems: true,
        chevronToggle: "fa-chevron-down",
      });
    } else {
      this.setState({
        showMatiersItems: false,
        chevronToggle: "fa-chevron-right",
      });
    }
    //this.props.history.push(`/admin/students/grade/${this.props.gradeId}`);
  };
  render() {
    return (
      <li className="item-menu">
        {this.props.sections != undefined  && (
          <div className="classroom">
            <div className="index" onClick={this.toggleShow}>
              <i
                className={`fa ${this.state.chevronToggle}`}
                aria-hidden="true"
              ></i>
            </div>
            <div
              className="classroom-name"
              onClick={() =>
                this.props.history.push(
                  "/admin/students/grade/" + this.props.gradeId
                )
              }
            >
              <Link>{this.props.gradeName}</Link>
            </div>
          </div>
        )}
        {this.state.showMatiersItems ? (
          <>
            <ul>
              {this.props.sections != undefined && this.props.sections.map((item, index) => {
                return (
                  <li key={index} className="matiere">
                    <Link
                      to={{
                        pathname: `/admin/students/section/${item.id}`,
                        aboutProps: {
                          gradeName: "test",
                        },
                      }}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          ""
        )}
      </li>
    );
  }
}

export default withRouter(ItemMenu);
