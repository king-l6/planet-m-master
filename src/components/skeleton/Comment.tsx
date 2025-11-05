import React, { FC } from 'react';
import './index.less';

const Comment: FC = () => {
  return <div className="c-skeletonCom">
    <div className="c-skeletonCom-title" >
      <div className="c-skeletonCom-avatar"></div>
      <div className='c-skeletonCom-text'>
        <div className='c-skeletonCom-text-name'></div>
        <div className='c-skeletonCom-text-info'></div>
      </div>
    </div>
    <div className='c-skeletonCom-content'></div>
    <div className='c-skeletonCom-content'></div>
  </div>;
};

export { Comment };
export default Comment;
