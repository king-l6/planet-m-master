import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { MESSAGECOUNTAPI } from '@/api';
import { Type } from './components';
import { MESSAGEAITEPIC, MESSAGECOMMENTPIC, MESSAGEFAVORPIC ,MESSAGECONFIGPIC, MESSAGEBKGPIC, MESSAGECOLLECTIONPIC } from '@/assets/image.ts';

import './index.less';

const Message = () => {
  const History = useHistory();

  const [aiteCount, setAiteCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [favorCount, setFavorCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);

  const messageCard = [
    { text: '@我的', count: aiteCount, route:'/aiteMe', picUrl: MESSAGEAITEPIC},
    { text: '评论与回复', count: replyCount, route:'/replyMe', picUrl: MESSAGECOMMENTPIC},
    { text: '为我点赞', count: favorCount, route:'/favorMe', picUrl: MESSAGEFAVORPIC },
    { text: '收藏我的', count: collectionCount, route:'/collectionMine', picUrl: MESSAGECOLLECTIONPIC}
  ];
  
  useEffect(() => {
    getMessageCount();
  }, []);

  const getMessageCount = async() => {
    /**
     * @description: 接口 - 获取消息数量
     * @param {*}
     * @return {*}
     */
    try {
      const res:any = await MESSAGECOUNTAPI._getMessageCount();
      if(res){
        res.atMyselfNum?setAiteCount(res.atMyselfNum):setAiteCount(0);
        res.commentReplyNum?setReplyCount(res.commentReplyNum):setReplyCount(0);
        res.likeNum?setFavorCount(res.likeNum):setFavorCount(0);
        res.collectionNum?setCollectionCount(res.collectionNum):setCollectionCount(0);
      }
    } catch (error) {
      console.info(error);
    }
  };
  return (
    <div className='message-page'>
      <div className="message-page-me">
        {
          messageCard.map((card, index) => {
            return (
              < Type 
                key={index} 
                text={card.text} 
                count={card.count}
                picUrl={card.picUrl}
                onClick={()=>{History.push(`${card.route}`);}}
              />
            );
          })
        }
      </div>
      <div className='message-page-config'>
        < Type 
          text={'消息通知设置'} 
          picUrl={MESSAGECONFIGPIC}
          onClick={()=>{History.push('/messageConfig?nc=2');}}
        />
      </div>
      <div className="message-page-bg">
        <img src={MESSAGEBKGPIC} alt="" />
      </div>
    </div>
  );
};
export {Message};
export default Message;