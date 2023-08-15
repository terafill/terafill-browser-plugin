import { memo } from "react";

const Button = ({
  buttonType,
  buttonClassName,
  onClick,
  label,
  labelDisplay,
  labelClassName,
  icon,
  iconComponent,
  iconDisplay,
  iconPosition="left",
  iconClassName,
  ...props
}) => {

  const buttonTypeClassMap = {
    dark: "bg-black text-white font-medium text-base py-1 px-3 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none transition-all flex flex-row items-center justify-center",
    panel: "text-blue-400 font-medium text-base py-1 px-3 rounded-lg hover:bg-gray-200 focus:outline-none transition-all flex flex-row items-center justify-center",
    link: "text-blue-400 font-medium text-base py-1 px-3 rounded-lg hover:bg-blue-50 focus:outline-none transition-all flex flex-row items-center justify-center",
    red: "bg-red-500 text-white font-medium text-base py-1 px-3 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transition-all flex flex-row items-center justify-center",
    blue: "bg-blue-500 text-white font-medium text-base py-1 px-3 rounded-lg shadow-md hover:bg-blue-400 focus:outline-none transition-all flex flex-row items-center justify-center",
    light: "bg-white text-black font-medium text-base py-1 px-3 rounded-lg shadow-all-direction hover:bg-gray-300 focus:outline-none transition-all flex flex-row items-center justify-center",
    lightOutlined: "",
  }

  const labelTypeClassMap = {
    dark: "cursor-pointer",
    panel: "cursor-pointer",
    link: "cursor-pointer",
    red: "cursor-pointer",
    blue: "cursor-pointer",
    light: "cursor-pointer",
    lightOutlined: "cursor-pointer",
  }

  const iconTypeClassMap = {
    dark: "",
    panel: "",
    link: "",
    red: "",
    blue: "",
    light: "",
    lightOutlined: "",
  }

  if (buttonType == undefined || buttonType == null){
    buttonType = "dark";
  }
  return (
  <button
    id={props.id}
    className={`${buttonTypeClassMap[buttonType]} ${buttonClassName}`}
    onClick={onClick}
    {...props}
  >
    {props.children}
    {iconPosition === "left" && (icon || iconComponent) && (
      <span className={`${iconTypeClassMap[buttonType]} ${iconClassName}`}>
        {icon ? <img alt="" src={icon} /> : iconComponent}
      </span>
    )}
    {label && (
      <div className={`${labelTypeClassMap[buttonType]} ${labelClassName}`}>
        {label}
      </div>
    )}
    {iconPosition === "right" && (icon || iconComponent) && (
      <span className={`${iconTypeClassMap[buttonType]} ${iconClassName}`}>
        {icon ? <img alt="" src={icon} /> : iconComponent}
      </span>
    )}
  </button>
  );
};

export default memo(Button);
