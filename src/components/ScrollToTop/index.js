import React, {useState} from 'react';
import './style.css';

const ScrollButton = () =>{

const [visible, setVisible] = useState(false)

const toggleVisible = () => {
	const scrolled = document.documentElement.scrollTop;
	if (scrolled > 150){
	setVisible(true)
	}
	else if (scrolled <= 300){
	setVisible(false)
	}
};

const scrollToTop = () =>{
	window.scrollTo({
	top: 0,
	behavior: 'smooth'
	/* you can also use 'auto' behaviour
		in place of 'smooth' */
	});
};

window.addEventListener('scroll', toggleVisible);

return (
    <div className="scroll-to-top d-print-none" 
	  style={{display: visible ? 'inline' : 'none'}}  
	  onClick={scrollToTop} 
	> {/* d-print-none for hiding this element when we print */}
          <i className="fa fa-angle-up"></i>
    </div>
);
}

export default ScrollButton;
