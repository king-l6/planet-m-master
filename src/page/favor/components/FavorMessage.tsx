import React, { FC, useState } from 'react';
import { useHistory } from 'react-router';
import SvgIcon from '@/components/svgicon';
import { timestampFormat, decryption, openMessage } from '@/mixin';

interface IProps {
  photo: string
  name: string
  relationBusinessType: number
  time: string
  targetContent: string
  businessId: string
  isRead: number
  parentCommentCount?:any
  workCode:any
}
const ComponentMessage: FC<IProps> = ({ photo, name, relationBusinessType, time, targetContent, businessId, isRead,parentCommentCount,workCode }) => {
  const History = useHistory();
  const [readState, setReadState] = useState(isRead);

  const jumpToDetail = () => {
    /**
     * @description: 消息中心 - 点赞跳转到详情
     * @param {*}
     * @return {*}
     */
    setReadState(1);
    History.push(`/detail?tId=${businessId}&skeleton=${parentCommentCount}`);
  };
  return (
    <div className="favor-card"  onCopy={(e)=>{e.preventDefault();}} onContextMenu={(e)=>{e.preventDefault();}}>
      <div className="favor-card-info">
        <div className="favor-card-info-pic" onClick={() =>{openMessage(workCode);}}>
          {readState === 0 ? <div className="read"></div> : null}
          <img src={photo} alt="" />
        </div>
        <div className="favor-card-info-name">
          <div><span onClick={()=>{openMessage(workCode);}}>{name}</span>赞了你的{relationBusinessType === 1? '帖子':'评论'}</div>
          <div>{timestampFormat(time)}</div>
        </div>
      </div>

      <div className="favor-card-content">
        {
          relationBusinessType === 2 ? (
            <>
              <div className="fake-div"></div>
              <div className="comment" onClick={jumpToDetail} dangerouslySetInnerHTML={{__html:decryption(targetContent)}}></div>
            </>
          ) : (
            <div className='dynamic' onClick={jumpToDetail}>
              <span dangerouslySetInnerHTML={{__html:`[帖子]${targetContent}`}}></span>

              <SvgIcon type="icon-arrow_into_right_line" />
            </div>
          )
        }

      </div>
    </div>
  );
};
export {ComponentMessage};
export default ComponentMessage;