import React, { FC, useState } from 'react';
import SvgIcon from '@/components/svgicon';
import { timestampFormat } from '@/mixin';
import { useHistory } from 'react-router';
import { decryption, openMessage } from '@/mixin';

interface IProps {
  photo: string
  name: string
  relationBusinessType: number
  time: string
  targetContent: string
  businessId: string
  isRead: number
  parentCommentCount?: number
  workCode:any
}

const ComponentMessage: FC<IProps> = ({ photo, name, relationBusinessType, time, targetContent, businessId, isRead, parentCommentCount, workCode }) => {
  const History = useHistory();
  const [readState, setReadState] = useState(isRead);

  const jumpToDetail = () => {
    /**
     * @description: 消息中心 - 点击艾特消息跳转到详情
     * @param {*}
     * @return {*}
     */
    setReadState(1);
    History.push(`/detail?tId=${businessId}&skeleton=${parentCommentCount}`);
  };
  return (
    <div className="aite-card" onCopy={(e) => { e.preventDefault(); }} onContextMenu={(e) => { e.preventDefault(); }}>
      <div className="aite-card-info">
        <div className="aite-card-info-pic" onClick={()=>{openMessage(workCode);}}>
          {readState === 0 ? <div className="read"></div> : null}
          {photo ? <img src={photo} alt="" /> : <SvgIcon type="icon-default_tx" className="avar" />}
        </div>
        <div className="aite-card-info-name">
          <div><span onClick={()=>{openMessage(workCode);}}>{name}</span>在{relationBusinessType === 2 ? '评论' : '帖子'}里@了你</div>
          <div>{timestampFormat(time)}</div>
        </div>
      </div>

      <div className="aite-card-content">
        {
          relationBusinessType === 2 ? (
            <>
              <div className="fake-div"></div>
              <div className="comment" onClick={jumpToDetail} dangerouslySetInnerHTML={{ __html: decryption(targetContent) }}></div>
            </>
          ) : (
            <div className='dynamic' onClick={jumpToDetail}>
              <span dangerouslySetInnerHTML={{ __html: `[帖子]${targetContent}` }}></span>
              <SvgIcon type="icon-arrow_into_right_line" />
            </div>
          )
        }

      </div>
    </div>
  );
};
export { ComponentMessage };
export default ComponentMessage;