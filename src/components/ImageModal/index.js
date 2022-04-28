import React from 'react'
import './style.css';

class ImageModal extends React.Component {
    
    componentDidMount = () => {
      document.addEventListener("keydown", this.closeModal2 );
    }
    //when we pressed on close button
    closeModal = (e) => {  
       if (e.target.nodeName === "DIV") this.props.closeModal();
    }
    closeModal2 = (e) => {
       if ( e.keyCode === 27 )
         this.props.closeModal();
    }
    render() {

        //show ot not modal
        return (
        <div id="imageModal" className="modal d-block" onClick={this.closeModal} >
          <span className="close" onClick={this.props.toggleModalVis}>&times;</span>
          <img className="modal-content" id="img01" src={ this.props.img } />
          <div id="caption"></div>
      </div>);
    }
}

export default ImageModal;
