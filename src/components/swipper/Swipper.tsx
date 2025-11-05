/*
 * @Author: Yixeu
 * @Date: 2022-03-18 12:35:18
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-24 10:24:47
 * @Description:
 */

import React, { FC, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Swiper } from 'antd-mobile';
import { ComponentCard } from '../';
import IMGLEFT from '@/assets/top_words@2x.png';
import IMGBG from '@/assets/top_bg@2x.png';
import { MESSAGEBKGPIC } from '@/assets/image';
import { useHistory } from 'react-router';

import './index.less';

interface IProps {
  dataArr: Array<any>;
}
const Swipper: FC<IProps> = ({ dataArr }) => {
  const History = useHistory();

  const toPage = (data: any) => {
    /**
         * @description: 跳转文章页面
         * @param {*}
         * @return {*}
         */
    const { pathname } = History.location;
    History.push(
      `/detail?tId=${data.businessId}&skeleton=${
        data.commentCount === 1 ? 1 : data.commentCount ? 5 : 0
      }&h=4&from=homeCommand`
    );
  };
  return (
    <div className={'c-swipper'}>
      {dataArr && dataArr.length > 1 ? (
        <Swiper
          autoplay={dataArr && dataArr.length > 1 ? true : false}
          loop={true}
          autoplayInterval={5000}
          indicator={() => {
            return null;
          }}
        >
          {dataArr.map((s: any, index: number) => {
            return (
              <Swiper.Item
                key={s.businessId}
                onClick={() => {
                  toPage(s);
                }}
              >
                <div className="c-swipper-item">
                  <img src={IMGLEFT} />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: s.title,
                    }}
                  ></div>
                  <img src={IMGBG} className="c-swipper-bg" />
                </div>
              </Swiper.Item>
            );
          })}
        </Swiper>
      ) : (
        <div
          className="c-swipper-item"
          onClick={() => {
            toPage(dataArr[0]);
          }}
        >
          <img src={IMGLEFT} />
          <div
            dangerouslySetInnerHTML={{
              __html: dataArr[0].title,
            }}
          ></div>
          <img src={IMGBG} className="c-swipper-bg" />
        </div>
      )}
    </div>
  );
};
export { Swipper };
export default Swipper;
