import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react';
import {
  ComponentAdvertise,
  ComponentSwipper,
  ComponentSvgIcon,
} from '@/components';
import { HOMEAPI, BROWSEAPI, USERAPI } from '@/api';
import * as Components from './components';
import { TypeHomeAPI } from '@/api/index.d';
import { InfiniteScroll, Loading, PullToRefresh } from 'antd-mobile';
import { backToTop, isMaxList, IsPc, wxShare } from '@/mixin';
import { LOADINGPIC } from '@/assets/image.ts';
import { dropByCacheKey, useDidRecover } from 'react-router-cache-route';
import { uniqBy } from 'lodash';
import { Store } from '@/store';
import { useDidMount } from 'hooooks';
import { useHistory } from 'react-router-dom';
import './index.less';

const pageSize = 10;
let initScroll = 0;

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

const Home = () => {
  const History = useHistory();
  const routeParams = new URLSearchParams(History.location.search) as any;
  const { state, dispatch } = useContext(Store);
  const bf = sessionStorage.getItem('bf');
  const [recommendPageNum, setRecommendPageNum] = useState<number>(1); //推荐 - 页码
  const [lastPageNum, setLastPageNum] = useState<number>(1); //最新 - 页码
  // const [orderType, setOrderType] = useState<number>(bf && bf === '1' ? 2 : 1); //推荐 or 最新
  const [orderType, setOrderType] = useState<number>(1); //推荐 or 最新

  const [recommendScrollId, setRecommendScrollId] = useState<string>(''); //推荐 - 锚点
  const [lastScrollId, setLastScrollId] = useState<string>(''); //最新 - 锚点

  const [recommendList, setRecommendList] = useState(null as Array<any>); //推荐 - 列表
  const [lastList, setLastList] = useState(null); //最新 - 列表

  const [recommendPosition, setRecommendPosition] = useState(0 as number); //推荐 - 滚动位置
  const [lastPosition, setLastPosition] = useState(0 as number); //最新 - 滚动位置

  const [recommendPageMax, setRecommendPageMax] = useState(1); //推荐 - 最大页数
  const [isRecommendPageMax, setIsRecommendPageMax] = useState(true); //  判断当前页是不是到底

  const [lastPageMax, setLastPageMax] = useState(1); //最新 - 最大页数

  const RefHomePage = useRef<HTMLDivElement>(null);

  const [topDivState, setTopDivState] = useState(false);

  const [swipperList, setSwipperList] = useState([]);

  const timerRef = useRef(null);
  const [isStop, setIsStop] = useState(true);

  const currentVersion = sessionStorage.getItem('app_version');

  const [isScrollingUp, setisScrollingUp] = useState(false);

  let beforeScrollState = 0;
  let afterScrollState = 0;

  
  const browseNumber = async (data: any) => {
    /**
     * @description: 接口 - 列表中帖子加载次数
     * @param {*}
     * @return {*}
     */
    try {
      const res = await BROWSEAPI._getBrowseArticle(data);
    } catch (error) {
      console.info(error);
    }
  };
  const getArticleList = async (showMore?: boolean) => {
    /**
     * @description: 接口 - 获取首页列表 根据orderType不同，分开缓存
     * @param {*}
     * @return {*}
     */
    try {
      let pn = 0;
      if (showMore) {
        pn = 1;
      }
      const res: any = await HOMEAPI._getArticleList({
        pageNum:
          pn === 0
            ? 1
            : orderType === 1
              ? recommendPageNum + pn
              : lastPageNum + pn,
        pageSize,
        order: 2,
        scrollId:
          pn === 0
            ? ''
            : orderType === 1
              ? recommendScrollId
              : lastScrollId,
      } as TypeHomeAPI.APIGetArticleList);
      if (orderType === 1) {
        //  记录后端需要的页面锚点
        setRecommendScrollId(res.scrollId);
        // setRecommendPageMax(res.total);
        setIsRecommendPageMax(
          res &&
            res.articleReplyList &&
            res.articleReplyList.length === pageSize
            ? false
            : true
        );
        if (pn === 1) {
          setRecommendList(
            uniqBy(
              [...recommendList, ...res.articleReplyList],
              'businessId'
            )
          );
          setSwipperList([
            ...swipperList,
            ...res.articleReplyList.filter((s: any) => {
              return s.articleStatus === 99;
            }),
          ]);
        } else {
          setRecommendList(res.articleReplyList);
          setSwipperList(
            res.articleReplyList.filter((s: any) => {
              return s.articleStatus === 99;
            })
          );
        }
      } else {
        //  记录后端需要的页面锚点
        setLastScrollId(res.scrollId);
        setLastPageMax(res.total);
        if (pn === 1) {
          setLastList([...lastList, ...res.articleReplyList]);
        } else {
          setLastList(res.articleReplyList);
        }
      }
      if (pn === 1) {
        if (orderType === 1) {
          setRecommendPageNum(recommendPageNum + pn);
        } else {
          setLastPageNum(lastPageNum + pn);
        }
      } else {
        if (orderType === 1) {
          setRecommendPageNum(1);
        } else {
          setLastPageNum(1);
        }
      }

      //帖子浏览数量+1
      const data = {
        businessIdList: res.articleReplyList?.map(
          (item: any) => item.businessId
        ),
      };
      browseNumber(data);
      //滚动加载埋点
      (window as any)?._sendTrack?.(
        { sc: `${data.businessIdList.toString()}` },
        true
      );
    } catch (e) {
      console.error(e);
    }
  };

  useLayoutEffect(() => {
    sessionStorage.setItem('copLink', '1');
  }, []);
  useEffect(() => {
    /**
     * @description: 监听tab切换-只有第一次的tab切换是加载数据的
     * @param {*} param1
     * @return {*}
     */
    if (
      (orderType === 2 && !lastList) ||
      (orderType === 1 && !recommendList)
    ) {
      getArticleList();
    }

    recordPositionAndRefresh(orderType);
  }, [orderType]);

  useEffect(() => {
    /**
     * @description: 滑动到顶部并刷新数列表
     * @param {*} param1
     * @return {*}
     */
    if (state.isRefresh && isStop && RefHomePage.current.scrollTop !== 0) {
      backToTop(RefHomePage.current, true);
      getArticleList();
      dispatch({
        value: {
          ...state,
          isRefresh: false,
        },
      });
    }
  }, [state.isRefresh, isStop]);

  const recordPositionAndRefresh = (order: number) => {
    /**
     * @description: 切换tab记录滚动位置  需要优化DOM
     * @param {*} orderType
     * @return {*}
     */
    const currentScroll = RefHomePage.current.scrollTop;
    if (orderType === 2) {
      //  切换tab-最新，记录tab-推荐位置，页面滚动tab-最新位置
      (
        document.getElementsByClassName(
          'home-page-container-tab-tabpane'
        )[0] as HTMLDivElement
      ).style.height = '1px';
      (
        document.getElementsByClassName(
          'home-page-container-tab-tabpane'
        )[0] as HTMLDivElement
      ).style.overflow = 'hidden';
      (
        document.getElementsByClassName(
          'home-page-container-tab-tabpane'
        )[1] as HTMLDivElement
      ).style.height = 'auto';
      if (currentScroll >= 132) {
        // 小于120 切换过去也漏出顶部card
        setRecommendPosition(currentScroll);
        RefHomePage.current.scrollTo({
          top: lastPosition > 132 ? lastPosition : 132,
        });
      } else {
        setRecommendPosition(currentScroll);
        RefHomePage.current.scrollTo({
          top: currentScroll,
        });
      }
    } else {
      //  切换tab-推荐，记录tab-最新位置，页面滚动tab-推荐位置
      (
        document.getElementsByClassName(
          'home-page-container-tab-tabpane'
        )[0] as HTMLDivElement
      ).style.height = 'auto';
      (
        document.getElementsByClassName(
          'home-page-container-tab-tabpane'
        )[1] as HTMLDivElement
      ).style.height = '1px';
      (
        document.getElementsByClassName(
          'home-page-container-tab-tabpane'
        )[1] as HTMLDivElement
      ).style.overflow = 'hidden';
      if (currentScroll >= 132) {
        // 小于120 切换过去也漏出顶部card
        setLastPosition(currentScroll);
        RefHomePage.current.scrollTo({
          top: recommendPosition > 132 ? recommendPosition : 132,
        });
      } else {
        setLastPosition(currentScroll);
        RefHomePage.current.scrollTo({
          top: currentScroll,
        });
      }
    }
  };

  // const getMoreData = () => {
  //   /**
  //    * @description: 判断帖子是否达到最大数
  //    * @param {*}
  //    * @return {*}
  //    */
  //   if (orderType === 1 && recommendList && !isMaxList(recommendPageMax, recommendList.length)) return true;
  //   if (orderType === 2 && lastList && !isMaxList(lastPageMax, lastList.length)) return true;
  //   return false;
  // };

  useDidMount(() => {
    /**
     * @description: 埋点 - 统计从推送卡片进入的数量
     * @param {*} param1
     * @return {*}
     */
    try {
      const _sendTrackh = routeParams.get('nb');
      const pushTime = routeParams.get('t');
      const pushType = routeParams.get('pt');

      if (_sendTrackh) {
        (window as any)?._sendTrack?.(
          { nb: parseInt(_sendTrackh ? _sendTrackh : 0) },
          true
        );
      }
      if (pushTime && pushType) {
        if (routeParams.get('nb') == 1) {
          //表示从推送进入首页
          (window as any)?._sendTrack?.(
            {
              nj: 1,
              sh: pushTime,
              ni: parseInt(pushType)
            },
            true
          );
        }
      }
    } catch (error) {
      console.info(error);
    }
    sessionStorage.setItem('bf', '2');
    dropByCacheKey('/publish');
    wxShare();
  });

  useDidRecover(() => {
    wxShare();
  });

  const listenHomeScroll = (e: any) => {
    /**
     * @description: 监听page滚动，在滚动时禁止用户点击【首页】tab
     * @param {*}
     * @return {*}
     */
    if (isStop) {
      setIsStop(false);
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      afterScrollState = RefHomePage.current.scrollTop;
      if (afterScrollState == beforeScrollState) {
        setIsStop(true);
      }
    }, 500);
    beforeScrollState = RefHomePage.current.scrollTop;

    if (parseInt(currentVersion) == 2) {
      checkScrollOrientation(e);
    }

  };

  const handleMessage = () => {
    const { userInfo } = state;
    userInfo.msgNum = 0;
    dispatch({
      value: {
        ...state,
        userInfo,
      },
    });
    History.push('/message');
  };

  const checkScrollOrientation = (e: any) => {
    /**
     * @description: 判断滚动方向
     * @param {*}
     * @return {*}
     */
    if (e.target.className != 'c-publishpost-content') {
      const curScrollTop = e.target.scrollTop;
      if (curScrollTop <= 0) {
        setisScrollingUp(false);
        return;
      }
      if (curScrollTop - initScroll > 0) {
        // console.log('向下滚动');
        if (isScrollingUp) {
          setisScrollingUp(false);
        }
      } else {
        // console.log('向上滚动');
        if (!isScrollingUp) {
          setisScrollingUp(true);
        }
      }
      initScroll = curScrollTop;
    }
  };

  const renderHeaderDOM = (headerClassName:any) => {
    return (
      <div className={headerClassName}>
        <div>
          <span style={{ fontWeight: 600 }}>正在讨论</span>
          <span>
            <ComponentSvgIcon
              type={'icon-list_search'}
              onClick={() => {
                History.push('/globalSearch');
              }}
            />
            <ComponentSvgIcon
              type={'icon-envelope_message_line'}
              onClick={() => {
                handleMessage();
              }}
            />
            {state.userInfo?.msgNum > 0 ? (
              <span className="home-page-v2-header-message-toast"></span>
            ) : null}
          </span>
        </div>
        {/* {swipperList && swipperList.length > 0 ? (
                            <ComponentSwipper dataArr={swipperList} />
                        ) : null} */}
      </div>
    );
  };
  const renderHomePageDOM = () => {
    return (
      <>
        {parseInt(currentVersion) === 2 ? (
          renderHeaderDOM('home-page-v2-header')
        ) : (
          <ComponentAdvertise />
        )}
        {parseInt(currentVersion) === 2 && isScrollingUp?renderHeaderDOM('home-page-v2-header-show'):null}
        <Components.Container
          recommendDataSource={recommendList}
          lastDataSource={lastList}
          tabActive={orderType}
          changeTab={(order: number) => {
            setOrderType(order);
          }}
          topDivState={topDivState}
        />

        <InfiniteScroll
          loadMore={() => getArticleList(true)}
          hasMore={!isRecommendPageMax}
        >
          <InfiniteScrollContent hasMore={!isRecommendPageMax} />
        </InfiniteScroll>
      </>
    );
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
          userInfo: res,
        },
      });
    } catch (e) {
      console.info(e);
    }
  };
  return (
    <div
      className="home-page"
      data-home-page-scroll
      ref={RefHomePage}
      onScroll={(e: any) => {
        listenHomeScroll(e);
      }}
    >
      {!IsPc() ? (
        <PullToRefresh
          onRefresh={async () => {
            dispatch({
              value: {
                alreadyReadList: [],
              },
            });
            getArticleList();
            if (parseInt(currentVersion) === 2) getBasicData();
          }}
          renderText={(status) => {
            return (
              <img
                style={{ width: '123px', height: '107px' }}
                src={LOADINGPIC}
              />
            );
          }}
        >
          {renderHomePageDOM()}
        </PullToRefresh>
      ) : (
        renderHomePageDOM()
      )}
    </div>
  );
};

export { Home };
export default Home;
