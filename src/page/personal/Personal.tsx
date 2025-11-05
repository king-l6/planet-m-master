import React, { useContext, useEffect, useState, useRef } from 'react';
import { ComponentCarte, ComponentPopUp } from '@/components';
import * as Components from './components';
import { PERSONALAPI, USERAPI } from '@/api';
import { Store } from '@/store';
import { TypePersonalAPI } from '@/api/index.d';
import { PullToRefresh, InfiniteScroll, Loading, Toast } from 'antd-mobile';
import { LOADINGPIC } from '@/assets/image.ts';
import { useDidRecover } from 'react-router-cache-route';
import { wxShare } from '@/mixin';
import { isIphoneBlackBar } from '@/mixin/tools';

import './index.less';

const pageSize = 10;

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <span>Loading</span>
          <Loading />
        </>
      ) : (
        <span>没有更多啦</span>
      )}
    </>
  );
};

const Personal = () => {

  const [joinListArr, setJoinListArr] = useState(null);  //参与 - 列表
  const [publishListArr, setPublishListArr] = useState(null);  //发布 - 列表
  const [starListArr, setStarListArr] = useState(null);  //收藏 - 列表

  const [joinCursorTime, setJoinCursorTime] = useState('');  //参与 - 锚点时间 取当页最后一条数据时间做锚点
  const [publishCursorTime, setPublishCursorTime] = useState('');  //发布 - 锚点时间 取当页最后一条数据时间做锚点
  const [starCursorTime, setStarCursorTime] = useState('');  //收藏 - 锚点时间 取当页最后一条数据时间做锚点

  const [orderType, setOrderType] = useState<number>(0);

  const [joinPosition, setJoinPosition] = useState(0 as number); //参与 - 滚动位置
  const [publishPosition, setPublishPosition] = useState(0 as number);  //发布 - 滚动位置
  const [starPosition, setStarPosition] = useState(0 as number); //收藏 - 滚动位置

  const [isJoinPageMax, setIsJoinPageMax] = useState(false);  //参与 - 最大页数
  const [isPublishMax, setIsPublishPageMax] = useState(false);  //发布 - 最大页数
  const [isStarPage, setIsStarPageMax] = useState(false);  //收藏 - 最大页数

  const { state, dispatch } = useContext(Store);

  const [tabAmount, setTabAmount] = useState({ collectionCount: 0, participateCount: 0, publishCount: 0 });

  const [topDivState, setTopDivState] = useState(false);

  const RefPersonalPage = useRef<HTMLDivElement>(null);

  const [personShowPopUp,setPersonShowPopUp] = useState(false); //弹框开关;

  const changePersonShowPopUp = (value:any) => {
    setPersonShowPopUp(value);
  };

  useEffect(() => {
    getTabData();
    getBasicData();
  }, []);

  useDidRecover(()=>{
    wxShare();
  });

  const getTabData = async () => {
    /**
     * @description: 接口 - 获取tab字段对应数量
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await PERSONALAPI._getPeronalTabsAmount();
      setTabAmount(res);
    } catch (e) {
      console.info(e);
    }
  };

  const getJoinArticleList = async (showMore?: boolean) => {
    /**
     * @description: 接口 - 参与列表
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await PERSONALAPI._getJoinArticleList({
        pageSize,
        cursorTime: showMore ? joinCursorTime : '',
      } as TypePersonalAPI.APIGetJoinArticleList);
      if (showMore) {
        setJoinListArr([...joinListArr, ...res.list]);
      } else {
        setJoinListArr(res.list);
      }
      if (!res.list || res.list.length < pageSize) {
        setIsJoinPageMax(true);
      } else {
        setIsJoinPageMax(false);
      }
      if (res && res.list && res.list.length > 0) {
        setJoinCursorTime(res.list[res.list.length - 1]['cursorTime']);
      }
      toastSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  const getPublishArticleList = async (showMore?: boolean) => {
    /**
     * @description: 接口 - 发布列表
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await PERSONALAPI._getPublishArticleList({
        cursorTime: showMore ? publishCursorTime : '',
        pageSize,
      } as TypePersonalAPI.APIGetJoinArticleList);
      if (showMore) {
        setPublishListArr([...publishListArr, ...res.list]);
      } else {
        setPublishListArr(res.list);
      }
      if (!res.list || res.list.length < pageSize) {
        setIsPublishPageMax(true);
      } else {
        setIsPublishPageMax(false);
      }
      if (res && res.list && res.list.length > 0) {
        setPublishCursorTime(res.list[res.list.length - 1]['cursorTime']);
      }
      toastSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  const getStarArticleList = async (showMore?: boolean) => {
    /**
     * @description: 接口 - 收藏列表
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await PERSONALAPI._getStarArticleList({
        cursorTime: showMore ? starCursorTime : '',
        pageSize,
      } as TypePersonalAPI.APIGetJoinArticleList);
      if (showMore) {
        setStarListArr([...starListArr, ...res.list]);
      } else {
        setStarListArr(res.list);
      }
      if (!res.list || res.list.length < pageSize) {
        setIsStarPageMax(true);
      } else {
        setIsStarPageMax(false);
      }
      if (res && res.list && res.list.length > 0) {
        setStarCursorTime(res.list[res.list.length - 1]['cursorTime']);
      }
      toastSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (orderType === 1 && !joinCursorTime) {
      getJoinArticleList();
    }
    if (orderType === 0 && !publishCursorTime) {
      getPublishArticleList();
    }
    if (orderType === 2 && !starCursorTime) {
      getStarArticleList();
    }
    scrollAndRefresh(orderType);
  }, [orderType]);

  useEffect(() => {
    if (state.isPullPersonal) {
      setJoinCursorTime('');
      setPublishCursorTime('');
      setStarCursorTime('');
      getTabData();
      if (orderType === 1) {
        getJoinArticleList();
      } else if (orderType === 0) {
        getPublishArticleList();
      } else if (orderType === 2) {
        getStarArticleList();
      }
      dispatch({
        value: { isPullPersonal: false }
      });
    }
  },[state.isPullPersonal]);

  const toastSuccess = () => {
    if(state.isPullPersonal){
      Toast.show({
        icon:'success',
        content: '切换成功',
        duration: 1000,
        maskClickable: false
      });
    }
  };

  const scrollAndRefresh = (order: number) => {
    /**
     * @description: 切换tab记录滚动位置  需要优化DOM
     * @param {*} orderType
     * @return {*}
     */
    const currentScroll = RefPersonalPage.current.scrollTop;
    if (orderType === 2) {
      //  切换tab-收藏 ，页面滚动
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[0] as HTMLDivElement).style.height = '1px';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[0] as HTMLDivElement).style.overflow = 'hidden';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[1] as HTMLDivElement).style.height = '1px';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[1] as HTMLDivElement).style.overflow = 'hidden';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[2] as HTMLDivElement).style.height = 'auto';
      if (currentScroll >= 156) {
        // 小于156 切换过去也漏出顶部card
        RefPersonalPage.current.scrollTo({
          top: starPosition > 156 ? starPosition : 156
        });
      } else {
        RefPersonalPage.current.scrollTo({
          top: currentScroll
        });
      }

    } else if (orderType === 1) {
      //  切换tab-参与 ，页面滚动
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[0] as HTMLDivElement).style.height = '1px';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[0] as HTMLDivElement).style.overflow = 'hidden';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[2] as HTMLDivElement).style.height = '1px';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[2] as HTMLDivElement).style.overflow = 'hidden';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[1] as HTMLDivElement).style.height = 'auto';
      if (currentScroll >= 156) {
        // 小于156 切换过去也漏出顶部card
        RefPersonalPage.current.scrollTo({
          top: joinPosition > 156 ? joinPosition : 156
        });
      } else {

        RefPersonalPage.current.scrollTo({
          top: currentScroll
        });
      }
    } else {
      //  切换tab-发布 ，页面滚动
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[2] as HTMLDivElement).style.height = '1px';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[2] as HTMLDivElement).style.overflow = 'hidden';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[1] as HTMLDivElement).style.height = '1px';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[1] as HTMLDivElement).style.overflow = 'hidden';
      (document.getElementsByClassName('personal-page-container-tab-tabpane')[0] as HTMLDivElement).style.height = 'auto';
      if (currentScroll >= 156) {
        // 小于156 切换过去也漏出顶部card       
        RefPersonalPage.current.scrollTo({
          top: publishPosition > 156 ? publishPosition : 156
        });
      } else {
        RefPersonalPage.current.scrollTo({
          top: currentScroll
        });
      }
    }
  };

  const recordPosition = (order: number) => {
    const currentScroll = RefPersonalPage.current.scrollTop;
    if (orderType === 2) { setStarPosition(currentScroll); }
    if (orderType === 1) { setJoinPosition(currentScroll); }
    if (orderType === 0) { setPublishPosition(currentScroll); }
    setOrderType(order);
  };

  const getMoreData = () => {
    if (orderType === 0 && !isPublishMax && publishListArr) return true;
    if (orderType === 1 && !isJoinPageMax && joinListArr) return true;
    if (orderType === 2 && !isStarPage && starListArr) return true;
    return false;
  };

  const getBasicData = async () => {
    /**
     * @description: 接口 - 获取用户基本信息
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await USERAPI._getUserInfo();
      dispatch({
        value: { 
          userInfo: res
        }
      });
    } catch (e) {
      console.info(e);
    }
  };

  const refreshList = () => {
    if (orderType === 0) getPublishArticleList();
    if (orderType === 1) getJoinArticleList();
    if (orderType === 2) getStarArticleList();
    getTabData();
    getBasicData();
  };

  const getDataByOrder = async () => {
    await new Promise((resolve, reject) => {
      if (orderType === 0) {
        getPublishArticleList(true).then(() => {
          resolve('成功');
        });
      } else if (orderType === 1) {
        getJoinArticleList(true).then(() => {
          resolve('成功');
        });
      } else {
        getStarArticleList(true).then(() => {
          resolve('成功');
        });
      }
    });
  };
  const PersonPageScroll = () => {
    /**
     * @description: tab吸顶时，紧贴下方出现一个背景条
     * @param {*} orderType
     * @return {*}
     */
    if ((document.querySelector('.c-average-bar') as any)?.offsetTop > 156 && !topDivState) {
      setTopDivState(true);
    }
    if ((document.querySelector('.c-average-bar') as any)?.offsetTop <= 156 && topDivState) {
      setTopDivState(false);
    }
  };
  return (
    <div className={isIphoneBlackBar() ? 'personal-page personalPage' : 'personal-page'} ref={RefPersonalPage} onScroll={PersonPageScroll}>
      <PullToRefresh
        onRefresh={async () => {
          refreshList();
        }}
        renderText={status => {
          return <img style={{ width: '123px', height: '107px' }} src={LOADINGPIC} />;
        }}
      >
        <ComponentCarte nickName={state.userInfo.nickName} workCode={state.userInfo.workCode} avatarUrl={state.userInfo.avatarUrl}
          msgToast={state.userInfo.msgNum > 0 ? true : false} changePersonShowPopUp={changePersonShowPopUp}
        />
        <Components.Container
          tabAmount={tabAmount}
          joinDataSource={joinListArr}
          starDataSource={starListArr}
          publishDataSource={publishListArr}
          tabActive={orderType}
          changeTab={(order: number) => {
            recordPosition(order);
          }}
          topDivState={topDivState}
        />
        {orderType == 1 && joinListArr && joinListArr.length > 0 ? <InfiniteScroll loadMore={() => getDataByOrder()} hasMore={getMoreData()} >
          <InfiniteScrollContent hasMore={getMoreData()} />
        </InfiniteScroll> : null}
        {orderType == 0 && publishListArr && publishListArr.length > 0 ? <InfiniteScroll loadMore={() => getDataByOrder()} hasMore={getMoreData()} >
          <InfiniteScrollContent hasMore={getMoreData()} />
        </InfiniteScroll> : null}
        {orderType == 2 && starListArr && starListArr.length > 0 ? <InfiniteScroll loadMore={() => getDataByOrder()} hasMore={getMoreData()} >
          <InfiniteScrollContent hasMore={getMoreData()} />
        </InfiniteScroll> : null}
      </PullToRefresh>
      <ComponentPopUp.PopUpTon identityList={state.userInfo.identityList} personShowPopUp={personShowPopUp} changePersonShowPopUp={changePersonShowPopUp}/>
    </div>

  );
};

export { Personal };
export default Personal;
