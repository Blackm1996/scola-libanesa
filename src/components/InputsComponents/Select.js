const Select = (props) => {
    const { label, placeholder, options, id } = props;
    return (
        <div className="form-group">
            <label for={` ${id} `}>{label}</label>
            <select className="form-control" id={` ${id} `} placeholder={` ${placeholder} `}>
                {
                    options.map((option, index) =>
                        <option key={index}>{option}</option>
                    )
                }
            </select>
        </div>
    );
}
export default Select;