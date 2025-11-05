/*
 * @Author: Yixeu
 * @Date: 2021-11-01 15:21:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-24 16:45:57
 * @Description: 组件-TabBar
 */

import React, { FC, useContext, useEffect } from 'react';
import { backToTop, IsPc } from '@/mixin';
import './index.less';
import { Store } from '@/store';

type IProps = {
  dataArr: Array<DataArrType>,
  activeTab: number | string,
  changeTab: (key: number) => void,
  width?: string;
  extra?: React.ReactElement;
}

interface DataArrType {
  key: number,
  text: string
}

const BarWithExtra: FC<IProps> = ({ dataArr, activeTab, changeTab, extra }) => {
  const { state, dispatch } = useContext(Store);

  const handleTabClick = (tabKey:any) => {
    if(activeTab == tabKey){
      dispatch({
        value:{
          ...state,
          isRefresh:true
        }
      });
    }else{
      changeTab(tabKey); 
    }
    
  };
 
  return <div className="c-extra-bar">
    {
      dataArr && dataArr.map((data: DataArrType) => {
        return <span
          key={data.key}
          className={activeTab === data.key ? 'c-extra-bar-tab tab-active' : 'c-extra-bar-tab'}
          onClick={() => { handleTabClick(data.key);}}
        >
          {data.text}
        </span>;
      })
    }
    <div className="c-extra-bar-line" style={{ transform: `translateX(${24 + (dataArr.findIndex((s) => s.key === activeTab)) * 68}px)` }} />
    <div className="c-extra-bar-extra">
      { extra}
    </div>

  </div>;
};

export { BarWithExtra };
export default BarWithExtra;
