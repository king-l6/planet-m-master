import React, { useEffect, useState } from 'react';
import { MESSAGECOUNTAPI } from '@/api';
import { InfiniteScroll, PullToRefresh } from 'antd-mobile';
import { Message } from './components';
import { LOADINGPIC, PIC_EMPTY } from '@/assets/image.ts';

import './index.less';

const pageSize = 10;

const Aitem = () => {

  const [commentList, setCommentList] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [isMaxList, setIsMaxList] = useState(true);

  useEffect(() => {
    getComment();
  }, []);

  const getComment = async (isGetNew?: boolean) => {
    /**
     * @description: 获取消息 - "@我的"
     * @param {*} 
     * @return {*}
     */
    try {
      const res: any = await MESSAGECOUNTAPI._getComment({ pageNum: isGetNew ? 1 : pageNum, pageSize });
      if (res) {
        const newArr = isGetNew ? res.list : commentList ? [...commentList, ...res.list] : res.list;
        setCommentList(JSON.parse(JSON.stringify(newArr)));
        setIsMaxList(res && res.list && res.list.length === pageSize ? false : true);
        setPageNum(isGetNew ? 2 : pageNum + 1);
        setTotal(res.total);
      }
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <div className="aite-page">
      <PullToRefresh
        onRefresh={async () => {
          getComment(true);
        }}
        renderText={status => {
          return <img style={{ width: '123px', height: '107px' }} src={LOADINGPIC} />;
        }}
      >
        <div className="aite-page-container">
          {
            commentList == null ? null : commentList && commentList.length > 0 ? commentList.map((commen: any, idx: number) => {
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
          commentList && commentList.length >= 10 ? <InfiniteScroll
            loadMore={() => getComment()}
            hasMore={!isMaxList}
          /> : null
        }
      </PullToRefresh>

    </div>
  );
};
export { Aitem };
export default Aitem;