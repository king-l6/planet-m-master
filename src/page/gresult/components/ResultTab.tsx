import React, { FC } from 'react';

interface IProps {
  tabConfig: Array<{ text: string }>
  orderType:number
  changeTab:(key:number)=>void
  total:number
}
const ComponentTab: FC<IProps> = ({ tabConfig, orderType,changeTab, total }) => {
  
  return (
    <div className='c-resTab'>
      <div>
        {
          tabConfig.map((tab: any, idx: number) => {
            return <div 
              key={idx} 
              className={tab.key === orderType?'c-resTab-active':''}
              onClick={()=>{changeTab(tab.key);}}
            >
              {tab.text}
            </div>;
          })
        }
      </div>
      {/* {
        total?<div>{`共${total<=1000?total:'1000+'}条结果`}</div> : null
      } */}
      
    </div>
  );
};
export {ComponentTab};
export default ComponentTab;