/*
 * @Author: Yixeu
 * @Date: 2021-11-01 14:44:27
 * @LastEditors: Yixeu
 * @LastEditTime: 2021-12-14 14:28:53
 * @Description: 组件-广告位
 */
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { PICPLANET, PICPLANETSTATIC, BANNER_PC } from '@/assets/image.ts';
import { IsPc } from '@/mixin';
import './index.less';

const Advertise = () => {

  const imgStyle = useRef(null);
  useEffect(() => {

  }, []);

  const isComplete = () => {
    imgStyle.current.style.opacity = 0;
  };

  return <div className="c-advertise">
    {
      !IsPc() ? (
        <>
          <img src={PICPLANET} onLoad={isComplete} />
          <img ref={imgStyle} src={PICPLANETSTATIC} />
        </>) : (
        <img  src={BANNER_PC} />
      )
    }

    <div className='c-advertise-border'></div>
  </div>;
};

export { Advertise };
export default Advertise;
