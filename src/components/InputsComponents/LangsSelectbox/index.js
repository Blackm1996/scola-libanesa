/* Readable Scalable Secure */
import './style.css';
const LangsSelectbox = () => {
    return (
        <div className="navbar">
            <a href="#home">Home</a>
            <a href="#news">News</a>
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
        </div>
    );
}
export default LangsSelectbox;