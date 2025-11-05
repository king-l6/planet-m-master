import React, { FC, useEffect, useState } from 'react';
import { MESSAGECOUNTAPI } from '@/api';
import { InfiniteScroll, Loading, PullToRefresh } from 'antd-mobile';
import { Message } from './components';
import { LOADINGPIC, PIC_EMPTY } from '@/assets/image.ts';
import './index.less';

const pageSize = 10;
const Reply = () => {

  const [replyList, setReplyList] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [isMaxList, setIsMaxList] = useState(true);

  useEffect(() => {
    getReply();
  }, []);

  const getReply = async (isGetNew?: boolean) => {
    /**
     * @description: 获取回复我的消息
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await MESSAGECOUNTAPI._getReply({ pageNum: isGetNew ? 1 : pageNum, pageSize });
      if (res) {
        const newArr = isGetNew ? res.list : replyList ? [...replyList, ...res.list] : res.list;
        setReplyList(JSON.parse(JSON.stringify(newArr)));
        setIsMaxList(res && res.list && res.list.length === pageSize ? false : true);
        setPageNum(isGetNew ? 2 : pageNum + 1);
        setTotal(res.total);
      }
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <div className="reply-page">
      <PullToRefresh
        onRefresh={async () => {
          getReply(true);
        }}
        renderText={status => {
          return <img style={{ width: '123px', height: '107px' }} src={LOADINGPIC} />;
        }}
      >
        <div className="reply-page-container">
          {
            replyList == null ? null : replyList && replyList.length > 0 ? replyList.map((reply: any, idx: number) => {
              return (
                <Message
                  key={idx}
                  photo={reply.avatarUrl}
                  name={reply.nickname}
                  relationBusinessType={reply.relationBusinessType}
                  time={reply.publishTime}
                  targetContent={reply.targetContent}
                  articleBusinessId={reply.articleBusinessId}
                  isRead={reply.isRead}
                  source={reply.sourceContent}
                  isFavor={reply.isLike === 1 ? true : false}
                  businessId={reply.businessId}
                  parentCommentCount={reply.parentCommentCount}
                  workCode={reply.workCode}
                />);
            }) : <div className="no-result">
              <img src={PIC_EMPTY} alt="" />
              <span>这里什么都没有叻～</span>
            </div>
          }
        </div>
        {
          replyList && replyList.length >= 10 ? <InfiniteScroll
            loadMore={() => getReply()}
            hasMore={!isMaxList}
          /> : null
        }
      </PullToRefresh>

    </div>
  );
};
export { Reply };
export default Reply;