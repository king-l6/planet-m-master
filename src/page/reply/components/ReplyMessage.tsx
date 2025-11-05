import React, { FC, useState } from 'react';
import { timestampFormat, decryption, openMessage } from '@/mixin';
import { useHistory } from 'react-router';
import { MESSAGECOUNTAPI } from '@/api';
import SvgIcon from '@/components/svgicon';

interface IProps {
  photo: string
  name: string
  relationBusinessType: number
  time: string
  targetContent: string
  businessId: string
  isRead: number
  source: string
  isFavor: boolean
  articleBusinessId: string
  parentCommentCount:any
  workCode:any
}

const ComponentMessage: FC<IProps> = ({ photo, name, relationBusinessType, time, targetContent, articleBusinessId, isRead, isFavor, source, businessId,parentCommentCount,workCode }) => {
  const History = useHistory();
  const [likeState, setLikestate] = useState(isFavor);
  const [readState, setReadState] = useState(isRead);

  const jumpToDetail = () => {
    /**
     * @description: 消息中心 - 点击回复跳转到详情
     * @param {*}
     * @return {*}
     */
    setReadState(1);
    History.push(`/detail?tId=${articleBusinessId}&skeleton=${parentCommentCount}`);
  };

  const favor = async () => {
    /**
     * @description: 点赞
     * @param {*}
     * @return {*}
     */
    try {
      const data = {
        businessId,
        businessType: 2,
        like: !likeState
      };
      const res = await MESSAGECOUNTAPI._favor(data);
      if (res) {
        setLikestate(!likeState);
      }
    } catch (error) {
      console.info(error);
    }
  };
  return (
    <div className="reply-card"  onCopy={(e)=>{e.preventDefault();}} onContextMenu={(e)=>{e.preventDefault();}}>
      <div className="reply-card-info">
        <div className="reply-card-info-pic" onClick={()=>{openMessage(workCode);}}>
          {readState === 0 ? <div className="read"></div> : null}
          {
            photo? <img src={photo} alt="" /> : <SvgIcon type="icon-default_tx" className="avar"/>
          }
        </div>
        <div className="reply-card-info-name">
          <div><span onClick={()=>{openMessage(workCode);}}>{name}</span>{relationBusinessType === 2 ? '回复了你的评论' : '评论了你的帖子'}</div>
          <div>{timestampFormat(time)}</div>
        </div >
        <div className="reply-card-info-operate">
          <div onClick={jumpToDetail}>
            <SvgIcon type="icon-list_comment_line" />
            回复
          </div>
          <div onClick={favor} >
            {!likeState ? (<>
              <SvgIcon type="icon-list_recommend_line" />
              <>点赞</>
            </>) : (
              <>
                <SvgIcon type="icon-list_recommend_fill" className="icon-favor" />
              </>
            )
            }
          </div>
        </div>
      </div>
      <div className="reply-card-source" dangerouslySetInnerHTML={{__html:decryption(source)}}></div>

      
      <div className="reply-card-content">
        {
          relationBusinessType === 2 ? (
            <>
              <div className="fake-div"></div>
              <div className="comment" onClick={jumpToDetail} dangerouslySetInnerHTML={{__html:decryption(targetContent)}}></div>

            </>
          ) : (
            <>
              <div className='dynamic' onClick={jumpToDetail}>
                <span dangerouslySetInnerHTML={{__html:`[帖子]${targetContent}`}}></span>

                <SvgIcon type="icon-arrow_into_right_line" />
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export { ComponentMessage };
export default ComponentMessage;