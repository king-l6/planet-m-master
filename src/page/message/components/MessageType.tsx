import React, { FC, useEffect } from 'react';
import SvgIcon from '@/components/svgicon';

interface IProps {
  text: any
  count?: number
  picUrl:any
  onClick?:()=>void
}
const ComponentType: FC<IProps> = ({ text, count, onClick, picUrl }) => {

  return (
    <div className="message-card" onClick={()=>{onClick();}}>
      <div className='fakeIcon'>
        <img src={picUrl} alt="" />
      </div>
      <span>{text}</span>
      {count && count>0  ? <div className='message-count'>{count < 1000 ? count : `${count-1}+`}</div> : null}
      <SvgIcon type="icon-arrow_into_right_line" />
    </div>
  );
};
export {ComponentType};
export default ComponentType;