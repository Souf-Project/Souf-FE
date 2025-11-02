
import checkBoxIcon from '../assets/images/checkBoxIcon.svg';
import notCheckBoxIcon from '../assets/images/notCheckBoxIcon.svg';



const ReasonCheckbox = ({ index, label, isSelected, onChange }) => (
  <div className="flex items-center gap-2">
    <button 
      type="button"
      onClick={() => onChange(index)}
      className="flex items-center justify-center"
    >
      <img 
        src={isSelected ? checkBoxIcon : notCheckBoxIcon} 
        alt="checkbox" 
        className="w-5 h-5 transition-all duration-300 ease-in-out"
      />
    </button>
    <label 
    className="text-sm leading-tight cursor-pointer"
    onClick={() => onChange(index)}>{label}</label>
  </div>
);

export default ReasonCheckbox; 