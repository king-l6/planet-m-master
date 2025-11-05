import React, { FC } from 'react';
import './index.less';
interface IProps {
  isVisible: boolean;
}
const Permission: FC<IProps> = ({ isVisible }) => {

  return (
    <div className='page-permission'>
      <div className='page-permission-permup'>
        <div className='page-permission-permup-child'>
          <div>很抱歉</div>
          <div>我们没有检测到您的星球编号</div>
          <div>无法登录</div>
          {
            isVisible ? <a href={window.location.hostname == 'bbplanet.bilibili.co' ? 'http://flow.bilibili.co/workflow/101544' : 'http://uat-flow.bilibili.co/workflow/101544'}>申请星球编号</a> : null
          }
        </div>
      </div>
    </div>
  );
};
export { Permission };
export default Permission;