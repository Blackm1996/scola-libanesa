import React, { useState, useRef, useEffect } from "react";
import "./style.css";

const SearchbarDropdown = (props) => {
  const { options, onInputChange } = props;
  const ulRef = useRef();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.addEventListener("click", (event) => {
      event.stopPropagation();
      ulRef.current.style.display = "flex";
      onInputChange(event);
    });
    document.addEventListener("click", (event) => {
      ulRef.current.style.display = "none";
    });
  }, []);
  return (
    <div className="search-bar-dropdown col-lg-6 col-12">
      <div class="form-group search-input">
        <input
          id="search-bar"
          type="text"
          className="form-control"
          placeholder="Search"
          ref={inputRef}
          onChange={onInputChange}
        />
        <ul id="results" className="list-group" ref={ulRef}>
          {options.map((option, index) => {
            return (
              <button
                type="button"
                key={index}
                onClick={(e) => {
                  inputRef.current.value = option;
                }}
                className="list-group-item list-group-item-action"
              >
                {option}
              </button>
            );
          })}
        </ul>
        <button className="btn search fa-fa-search">
          <i className='fa fa-search'></i>
        </button>
      </div>
    </div>
  );
};

const defaultOptions = [];
for (let i = 0; i < 10; i++) {
  defaultOptions.push(`option ${i}`);
  defaultOptions.push(`suggesstion ${i}`);
  defaultOptions.push(`advice ${i}`);
}

function SearchField() {
  const [options, setOptions] = useState([]);
  const onInputChange = (event) => {
    setOptions(
      defaultOptions.filter((option) => option.includes(event.target.value))
    );
  };

  return (
    <div className="search-section mt-2 mb-3 row">
      <SearchbarDropdown options={options} onInputChange={onInputChange} />
    </div>
  );
}

export default SearchField;
