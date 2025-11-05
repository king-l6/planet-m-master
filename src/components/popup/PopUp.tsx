/*
 * @Author: Yixeu
 * @Date: 2021-11-01 14:44:27
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-01-24 18:12:43
 * @Description: 组件-弹起
 */
import React, { Context, FC, useContext, useEffect, useRef, useState } from 'react';
import { Popup, InfiniteScroll, Loading } from 'antd-mobile';
import './index.less';
import { useDidUpdate } from 'hooooks';
import { DETAILAPI } from '@/api';
import { ComponentComment, ComponentInput } from '@/components';
import { isMaxList } from '@/mixin';
import { Store } from '@/store';
import classnames from 'classnames';
import { DetailPageStore } from '@/page/detail/Detail';
import { useImmer } from 'use-immer';

interface IProps {
  articleStatus: number
  style?: any
}

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

const PopUp: FC<IProps> = ({ articleStatus, style }) => {

  const { StoreDetailPage, dispatchStoreDetailPage } = useContext(DetailPageStore);

  const overallState = useContext(Store).state;

  const [pageNum, setPageNum] = useImmer(1);
  const [scrollId, setScrollId] = useState('');
  const [dataList, setDataList] = useImmer(null);

  const [total, setTotal] = useState(0);
  const DOMRefComponentInput = useRef() as any;

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchMoveX, setTouchMoveX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchMoveY, setTouchMoveY] = useState(null);

  const [isPageMax, setIsPageMax] = useState(true);  //  判断当前页是不是到底

  const handleTouchStart = (e: any) => {
    e.preventDefault();
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: any) => {
    e.preventDefault();
    setTouchMoveX(e.touches[0].clientX);
    setTouchMoveY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: any) => {
    /**
     * @description:
     *  1.手势下滑距离超过某个值
     *  2.当滚动条处于顶部
     *  3.横向滑动距离不超过某个值
     * @param {*}
     * @return {*}
     */
    const contentScroll = document.getElementsByClassName('c-popup-content')[0].scrollTop;
    if (touchMoveY - touchStartY > 0 && contentScroll == 0 && Math.abs(touchMoveX - touchStartX) < 40) {
      closePopUp();
    }
  };

  useDidUpdate(() => {
    if (StoreDetailPage.storePopUpId && StoreDetailPage.storeIsShowPopUp) {
      /**
       * @description: 打开页面刷新数据
       * @param {*}
       * @return {*}
       */
      getPopUpData();
    }
  }, [StoreDetailPage.storeIsShowPopUp]);

  const getPopUpData = async (isGetMore?: Boolean) => {
    /**
     * @description: 接口 - 楼中楼回复页面
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await DETAILAPI._getCommentReply({
        parentBusinessId: StoreDetailPage.storePopUpId,
        pageNum: pageNum,
        pageSize,
        order: 1,
        scrollId
      });
      setIsPageMax(res && res.commentReplyList && res.commentReplyList.length === pageSize ? false : true);
      setDataList((draft: any) => {
        draft = draft ? [...draft, ...res.commentReplyList] : [...res.commentReplyList];
        return draft;
      });
      setTotal(res.total);
      setScrollId(res.scrollId);
      setPageNum((draft: any) => {
        const newDraft = draft + 1;
        return newDraft;
      });
    } catch (e) {
      console.info(e);
    }
  };

  const renderHead = () => {
    return <div className="c-popup-head">
      评论回复
    </div>;
  };

  const getMoreData = () => {
    /**
     * @description: 是否有更多评论
     * @param {*}
     * @return {*}
     */
    if (dataList && !isMaxList(total, dataList.length)) return true;
    return false;
  };

  const addReply = (item: any) => {
    if (!getMoreData()) {
      setDataList((draft: any) => {
        draft.push(item);
        return draft;
      });
    }
  };

  const deleteData = (businessId: string) => {
    /**
     * @description: 删除回复
     * @param {*} dataList
     * @return {*}
     */
    setDataList((draft: any) => {
      const commentIndex = draft.findIndex((item: any) => item.businessId === businessId);
      draft.splice(commentIndex, 1);
      return draft;
    });
  };

  const deleteTitle = () => {
    closePopUp(true);
  };

  const closePopUp = (isDelTitle?: boolean) => {
    /**
     * @description: 关闭清数据
     * @param {*}
     * @return {*}
     */
    dispatchStoreDetailPage({
      type: 'closePopUpAndUpdateState',
      value: isDelTitle ? undefined : false
    });
    setPageNum(1);
    setDataList(null);
    setTotal(0);
    setScrollId('');
  };

  const likeTitle = (value: number) => {
    /**
     * @description: 点赞刷新背景
     * @param {*} state
     * @return {*}
     */
    dispatchStoreDetailPage({
      type: 'clickLikeInPopUp',
      value
    });
  };

  return <Popup
    visible={StoreDetailPage.storeIsShowPopUp}
    destroyOnClose={true}
    onMaskClick={() => {
      closePopUp();
    }}
    bodyClassName={classnames('c-popup', overallState && 'c-popup-hidden', style && style)}

  >
    {renderHead()}
    <div className="c-popup-content"
      onTouchMove={(e) => { handleTouchMove(e); }}
      onTouchStart={(e) => { handleTouchStart(e); }}
      onTouchEnd={(e) => { handleTouchEnd(e); }}>
      <ComponentComment
        itemData={StoreDetailPage.storePopUpBasicComment}
        inPopUp={true}
        isPopUpTitle={true}
        beginToInput={(name: string) => {
          DOMRefComponentInput.current.focus(name, StoreDetailPage.storePopUpBasicComment);
        }}
        deletePopUpTitle={() => {
          deleteTitle();
        }}
        likePopUpTitle={(type: number) => {
          likeTitle(type);
        }}
      />
      {
        total === -1 ? <div className="c-popup-count">相关回复</div> : <div className="c-popup-count">{total}条相关回复</div>
      }
      <div className="c-popup-list">
        {
          dataList && dataList.map((s: any, index: number) => {
            return <ComponentComment
              itemData={s}
              key={s.businessId}
              inPopUp={true}
              deletePopUpItem={(businessId: string) => {
                deleteData(businessId);
              }}
              beginToInput={(name: string) => {
                DOMRefComponentInput.current.focus(name, s, index);
              }}
            />;
          })
        }
      </div>
      {
        dataList && dataList.length >= 10 ? <InfiniteScroll loadMore={() => getPopUpData(true)}
          hasMore={
            !isPageMax
          }
        >
          <InfiniteScrollContent hasMore={!isPageMax} />
        </InfiniteScroll> : null
      }
    </div>
    {articleStatus !== 3 ?
      <ComponentInput addReply={(item: any) => {
        addReply(item);
      }}
      popComment={StoreDetailPage.storePopUpBasicComment}
      placeholderPop={`回复 ${StoreDetailPage.storePopUpBasicComment?.sourceNickname}`}
      ref={DOMRefComponentInput} inPop /> : null
    }
  </Popup>;
};

export { PopUp };
export default PopUp;
