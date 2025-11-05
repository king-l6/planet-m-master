import React, { Context, FC, useContext, useRef, useState,useEffect } from 'react';
import { USERAPI } from '@/api';
import { Popup } from 'antd-mobile';
import { Store } from '@/store';
import './idx.less';
import SvgIcon from '@/components/svgicon';

interface IProps {
  identityList:Array<[]>;
  personShowPopUp:boolean;
  changePersonShowPopUp:(value:boolean) => void;
}

const PopUpTon: FC<IProps> = ({ identityList,personShowPopUp,changePersonShowPopUp }) => {
  
  const { state, dispatch } = useContext(Store);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchMoveX, setTouchMoveX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchMoveY, setTouchMoveY] = useState(null);

  const handleTouchStart = (e: any) => {
    e.preventDefault();
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: any) => {
    e.preventDefault();
    setTouchMoveX(e.touches[0].clientX);
    setTouchMoveY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: any) => {
    /**
     * @description:
     *  1.手势下滑距离超过某个值
     *  2.当滚动条处于顶部
     *  3.横向滑动距离不超过某个值
     * @param {*}
     * @return {*}
     */
    const contentScroll = document.getElementsByClassName('c-popuper-content')[0].scrollTop;
    if (touchMoveY - touchStartY > 0 && contentScroll == 0 && Math.abs(touchMoveX - touchStartX) < 40) {
      closePopUp();
    }
  };

  const getBasicData = async () => {
    /**
     * @description: 接口 - 获取用户基本信息
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await USERAPI._getUserInfo();
      closePopUp();
      dispatch({
        value: { 
          userInfo: res,
          isPullPersonal: true
        }
      });
    } catch (e) {
      console.info(e);
    }
  };

  const closePopUp = () => {
    changePersonShowPopUp(false);
  };

  const switchOfficel = (e:any) => {
    if ( e.current ) {
      closePopUp();
    } else {
      getBasicData();
    }
    if(e.official){
      sessionStorage.setItem('workCode', e.workCode);
    } else {
      sessionStorage.removeItem('workCode');
    }
  };

  return <Popup
    visible={personShowPopUp}
    onMaskClick={() => {
      closePopUp();
    }}
    bodyClassName='c-popuper'
  >
    <div className='c-popuper-content'
      onTouchMove={(e) => { handleTouchMove(e); }}
      onTouchStart={(e) => { handleTouchStart(e); }}
      onTouchEnd={(e) => { handleTouchEnd(e); }}
    >
      <div className='c-popuper-content-head'>
        <div>请选择账号</div>
        <SvgIcon type="icon-at_delete" onClick={() => {closePopUp();}} className='delete' />
      </div>
      <div className='c-popuper-content-accountList'>
        {
          identityList?.map((item:any, index:number) => {
            return (
              <div className='c-popuper-content-accountList-wrap'
                key={index}
                onClick={()=>{switchOfficel(item);}}
              >
                <div>
                  <div>
                    <img src={item.avatarUrl} alt="" />
                    {item.workCode.includes('BB') ? <SvgIcon type="icon-V_icon" className='avar' /> : null}
                  </div>
                  <div>{item.nickName}</div>
                </div>
                {item.current ? <div className='c-popuper-content-accountList-wrap-account'>当前账号</div> : <></>}
              </div>
            );
          })
        }
      </div>
    </div>
  </Popup>;
};

export { PopUpTon };
export default PopUpTon;

