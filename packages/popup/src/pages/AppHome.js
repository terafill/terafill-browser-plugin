import { useEffect, useState, useRef } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { NavLink, Outlet, useParams, useLoaderData, useNavigate, useOutletContext, withRouter, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MoonLoader from "react-spinners/MoonLoader";

import Button from "../components/Button";
import { useTokenExpiration } from '../components/TokenTools';
import { getDefaultVaultItems, updateVaultItem, createVaultItem, deleteVaultItem } from '../data';
import "./AppHome.css";

export const ItemPanelIndex = () => {
  return (
    <div className="self-stretch flex-1 overflow-hidden flex flex-col py-[32px] px-[16px] h-1/1 items-center justify-center z-[0] text-4xl">
      <h1>Good Morning!</h1>
    </div>
  );
}

export const ItemPanel = () => {

  const { id } = useParams();
  const [itemFormDisabled, setItemFormDisability] = useState(true);
  const [shareButtonVisible, setShareButtonVisible] = useState(true);
  const [showPassword, setPasswordVisibility] = useState(false);
  const [itemUpdating, setItemUpdating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const [ itemDataList, updateItem ] = useOutletContext();

  useEffect(()=>{
    console.log("id", id);
      if(id === "new"){
        itemDataList[id] = {
          title: '',
          icon: null,
          password: '',
          website: '',
          username: '',
        }
        console.log("itemFormDisabled", itemFormDisabled);
        setItemFormDisability(prevState=>false);
        setShareButtonVisible(prevState=>false);
      }
      else{
        setItemFormDisability(prevState=>true);
        setShareButtonVisible(prevState=>true);
      }
    if(itemDataList[id] === undefined){
      navigate('/app-home');
    }
  }, [location]);


  return (
    <div className="self-stretch flex-1 overflow-hidden flex flex-col py-[16px] h-1/1 items-center justify-between z-[0]" id="right-panel">
      <div className="absolute">
        <ToastContainer />
      </div>
      <div className="self-end flex flex-row">
        {!itemFormDisabled && !itemUpdating && <Button
          onClick={() => {
            setItemFormDisability(!itemFormDisabled);
            if(id === "new"){
              // console.log(location.location.state?.previousPath);
              navigate(-1);
            }
          }}
          label="Cancel"
          buttonType="link"
          buttonClassName="relative top-[0rem] right-[0rem] z-[100] hover:bg-red-50"
          labelClassName="text-xl text-red-500"
        />}
        <Button
          onClick={async () => {
            if(!itemFormDisabled){
              setItemUpdating(true);
              if (id === "new"){
                const response = await createVaultItem(itemDataList[id].title, itemDataList[id].website, itemDataList[id].password, itemDataList[id].username);
                  if (response.status == 200){
                    toast.success("Vault item created successfully!");
                      navigate(`/app-home/${response.data.id}`);
                  }
                  else{
                    toast.error("Something went wrong!");
                  }
              }
              else{
                const response = await updateVaultItem(id, itemDataList[id].title, itemDataList[id].website, itemDataList[id].password, itemDataList[id].username);
                if (response.status == 200){
                  updateItem(id, "icon", `https://cool-rose-moth.faviconkit.com/${itemDataList[id].website}/256`);
                  toast.success("Vault item updated successfully!");
                }
                else{
                  toast.error("Something went wrong!");
                }
              }
              setItemUpdating(false);
            }
            setItemFormDisability(!itemFormDisabled);
          }}
          label={itemFormDisabled?"Edit":(itemUpdating?"Saving":"Save")}
          buttonType="link"
          buttonClassName="relative top-[0rem] right-[0rem] z-[100]"
          labelClassName="text-xl"
          children={<MoonLoader loading={itemUpdating && true} size={15}/>}
        />
        {itemFormDisabled && shareButtonVisible && <Button
          label="Share"
          buttonType="link"
          buttonClassName="relative top-[0rem] right-[0rem] z-[100]"
          labelClassName="text-xl"
        />}
       {itemFormDisabled && !itemUpdating && id!="new" && <Button
          onClick={async () => {
            const response = await deleteVaultItem(id);
              if (response.status == 204){
                toast.success("Vault item deleted successfully!");
                  navigate(-1);
              }
              else{
                toast.error("Something went wrong!");
              }
            navigate(-1);
          }}
          label="Delete"
          buttonType="link"
          buttonClassName="relative top-[0rem] right-[0rem] z-[100] hover:bg-red-50"
          labelClassName="text-xl text-red-500"
        />}
      </div>
      <div className="grid grid-cols-2 grid-rows-4 items-center justify-center justify-items-center gap-2">
        <div className="self-stretch" id="iconframe">
          <img className="w-[88px] h-[88px] overflow-hidden object-cover" alt="" src={itemDataList[id]?itemDataList[id].icon:null} />
        </div>
        <input
          className={`w-8/12 flex self-stretch relative rounded-lg text-4xl font-medium bg-[transparent] rounded-3xs overflow-hidden flex-row py-0.5 px-[2px] box-border items-center justify-center ${itemFormDisabled ? '' : 'border-2 border-blue-100 bg-blue-50 bg-opacity-40'}`}
          value={itemDataList[id]?itemDataList[id].title:''}
          placeholder="title"
          onChange={(e)=>{updateItem(id, "title", e.target.value)}}
          disabled={itemFormDisabled}
        />
        <label className="text-center font-medium">USERNAME</label>
        <input
          className={`w-8/12 flex text-[23.04px] bg-[transparent] rounded overflow-hidden flex-row py-0.5 px-[2px] box-border items-center justify-center ${itemFormDisabled ? '' : 'border-2 border-blue-100 bg-blue-50 bg-opacity-40'}`}
          type="text"
          value={itemDataList[id]?itemDataList[id].username:''}
          placeholder="Username"
          onChange={(e)=>{updateItem(id, "username", e.target.value)}}
          disabled={itemFormDisabled}
        />
        <label className="text-center font-medium">PASSWORD</label>
        <div className="w-8/12 flex flex-row box-border items-stretch justify-items-stretch">
          <input
            className={`w-full flex text-[23.04px] bg-[transparent] rounded overflow-hidden flex-row py-0.5 px-[2px] box-border items-center justify-center ${itemFormDisabled ? '' : 'border-2 border-blue-100 bg-blue-50 bg-opacity-40'}`}
            type={showPassword?"text":"password"}
            value={itemDataList[id]?itemDataList[id].password:''}
            placeholder="Password"
            onChange={(e)=>{updateItem(id, "password", e.target.value)}}
            disabled={itemFormDisabled}
            />
            <button
              className="relative inset-y-0 right-0 pl-3 text-gray-500 hover:text-gray-800"
              onClick={() => setPasswordVisibility(!showPassword)}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="w-5 h-5" aria-hidden="true" />
              ) : (
                <AiFillEye className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>

        <label className="text-center font-medium">WEBSITE</label>
        <input
          className={`w-8/12 flex text-[23.04px] bg-[transparent] rounded overflow-hidden flex-row py-0.5 px-[2px] box-border items-center justify-center ${itemFormDisabled ? '' : 'border-2 border-blue-100 bg-blue-50 bg-opacity-40'}`}
          type="text"
          value={itemDataList[id]?itemDataList[id].website:''}
          placeholder="Website"
          onChange={(e)=>{updateItem(id, "website", e.target.value)}}
          disabled={itemFormDisabled}
        />
      </div>
      <Button
        label="View in dashboard"
        icon="/new-window.svg"
        iconPosition="right"
        buttonClassName="flex flex-row items-center gap-2"
      />
  </div>
  );
}


const AppHome = () => {

  const navigate = useNavigate();
  const [itemDataList, setItemDataList] = useState([]);
  const shouldLoad = useRef(true);

  useTokenExpiration();

  useEffect(() => {
    if(shouldLoad.current){
      (async () => {
        console.log("Data loading!")
        const data = await getDefaultVaultItems();
        const morphedData = {};
        for (let idx=0;idx<data.length;idx+=1){
          morphedData[data[idx].id] = data[idx];
          morphedData[data[idx].id].icon =  `https://cool-rose-moth.faviconkit.com/${data[idx].website}/256`;
        }
        setItemDataList(morphedData);
      })();
      shouldLoad.current = false;
    }
  }, []);

  useEffect(()=>{
    console.log("itemDataList", itemDataList);
  }, [itemDataList])

  const updateItem = (itemId, attribute, value) => {
    setItemDataList(prevItemDataList=>({
      ...prevItemDataList,
      [itemId]: {
        ...prevItemDataList[itemId],
        [attribute]: value
      }
    }));
  }


  return (
      <div className="relative w-full h-screen flex flex-col items-center justify-center text-left">
      <div className="self-stretch flex-1 overflow-hidden flex flex-row items-center justify-center" id="apphome-inner">
        <div className="self-stretch shadow-[1px_0px_4px_rgba(0,_0,_0,_0.25)] w-4/12 flex flex-col grow-0 shrink-0 items-center justify-start relative z-[1] overflow-hidden" id="left-panel">
          <div className="self-stretch overflow-hidden flex flex-col p-2 items-center justify-center z-[0] border-[1px]">
          <input
            className="[border:none] rounded-lg px-2 py-2 flex text-[23.04px] bg-gray-200 w-11/12 overflow-hidden flex-row items-center justify-center"
            type="text"
            placeholder=" 🔎 Quick Search"
          />
          </div>
          <div className="self-stretch flex-1 overflow-y-auto px-2 py-1 flex flex-col items-stretch justify-start z-[1] border-[2px] border-solid" id="item-list">
          {
           Object.entries(itemDataList).map( ([id, itemData]) =>
            (id!="new") && <NavLink
              to={`${itemData.id}`}
              key={itemData.id}
              className={({ isActive }) => isActive? "flex bg-gray-200 mt-1 mb-1 px-[4px] rounded-lg hover:bg-gray-200": "mt-1 mb-1 px-[4px] rounded-lg hover:bg-gray-100"}
            >
              <button className="cursor-pointer rounded-lg [border:none] overflow-hidden flex flex-row items-center justify-start">
                <img className="relative w-[40px] h-[40px] shrink-0 overflow-hidden object-cover" alt="" src={itemData.icon} />
                <div className="flex flex-col text-left px-[8px] py-[8px]">
                  <label className="cursor-pointer relative text-xl tracking-[0.03em] font-bold h-[23px] shrink-0 truncate overflow-hidden line-clamp-2">{itemData.title}</label>
                  <label className="cursor-pointer relative text-base tracking-[0.03em] h-[23px] shrink-0 truncate overflow-hidden line-clamp-2">{itemData.username}</label>
                </div>
              </button>
            </NavLink>
           )
          }
          </div>
          <Button
            buttonType="blue"
            icon="/icbaselineplus.svg"
            buttonClassName="absolute bottom-[1.2rem] right-[1.2rem] h-[3rem] w-[3rem] z-[100] rounded-[rem]"
            onClick={()=>navigate("new")}
          />
        </div>
        <Outlet context={[ itemDataList, updateItem ]}/>
      </div>
    </div>
  );
};

export default AppHome;
