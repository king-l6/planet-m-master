import React, { useEffect, useState } from 'react';
import { MESSAGECOUNTAPI } from '@/api';
import { InfiniteScroll, PullToRefresh } from 'antd-mobile';
import { Message } from './components';
import { LOADINGPIC, PIC_EMPTY } from '@/assets/image.ts';
import './index.less';

const pageSize = 10;
const Favor = () => {

  const [favorList, setFavorList] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [isMaxList, setIsMaxList] = useState(true);

  useEffect(() => {
    getFavor();
  }, []);

  const getFavor = async (isGetNew?: boolean) => {
    /**
     * @description: 接口 - 获取@我的消息。
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await MESSAGECOUNTAPI._getFavor({ pageNum: isGetNew ? 1 : pageNum, pageSize });
      if (res) {
        const newArr = isGetNew ? res.list : favorList ? [...favorList, ...res.list] : res.list;
        setFavorList(JSON.parse(JSON.stringify(newArr)));
        setIsMaxList(res && res.list && res.list.length === pageSize ? false : true);
        setPageNum(isGetNew ? 2 : pageNum + 1);
        setTotal(res.total);
      }
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <div className="favor-page">
      <PullToRefresh
        onRefresh={async () => {
          getFavor(true);
        }}
        renderText={status => {
          return <img style={{ width: '123px', height: '107px' }} src={LOADINGPIC} />;
        }}
      >
        <div className="favor-page-container">
          {
            favorList == null ? null : favorList && favorList.length > 0 ? favorList.map((favor: any, idx: number) => {
              return (
                <Message
                  key={idx}
                  photo={favor.avatarUrl}
                  name={favor.nickname}
                  relationBusinessType={favor.relationBusinessType}
                  time={favor.publishTime}
                  targetContent={favor.targetContent}
                  businessId={favor.articleBusinessId}
                  isRead={favor.isRead}
                  parentCommentCount={favor.parentCommentCount}
                  workCode={favor.workCode}
                />);
            }) : <div className="no-result">
              <img src={PIC_EMPTY} alt="" />
              <span>这里什么都没有叻～</span>
            </div>
          }
        </div>

        {
          favorList && favorList.length >= 10 ? <InfiniteScroll
            loadMore={() => getFavor()}
            hasMore={!isMaxList}
          /> : null
        }
      </PullToRefresh>

    </div>
  );
};
export { Favor };
export default Favor;