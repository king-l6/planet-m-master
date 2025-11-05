/*
 * @Author: Yixeu
 * @Date: 2021-11-01 14:44:27
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-01-24 17:42:35
 * @Description: 组件-评论的回复
 */
import React, { FC, useContext } from 'react';
import { DetailPageStore } from '@/page/detail/Detail';
import { decryption } from '@/mixin';
import './index.less';


interface IProps {
  data: any;
  count: number
}
const Reply: FC<IProps> = ({ data, count }) => {

  const { dispatchStoreDetailPage } = useContext(DetailPageStore);

  const openPopUp = () => {
    dispatchStoreDetailPage({
      type: 'openPopUp',
      value: {
        basicComment: data,
        id: data.businessId
      }
    });
  };

  return <div className="c-reply" onClick={openPopUp}>
    {
      data.replyList.map((item: any, index: number) => {
        if (item.targetNickname) {
          return <div className="c-reply-item" key={item.businessId}>
            <span className="c-reply-item-name">{item.sourceNickname}</span>
            <span className="c-reply-item-text">回复</span>
            <span className="c-reply-item-name">{item.targetNickname}</span>：
            <span dangerouslySetInnerHTML={{ __html: decryption(item.content) }} />
          </div>;
        } else {
          return <div className="c-reply-item" key={item.businessId}>
            <span className="c-reply-item-name">{item.sourceNickname}</span>：
            <span dangerouslySetInnerHTML={{ __html: decryption(item.content) }} />
          </div>;
        }
      })
    }
    {
      count > 2 ? <span>查看全部{count}条回复 &gt;</span> : count === -1 ? <span>查看全部回复 &gt;</span> : null
    }
  </div>;
};

export { Reply };
export default Reply;
