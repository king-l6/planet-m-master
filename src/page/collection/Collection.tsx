import React, { useEffect, useState } from 'react';
import { MESSAGECOUNTAPI } from '@/api';
import { InfiniteScroll, PullToRefresh } from 'antd-mobile';
import { Message } from './components';
import { LOADINGPIC, PIC_EMPTY } from '@/assets/image.ts';

import './index.less';

const pageSize = 10;

const Collection = () => {

  const [collectionList, setCollectionList] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [isMaxList, setIsMaxList] = useState(true);

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async (isGetNew?: boolean) => {
    /**
     * @description: 获取消息 - "收藏我的"
     * @param {*} 
     * @return {*}
     */
    try {
      const res: any = await MESSAGECOUNTAPI._getCollection({ pageNum: isGetNew ? 1 : pageNum, pageSize });
      if (res) {
        const newArr = isGetNew ? res.list : collectionList ? [...collectionList, ...res.list] : res.list;
        setCollectionList(JSON.parse(JSON.stringify(newArr)));
        setIsMaxList(res && res.list && res.list.length === pageSize ? false : true);
        setPageNum(isGetNew ? 2 : pageNum + 1);
        setTotal(res.total);
      }
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <div className="collection-page">
      <PullToRefresh
        onRefresh={async () => {
          getCollection(true);
        }}
        renderText={status => {
          return <img style={{ width: '123px', height: '107px' }} src={LOADINGPIC} />;
        }}
      >
        <div className="collection-page-container">
          {
            collectionList == null ? null : collectionList && collectionList.length > 0 ? collectionList.map((commen: any, idx: number) => {
              return (
                <Message
                  key={idx}
                  photo={commen.avatarUrl}
                  name={commen.nickname}
                  relationBusinessType={commen.relationBusinessType}
                  time={commen.publishTime}
                  targetContent={commen.targetContent}
                  businessId={commen.articleBusinessId}
                  isRead={commen.isRead}
                  parentCommentCount={commen.parentCommentCount}
                  workCode={commen.workCode} 
                />);
            }) : <div className="no-result">
              <img src={PIC_EMPTY} alt="" />
              <span>这里什么都没有叻～</span>
            </div>
          }
        </div>
        {
          collectionList && collectionList.length >= 10 ? <InfiniteScroll
            loadMore={() => getCollection()}
            hasMore={!isMaxList}
          /> : null
        }
      </PullToRefresh>

    </div>
  );
};
export { Collection };
export default Collection;