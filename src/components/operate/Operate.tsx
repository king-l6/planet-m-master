/*
 * @Author: Yixeu
 * @Date: 2021-11-02 19:19:40
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-01-22 15:32:39
 * @Description: 组件-操作栏
 */

import React, { FC, useState, useRef, useEffect } from 'react';
import { ComponentSvgIcon } from '../';
import { OPERATEAPI } from '@/api';
import OperateProps from './index.d';
import { Toast } from 'antd-mobile';
import { showFlower, uuid } from '@/mixin';
import { useHistory } from 'react-router';
import './index.less';

const Operate: FC<OperateProps> = (
  { disable,
    isOwner,
    isFav,
    isLike,
    likeCount,
    commentCount,
    favoriteCount,
    businessId,
    businessType,
    parentCommentCount,
    pathname,
    orderType,
    lunarH }) => {

  const History = useHistory();

  const [stateIsFav, setStateIsFav] = useState(isFav);
  const [stateIsLike, setStateIsLike] = useState(isLike);

  const [stateLikeCount, setStateLikeCount] = useState(likeCount);
  const [stateFavoriteCount, setStateFavoriteCount] = useState(favoriteCount);
  const [favorPicture, setFavorPicture] = useState(null);
  const RefLikeTime = useRef(null as any);
  const RefStarTime = useRef(null as any);


  useEffect(() => {
    /**
     * @description: 组件销毁前清楚定时器
     * @param {*}
     * @return {*}
     */
    return () => {
      if (RefLikeTime.current) {
        clearTimeout(RefLikeTime.current);
      }
      if (RefStarTime.current) {
        clearTimeout(RefStarTime.current);
      }
    };
  }, []);

  const toLike = (e: any) => {
    /**
     * @description: 点赞 or 取消点赞
     * @param {*}
     * @return {*}
     */
    e.stopPropagation();
    // if (stateIsLike === 0) {
    //   showFlower(e, 'c-operate-favor', 2800);
    // }
    setStateLikeCount(stateIsLike === 0 ? stateLikeCount + 1 : stateLikeCount - 1);
    setStateIsLike(stateIsLike === 0 ? 1 : 0);
    throttleLikeRequest(stateIsLike === 0 ? 1 : 0);
  };

  const toStar = (e: any) => {
    /**
     * @description: 收藏 or 取消收藏
     * @param {*}
     * @return {*}
     */
    e.stopPropagation();
    setStateFavoriteCount(stateIsFav === 0 ? stateFavoriteCount + 1 : stateFavoriteCount - 1);
    setStateIsFav(stateIsFav === 0 ? 1 : 0);
    throttleStarRequest(stateIsFav === 0 ? 1 : 0);
  };

  const submitIsLike = async (value: number) => {
    /**
     * @description: 接口 - 点赞
     * @param {*}
     * @return {*}
     */
    try {
      await OPERATEAPI._postToLike({
        businessId,
        businessType,
        like: value
      });
      //列表中点赞埋点
      (window as any)?._sendTrack?.({ nf: 1, sf:businessId}, true);
    } catch (e) {
      console.info(e);
    }
  };

  const submitIsStar = async (value: number) => {
    /**
     * @description: 接口 - 收藏
     * @param {*}
     * @return {*}
     */
    try {
      await OPERATEAPI._postToStar({
        businessId,
        businessType,
        fav: value
      });
      (window as any)?._sendTrack?.({ ne: 1, sf:businessId}, true);

    } catch (e) {
      console.info(e);
    }
  };

  const throttleLikeRequest = (value: number) => {
    /**
     * @description: 节流 - 点赞
     * @param {*} RefLikeTime
     * @return {*}
     */
    if (RefLikeTime.current) {
      clearTimeout(RefLikeTime.current);
    }
    RefLikeTime.current = setTimeout(() => {
      submitIsLike(value);
    }, 500);
  };

  const throttleStarRequest = (value: number) => {
    /**
     * @description: 节流 - 收藏
     * @param {*} RefStarTime
     * @return {*}
     */
    if (RefStarTime.current) {
      clearTimeout(RefStarTime.current);
    }
    RefStarTime.current = setTimeout(() => {
      submitIsStar(value);
    }, 500);
  };


  const toComment = (e: any) => {
    e.stopPropagation();
    History.push(`/detail?tId=${businessId}&skeleton=${commentCount === 1 ? 1 : commentCount ? 5 : 0}&from=${pathname == '/' ? orderType == 1 ? 'homeCommand' : 'homeNew' : 'personal'}&click=comment${lunarH || lunarH == 0 ? `&h=${lunarH}` : ''}`);
  };

  return <div className="c-operate">
    <span className={stateIsFav ? 'btn-active' : ''} onClick={(e: any) => toStar(e)}>
      <div className='c-operate-item'>
        <ComponentSvgIcon type={stateIsFav ? 'icon-list_star_fill' : 'icon-list_star_line'} />
        <span>{stateFavoriteCount ? stateFavoriteCount > 9999 ? `${Math.floor(stateFavoriteCount / 10000)}万` : stateFavoriteCount : '收藏'}</span>
      </div>
    </span>
    <span onClick={(e) => { toComment(e); }}>
      <div className='c-operate-item'>
        <ComponentSvgIcon type={'icon-list_comment_line'} />
        <span>{commentCount ? commentCount > 9999 ? `${Math.floor(commentCount / 10000)}万` : commentCount : '评论'}</span>
      </div>
    </span>
    <span className={stateIsLike ? 'c-operate-favor btn-active' : 'c-operate-favor'} onClick={(e: any) => toLike(e)}>
      <div className='c-operate-item'>
        <ComponentSvgIcon type={stateIsLike ? 'icon-list_recommend_fill' : 'icon-list_recommend_line'} />
        <span>{stateLikeCount ? stateLikeCount > 9999 ? `${Math.floor(stateLikeCount / 10000)}万` : stateLikeCount : '点赞'}</span>
      </div>
    </span>

  </div >;
};

export { Operate };
export default Operate;
