import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDidUpdate } from 'hooooks';
import { PullToRefresh, InfiniteScroll } from 'antd-mobile';
import { HOMEAPI } from '@/api';
import { Tab } from './components/index';
import { ComponentCard } from '@/components';
import { isMaxList } from '@/mixin';
import { LOADINGPIC, PIC_EMPTY } from '@/assets/image.ts';
import { uniqBy } from 'lodash';

import './index.less';
import { useDidRecover } from 'react-router-cache-route';

const pageSize = 10;
const Result = () => {
  const History = useHistory();

  const [defaultNum, setDefaultNum] = useState<number>(1); //默认 - 页码
  const [hotNum, setHotNum] = useState<number>(1); //最热 - 页码
  const [latestNum, setLatestNum] = useState<number>(1); //最新 - 页码

  const [defaultPageMax, setDefaultPageMax] = useState(1); //默认 - 最大页数
  const [latestPageMax, setLatestPageMax] = useState(1); //最新 - 最大页数
  const [hotPageMax, setHotPageMax] = useState(1); //最热 - 最大页数

  const [defaultList, setDefaultList] = useState(null); // 综合 - 列表
  const [hotList, setHotList] = useState(null); // 最热 - 列表
  const [latestList, setLatestList] = useState(null); // 最新 - 列表

  const [defaultTotal, setDefaultTotal] = useState(null); //综合 - 总数量
  const [hotTotal, setHotTotal] = useState(null); // 最热 - 总数量
  const [latestTotal, setLatestTotal] = useState(null); // 最新 - 总数量

  const [defaultScrollId, setDefaultScrollId] = useState(''); //综合 - 总数量
  const [hotScrollId, setHotScrollId] = useState(''); // 最热 - 总数量
  const [latestScrollId, setLatestScrollId] = useState(''); // 最新 - 总数量

  const [orderType, setOrderType] = useState<number>(3); // 最热 or 最新

  const tabConfig = [
    { text: '默认', key: 3 },
    { text: '按最新', key: 2 },
  ];

  const routeParams = new URLSearchParams(History.location.search);
  const searchValue = routeParams.get('searchValue');

  const [isIsDefaultMaxList, setIsDefaultMaxList] = useState(true); //滚动加载判断是否有新数据
  const [isIsLatestMaxList, setIsLatestMaxList] = useState(true); //滚动加载判断是否有新数据

  const currentVersion = sessionStorage.getItem('app_version');

  useDidUpdate(() => {
    if (searchValue && searchValue.trim() != '') {
      if (orderType === 3) {
        setDefaultList(null);
      } else if (orderType) {
        setLatestList(null);
      } else {
        setHotList(null);
      }
      getArticleList(searchValue, false, true);
    }
  }, [searchValue]);

  useEffect(() => {
    if (searchValue && searchValue.trim() != '') {
      getArticleList(searchValue, false, true);
    }
  }, [orderType]);

  const getArticleList = async (
    value: any,
    showMore?: boolean,
    orderTypeChanged?: boolean
  ) => {
    /**
         * @description: 接口 - 获取搜索结果。
         * @param {*}
         * @return {*}
         */
    try {
      let pageNum = null;
      let pn = 0;
      if (showMore) {
        pn = 1;
      }
      if (orderTypeChanged) {
        pageNum = 1;
      } else {
        if (pn === 0) {
          if (orderType === 1) {
            pageNum = hotNum;
          } else if (orderType === 3) {
            pageNum = defaultNum;
          } else {
            pageNum = latestNum;
          }
        } else {
          if (orderType === 3) {
            pageNum = defaultNum + pn;
          } else if (orderType === 1) {
            pageNum = hotNum + pn;
          } else {
            pageNum = latestNum + pn;
          }
        }
      }

      const res: any = await HOMEAPI._getArticleList({
        pageNum,
        pageSize: 10,
        order: orderType,
        scrollId:
                    pn === 0
                      ? ''
                      : orderType === 3
                        ? defaultScrollId
                        : orderType === 1
                          ? hotScrollId
                          : latestScrollId,
        searchKey: encodeURIComponent(encodeURIComponent(value)),
      });
      if (orderType === 3) {
        if (res.total === -1) {
          setDefaultTotal('');
        } else {
          res.total > 1000
            ? setDefaultTotal('1000+')
            : setDefaultTotal(res.total);
        }

        defaultList && pn === 1
          ? setDefaultList(
            uniqBy(
              [...defaultList, ...res.articleReplyList],
              'businessId'
            )
          )
          : setDefaultList(res.articleReplyList);
        orderTypeChanged
          ? setDefaultNum(1)
          : setDefaultNum(defaultNum + pn);
        setDefaultPageMax(res.total);
        setDefaultScrollId(res.scrollId);
        setIsDefaultMaxList(
          res &&
                        res.articleReplyList &&
                        res.articleReplyList.length === pageSize
            ? false
            : true
        );
      } else if (orderType === 1) {
        res.total > 1000
          ? setHotTotal('1000+')
          : setHotTotal(res.total);
        hotList && pn === 1
          ? setHotList([...hotList, ...res.articleReplyList])
          : setHotList(res.articleReplyList);
        orderTypeChanged ? setHotNum(1) : setHotNum(hotNum + pn);
        setHotPageMax(res.total);
        setHotScrollId(res.scrollId);
      } else {
        if (res.total === -1) {
          setDefaultTotal('');
        } else {
          res.total > 1000
            ? setLatestTotal('1000+')
            : setLatestTotal(res.total);
        }
        latestList && pn === 1
          ? setLatestList(
            uniqBy(
              [...latestList, ...res.articleReplyList],
              'businessId'
            )
          )
          : setLatestList(res.articleReplyList);
        orderTypeChanged
          ? setLatestNum(1)
          : setLatestNum(latestNum + pn);
        setLatestPageMax(res.total);
        setLatestScrollId(res.scrollId);
        setIsLatestMaxList(
          res &&
                        res.articleReplyList &&
                        res.articleReplyList.length === pageSize
            ? false
            : true
        );
      }
      (window as any)?._sendTrack?.({ sa: value }, true);
    } catch (error) {
      console.info(error);
    }
  };
    // const getMoreData = () => {
    //   /**
    //    * @description: 滚动加载。
    //    * @param {*}
    //    * @return {*}
    //    */
    // if (orderType === 3 && defaultList && !isMaxList(defaultPageMax, defaultList.length)) {
    //   return true;
    // }
    // if (orderType === 1 && hotList && !isMaxList(hotPageMax, hotList.length)) {
    //   return true;
    // }
    // if (orderType === 2 && latestList && !isMaxList(latestPageMax, latestList.length)) {
    //   return true;
    // }
    // };

  return (
    <div className="search-page-result">
      <div className="search-page-result-head">
        <Tab
          tabConfig={tabConfig}
          orderType={orderType}
          total={
            orderType == 1
              ? hotTotal
              : orderType == 2
                ? latestTotal
                : defaultTotal
          }
          changeTab={(key: number) => {
            setOrderType(key);
          }}
        />
      </div>

      {defaultList && orderType === 3 ? (
        defaultList.length > 0 ? (
          <div
            className={
              parseInt(currentVersion) === 2
                ? 'search-page-result-content-v2'
                : 'search-page-result-content'
            }
          >
            <PullToRefresh
              onRefresh={async () => {
                getArticleList(searchValue, false, true);
              }}
              renderText={(status) => {
                return (
                  <img
                    style={{
                      width: '123px',
                      height: '107px',
                    }}
                    src={LOADINGPIC}
                  />
                );
              }}
            >
              {defaultList?.map((item: any) => {
                return item.hide && item.hide === 1 ? null : (
                  <ComponentCard
                    key={item.businessId}
                    data={item}
                    lunarH={1}
                    hideType={
                      parseInt(currentVersion) === 2
                        ? false
                        : true
                    }
                  />
                );
              })}
            </PullToRefresh>
            <InfiniteScroll
              loadMore={() => getArticleList(searchValue, true)}
              hasMore={!isIsDefaultMaxList}
            ></InfiniteScroll>
          </div>
        ) : (
          <div className="no-result">
            <img src={PIC_EMPTY} alt="" />
            <div>这里什么都没有叻～</div>
          </div>
        )
      ) : null}

      {hotList && orderType === 1 ? (
        hotList.length > 0 ? (
          <div
            className={
              parseInt(currentVersion) === 2
                ? 'search-page-result-content-v2'
                : 'search-page-result-content'
            }
          >
            <PullToRefresh
              onRefresh={async () => {
                getArticleList(searchValue, false, true);
              }}
              renderText={(status) => {
                return (
                  <img
                    style={{
                      width: '123px',
                      height: '107px',
                    }}
                    src={LOADINGPIC}
                  />
                );
              }}
            >
              {hotList?.map((item: any) => {
                return item.hide && item.hide === 1 ? null : (
                  <ComponentCard
                    key={item.businessId}
                    data={item}
                    lunarH={1}
                    hideType={
                      parseInt(currentVersion) === 2
                        ? false
                        : true
                    }
                  />
                );
              })}
            </PullToRefresh>
            <InfiniteScroll
              loadMore={() => getArticleList(searchValue, true)}
              hasMore={!isMaxList}
            ></InfiniteScroll>
          </div>
        ) : (
          <div className="no-result">
            <img src={PIC_EMPTY} alt="" />
            <div>这里什么都没有叻～</div>
          </div>
        )
      ) : null}

      {latestList && orderType === 2 ? (
        latestList.length > 0 ? (
          <div
            className={
              parseInt(currentVersion) === 2
                ? 'search-page-result-content-v2'
                : 'search-page-result-content'
            }
          >
            <PullToRefresh
              onRefresh={async () => {
                getArticleList(searchValue, false, true);
              }}
              renderText={(status) => {
                return (
                  <img
                    style={{
                      width: '123px',
                      height: '107px',
                    }}
                    src={LOADINGPIC}
                  />
                );
              }}
            >
              {latestList?.map((item: any) => {
                return item.hide && item.hide === 1 ? null : (
                  <ComponentCard
                    key={item.businessId}
                    data={item}
                    lunarH={1}
                    hideType={
                      parseInt(currentVersion) === 2
                        ? false
                        : true
                    }
                  />
                );
              })}
            </PullToRefresh>
            <InfiniteScroll
              loadMore={() => getArticleList(searchValue, true)}
              hasMore={!isIsLatestMaxList}
            ></InfiniteScroll>
          </div>
        ) : (
          <div className="no-result">
            <img src={PIC_EMPTY} alt="" />
            <div>这里什么都没有叻～</div>
          </div>
        )
      ) : null}
    </div>
  );
};
export { Result };
export default Result;
