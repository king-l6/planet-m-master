/*
 * @Author: Yixeu
 * @Date: 2021-11-01 15:21:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-12 19:19:58
 * @Description: 组件-TabBar
 */

import React, { FC, useState, useEffect } from 'react';
import './index.less';

type IProps = {
  dataArr: Array<DataArrType>,
  activeTab: number,
  changeTab: (key: number) => void,
  tabAmount?: { collectionCount: number, participateCount: number, publishCount: number },
  width?: string;
}

interface DataArrType {
  key: number,
  text: string,
  amount?: number | string,
  egText?: string
}

const BarAverage: FC<IProps> = ({ dataArr, activeTab, changeTab, tabAmount }) => {

  const [offsetLength, setOffsetLength] = useState(null);

  const getOffsetLength = () => {
    /**
         * @description: 计算tab底标偏移量
         * @param {*} 
         * @return {*}
         */
    const focusIndex = dataArr.findIndex((s) => s.key === activeTab);
    const count = (document.getElementsByClassName('c-average-bar-tab')[focusIndex] as HTMLElement).offsetLeft + (document.getElementsByClassName('c-average-bar-tab')[focusIndex].clientWidth - 20) / 2;
    setOffsetLength(count);
  };

  useEffect(() => {
    getOffsetLength();
  }, []);

  useEffect(() => {
    getOffsetLength();
  }, [activeTab]);

  return <div className="c-average-bar">
    {
      dataArr && dataArr.map((data: DataArrType) => {
        return <span
          key={data.key}
          className={activeTab === data.key ? 'c-average-bar-tab tab-active' : 'c-average-bar-tab'}
          onClick={() => { changeTab(data.key); }}
        >
          {data.text}
          {data.egText&&tabAmount ? <span className="c-average-bar-amount">{(tabAmount as any)[data.egText]}</span>:null}
        </span>;
      })
    }
    {
      offsetLength ? <div className="c-average-bar-line" style={{ transform: `translateX(${offsetLength}px)` }} /> : null
    }
  </div>;
};

export { BarAverage };
export default BarAverage;
