import React, {
  useEffect,
  useState,
  createContext,
  useReducer,
  useRef,
  useMemo,
  Fragment,
  useLayoutEffect,
  useContext,
} from 'react';
import {
  ComponentSvgIcon,
  ComponentArticle,
  ComponentComment,
  ComponentSkeleton,
  ComponentPopUp,
  ComponentInput,
  ComponentInputV2,
} from '@/components';
import { BROWSEAPI, DETAILAPI } from '@/api';
import { useHistory } from 'react-router';
import {
  Toast,
  Loading,
  InfiniteScroll,
  Popover,
  PullToRefresh,
} from 'antd-mobile';
import { useDidMount, useDidUpdate } from 'hooooks';
import { LOADINGPIC, EMPTYPIC } from '@/assets/image.ts';
import { backToTop, isiOS, IsPc, regxShare } from '@/mixin';
import { removeAt } from '@/page/publish/components/publishEdit/edit';
import DetailReducer from './DetailReducer.ts';
import { useImmerReducer, useImmer } from 'use-immer';
import { uniqBy } from 'lodash';
import StoreValueTypes from './index.d';
import './detail-pc.less';
import './index.less';
import { dropByCacheKey } from 'react-router-cache-route';
import { Store } from '@/store';
import SvgIcon from '@/components/svgicon';
const pageSize = 10;

const DetailPageStore = createContext({
  StoreDetailPage: null,
  dispatchStoreDetailPage: null,
});

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

const DetailInitialState: StoreValueTypes = {
  storePopUpId: null,
  storeCommentList: null,
  storeIsShowPopUp: false,
  storePopUpBasicComment: null,
};

const Detail = () => {
  const wx = (window as any).wx;
  const History = useHistory();
  const RefDetailPage = useRef(null);
  const RefComment = useRef<HTMLDivElement>(null);
  const RefTime = useRef(null);
  const currentVersion = sessionStorage.getItem('app_version');

  const routeParams = new URLSearchParams(decodeURIComponent(History.location.search)) as any;

  const skeleton =
    routeParams.get('skeleton') && routeParams.get('skeleton') > 10
      ? 10
      : routeParams.get('skeleton');
  const detailEnjoy = routeParams.get('isenjoy');
  const articleId = routeParams.get('tId');
  const isClickComment = routeParams.get('click');
  const h = routeParams.get('h');
  const pushTime = routeParams.get('t');
  const pushType = routeParams.get('pt');

  const [backTopState, setbackTopState] = useState(false);
  const [articleDetail, setArticleDetail] = useState(null);
  const [articleIndicator, setArticleIndicator] = useImmer(null);

  const [pageNum, setPageNum] = useState(1);
  const [orderType, setOrderType] = useState(1);
  const [scrollId, setScrollId] = useState('');

  const { state, dispatch } = useContext(Store);

  const [StoreDetailPage, dispatchStoreDetailPage] = useImmerReducer(
    DetailReducer,
    DetailInitialState
  );

  const DOMRefComponentInput = useRef() as any;

  const [isMaxList, setIsMaxList] = useState(true);

  const [isLoaded, setIsLoaded] = useState(false);

  const [pageScrollTop, setPageScrollTop] = useState(0);

  const [articleLoaded, setArticleLoaded] = useState(0);

  const [commentLoaded, setCommentLoaded] = useState(0);

  const [showCommentInput, setShowCommentInput] = useState(true);

  const [totalComment, setTotalComment] = useState(null);

  useLayoutEffect(() => {
    //从推送卡片进来时，侧滑返回到首页
    // 1: 搜索列表进入
    // 2: 转发进入
    // 4：主列表进入
    const detailHash = location.hash;
    if (h && h != 1 && h != 2 && h != 4) {
      history.replaceState({}, '', '#/');
      history.pushState({}, '', detailHash);
    }
    //从复制链接进来时 显示返回首页按钮
    if (!sessionStorage.getItem('copLink')) {
      sessionStorage.setItem('copLink', '2');
    }
    if (
      !/(iPhone|iPad|iPod|iOS|(Android))/i.test(
        window?.navigator.userAgent
      )
    ) {
      document.getElementById('root').style.background = '#e5e5e5';
    }
  }, []);


  useDidUpdate(() => {
    getArticle(true);
  }, [articleId]);

  useEffect(() => {
    /**
         * @description: 初始化
         * @param {*} articleId
         * @return {*}
         */
    if (articleId) {
      getArticle();
      try {
        const _sendTracktId = routeParams.get('tId') as number;
        const _sendTrackh = routeParams.get('h');
        if (_sendTrackh && _sendTracktId) {
          (window as any)?._sendTrack?.(
            {
              na: parseInt(_sendTrackh ? _sendTrackh : 0),
              sb: _sendTracktId,
            },
            true
          );
        }
        if (pushTime && pushType) {
          if (routeParams.get('h') == 5 || routeParams.get('h') == 10) {
            // console.log(new Date().getTime());
            //表示从推送进入详情
            (window as any)?._sendTrack?.(
              {
                nj: 2,
                sf: routeParams.get('tId'),
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

      //清除定时器
      return () => {
        clearTimeout(RefTime.current);
      };
    } else {
      Toast.show({
        icon: 'fail',
        content: '未存在帖子ID',
      });
    }
  }, []);

  useEffect(() => {
    if (commentLoaded == 1 && articleLoaded == 2 && isClickComment) {
      setTimeout(() => {
        RefComment.current?.scrollIntoView();
      }, 10);
    }
  }, [commentLoaded, articleLoaded]);

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

  const getArticle = async (newArticle?: boolean) => {
    /**
         * @description: 获取文章内容
         * @param {*}
         * @return {*}
         */
    try {
      const res = await DETAILAPI._getArticleDetail({
        businessId: articleId,
      });

      const { alreadyReadList } = state;
      const newArr = JSON.parse(JSON.stringify(alreadyReadList));
      newArr.push(articleId);
      dispatch({
        value: {
          ...state,
          alreadyReadList: newArr
        },
      });
      getArticleIndicator();
      setArticleDetail(res);
      // getArticleComment()
      if (newArticle) {
        getArticleComment(true);
      } else {
        getArticleComment();
      }
    } catch (e) {
      console.info(e);
      // 帖子不存在时，不显示底部评论框
      setShowCommentInput(false);
    }
  };

  const getArticleIndicator = async () => {
    /**
         * @description: 接口 - 获取文章评论数点赞数等等
         * @param {*}
         * @return {*}
         */
    try {
      const res = await DETAILAPI._getArticleIndicator({
        businessId: articleId,
      });
      setArticleIndicator(res);
    } catch (e) {
      console.info(e);
      // 帖子不存在时，不显示底部评论框
      setShowCommentInput(false);
    }
  };

  const getArticleComment = async (isNew?: boolean) => {
    /**
         * @description: 接口 - 获取文章回复列表
         * @param {*}
         * @return {*}
         */
    try {
      const res: any = await DETAILAPI._getArticleComment({
        articleBusinessId: articleId,
        pageNum: isNew ? 1 : pageNum,
        pageSize,
        order: orderType,
        scrollId: isNew ? '' : scrollId,
      });
      const newCommentList = isNew
        ? res.commentReplyList
        : StoreDetailPage.storeCommentList
          ? [...StoreDetailPage.storeCommentList, ...res.commentReplyList]
          : res.commentReplyList;
      dispatchStoreDetailPage({
        type: 'updateCommentList',
        value: uniqBy(newCommentList, 'businessId'),
      });
      setIsMaxList(
        res &&
          res.commentReplyList &&
          res.commentReplyList.length === pageSize
          ? false
          : true
      );
      setPageNum(isNew ? 2 : pageNum + 1);
      setScrollId(res.scrollId);
      setIsLoaded(true);
      setCommentLoaded(1);
      setTotalComment(res.total);
    } catch (e) {
      console.info(e);
    }
  };

  const addComment = (item: any) => {
    /**
         * @description: 增加一条评论
         * @param {*}
         * @return {*}
         */
    dispatchStoreDetailPage({
      type: 'addComment',
      value: item,
    });
    setArticleIndicator((draft: any) => {
      draft.commentCount++;
    });
  };

  const addReply = (comment: any, i: number) => {
    /**
         * @description: 增加一条回复
         * @param {*}
         * @return {*}
         */
    dispatchStoreDetailPage({
      type: 'addReply',
      value: {
        i,
        v: comment,
      },
    });
    setArticleIndicator((draft: any) => {
      draft.commentCount++;
    });
  };

  const listenScroll = (e: any) => {
    e.target.scrollTop > 0 ? setbackTopState(true) : setbackTopState(false);
    if (isiOS) {
      setPageScrollTop(e.target.scrollTop);
    }
  };

  const changeDataType = (text: string | number) => {
    /**
         * @description: 切换排序方式
         * @param {*}
         * @return {*}
         */
    switch (text) {
      case '最新排序':
        setOrderType(1);
        break;
      case '楼层排序':
        setOrderType(2);
        break;
      case '热度排序':
        setOrderType(3);
        break;
      case 1:
        return '最新排序';
        break;
      case 2:
        return '楼层排序';
        break;
      case 3:
        return '热度排序';
        break;
    }
  };

  const backToHome = () => {
    if (h != 1 && h != 2 && h != 4) {
      History.goBack();
    } else {
      History.replace('/');
      dropByCacheKey('/detail');
    }
  };

  useDidUpdate(() => {
    getArticleComment(true);
  }, [orderType]);

  useEffect(() => {
    wxShare(articleDetail);
  }, [articleDetail]);

  useDidUpdate(() => {
    if (!StoreDetailPage.storeIsShowPopUp) {
      //  关闭了楼中楼(popup)
      if (StoreDetailPage.storeIsShowPopUp === undefined) {
        // 在楼中楼删除了主评论
        afterPopUpDelete();
        return;
      }
      if (StoreDetailPage.storePopUpId) {
        // 没有在楼中楼删除主评论
        getPopUpData();
        return;
      }
    }
  }, [StoreDetailPage.storeIsShowPopUp]);

  useDidMount(() => {
    // browseNumber({businessIdList:[articleId]})
    RefTime.current = setTimeout(() => {
      // ('浏览了10s');
      if (!localStorage.getItem('planet_et')) {
        localStorage.setItem('planet_et', '1');
      } else {
        const et = parseInt(localStorage.getItem('planet_et')) + 1;
        et === 5 && openAFU();
        localStorage.setItem('planet_et', `${et}`);
      }
    }, 10000);
    
  });
  const getPopUpData = async () => {
    /**
         * @description: 接口 - 获取楼中楼的数据
         * @param {*}
         * @return {*}
         */
    try {
      const newId = JSON.parse(
        JSON.stringify(StoreDetailPage.storePopUpId)
      );
      dispatchStoreDetailPage({
        type: 'clearPopUpId',
      });
      const res: any = await DETAILAPI._getCommentReply({
        parentBusinessId: newId,
        pageNum: 1,
        pageSize,
        order: 2,
        scrollId: '',
      });
      if (res) {
        afterPopUpUpdate(newId, res);
      }
    } catch (e) {
      console.info(e);
    }
  };

  const afterPopUpUpdate = (id: string, res: any) => {
    /**
         * @description: 修改popup数据后做更新
         * @param {*} state
         * @return {*}
         */
    dispatchStoreDetailPage({
      type: 'updateCommentAfterPopUpClosed',
      value: { id, res },
    });
  };

  const afterPopUpDelete = () => {
    /**
         * @description: popUp 删除主评论后刷新列表
         * @param {*}
         * @return {*}
         */
    dispatchStoreDetailPage({
      type: 'deleteCommentInPopUp',
    });
  };

  const wxShare = (data: any) => {
    /**
         * @description: 企微转发
         * @param {*}
         * @return {*}
         */
    if (wx.onMenuShareAppMessage && data) {
      const title = regxShare(data.title);
      const desc = regxShare(data.fullContent) || '点击查看';
      const imgUrl = data.picList?.length > 0 ? data.picList[0] : 'https://i0.hdslb.com/bfs/planet/1640756088334-1640756088.jpg';
      wx.onMenuShareAppMessage({
        title: title || '同事吧', // 分享标题
        desc, // 分享描述
        imgUrl,
        link: `https://dashboard-mng.biliapi.net/api/v4/user/dashboard_login?caller=bbplanet&path=%2F%23%2Fdetail%3FtId%3D${data.businessId}%26h%3D2%26isenjoy%3D1%26skeleton%3D${skeleton}`,
        success: function () {
          // 用户确认分享后执行的回调函数
          console.info('帖子分享成功', window.location.href);
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          console.info('帖子取消了分享', window.location.href);
        },
      });
    }
  };

  const renderSkeleton = () => {
    /**
         * @description: DOM - 骨架
         * @param {*}
         * @return {*}
         */
    const items = [];
    if (skeleton) {
      for (let i = 0; i < (skeleton as number); i++) {
        items.push(<ComponentSkeleton.Comment key={i} />);
      }
    }
    return items;
  };

  const changeScrollIntoView = (num: number) => {
    setArticleLoaded(num);
  };

  const openAFU = () => {
    /**
         * @description: 满意度插件接入
         * @param {*}
         * @return {*}
         */
    const afu = new (window as any).AFU({
      title: '同事吧的使用体验如何？',   //用户看到的表单标题
      hightReview: ['操作简单好用', '信息结构清晰', '使用流畅', '界面美观'],   //正面反馈
      lowReview: ['操作复杂难用', '信息结构不清晰', '使用不流畅', '界面不美观'],  //负面反馈
      subject: '同事吧使用体验',  //用户无感知，即数据收集平台能查询到的项目名称，需要和产品敲定申请
      triggeredLimit: 1,  //最多弹出次数
      timeGap: 1,  //弹出天数间隔
      deviceType: 'm',
      isShowMask:false,
      appId:'dc3398ad4a1aea8aaea1e74081d6c875'
    });
    afu.open();
  };

  return (
    <DetailPageStore.Provider
      value={{
        StoreDetailPage,
        dispatchStoreDetailPage,
      }}
    >
      <div
        className={parseInt(currentVersion) === 2 ? 'detail-page detail-page-v2' : 'detail-page'}
        ref={RefDetailPage}
        onScroll={(e) => {
          listenScroll(e);
        }}
      >
        <PullToRefresh
          onRefresh={async () => {
            getArticleComment(true);
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
          {useMemo(() => {
            if (articleDetail && articleIndicator) {
              return (
                <ComponentArticle
                  data={articleDetail}
                  indicator={articleIndicator}
                  changeScrollIntoView={(num: number) => {
                    changeScrollIntoView(num);
                  }}
                />
                // <ComponentSkeleton.Article />
              );
            } else {
              return <ComponentSkeleton.Article className='detail-page-c-skeletonArt' />;
            }
          }, [articleDetail, articleIndicator])}
          {StoreDetailPage.storeCommentList &&
            StoreDetailPage.storeCommentList.length != 0 ? (
              <>
                <div
                  className="detail-page-comment"
                  ref={RefComment}
                >
                  <div className="detail-page-comment-title">
                    {/* 全部评论 */}
                    {`全部评论 ${parseInt(currentVersion) === 2 && articleIndicator ? articleIndicator.commentCount : ''}`}

                    <Popover.Menu
                      actions={[
                        { text: '最新排序' },
                        { text: '楼层排序' },
                      ]}
                      placement="bottom"
                      onAction={(node) =>
                        changeDataType(node.text)
                      }
                      trigger="click"
                    >
                      <div>
                        {parseInt(currentVersion) === 2 ? <SvgIcon type='icon-menu_line' className='menue-icon-v2' /> : null}

                        {changeDataType(orderType)}
                      </div>
                    </Popover.Menu>
                  </div>

                  {StoreDetailPage.storeCommentList.map(
                    (s: any, index: number) => {
                      return (
                        <ComponentComment
                          key={s.floorNum}
                          itemData={s}
                          articleStatus={
                            articleDetail?.articleStatus
                          }
                          beginToInput={(
                            name: string
                          ) => {
                            DOMRefComponentInput.current.focus(
                              name,
                              s,
                              index
                            );
                          }}
                        />
                      );
                    }
                  )}
                </div>
                {StoreDetailPage.storeCommentList.length >= 10 ? (
                  <InfiniteScroll
                    loadMore={() => getArticleComment()}
                    hasMore={!isMaxList}
                  >
                    <InfiniteScrollContent
                      hasMore={!isMaxList}
                    />
                  </InfiniteScroll>
                ) : null}
              </>
            ) : !StoreDetailPage.storeCommentList && skeleton != 0 ? (
              <>
                <div
                  className="detail-page-comment detail-page-comment-skeleton"
                  ref={RefComment}
                >
                  <div className="detail-page-comment-title">
                  全部评论
                    <div>最新排序</div>
                  </div>
                  {renderSkeleton()}
                </div>
              </>
            ) : isLoaded ? (
              <div className="detail-page-no-comment">
                <img src={EMPTYPIC} alt="" />
              还没有人评论，快来抢沙发～
              </div>
            ) : null}
          {articleDetail?.articleStatus !== 3 && showCommentInput ? parseInt(currentVersion) !== 2 ? (
            <ComponentInput
              countData={articleIndicator}
              changeCountData={(data: any) => {
                setArticleIndicator(data);
              }}
              addItem={(item: any) => {
                addComment(item);
              }}
              addReply={(item: any, index: number) => {
                addReply(item, index);
              }}
              ref={DOMRefComponentInput}
              pageScrollTop={pageScrollTop}
              inArticle={true}
            />
          ) :
            <ComponentInputV2
              countData={articleIndicator}
              changeCountData={(data: any) => {
                setArticleIndicator(data);
              }}
              addItem={(item: any) => {
                addComment(item);
              }}
              addReply={(item: any, index: number) => {
                addReply(item, index);
              }}
              ref={DOMRefComponentInput}
              pageScrollTop={pageScrollTop}
              inArticle={true}
            />
            : null}
          {(detailEnjoy && detailEnjoy == 1) ||
            sessionStorage.getItem('copLink') == '2' ? (
              <div
                className="detail-page-backhome"
                onClick={() => {
                  backToHome();
                }}
              >
                <ComponentSvgIcon type="icon-ic_home" />
              </div>
            ) : null}
          {backTopState && showCommentInput ? (
            <div
              className="detail-page-uptotop"
              onClick={(e) => {
                backToTop(RefDetailPage.current, false);
              }}
            >
              <ComponentSvgIcon type="icon-arrow_unfold_up_off_line" />
            </div>
          ) : null}
        </PullToRefresh>
      </div>
      <ComponentPopUp.PopUp
        articleStatus={articleDetail?.articleStatus}
        style={IsPc() && 'pc-pop'}
      />
    </DetailPageStore.Provider>
  );
};

export { Detail, DetailPageStore };
export default Detail;
