import React from 'react';
import { Popup } from 'antd-mobile';
import './index.less';

interface IFullScreenDialog  {
  title?: string,
  isShow: boolean,
  children: any,
  specialStyle?: any
}

const FullScreenDialog = ({
  isShow = false,
  children,
  specialStyle=''
}:IFullScreenDialog) => {
  return (
    <>
      {
        isShow && <Popup
          visible={isShow}
          bodyStyle={{ minHeight: '100vh' }}
        >
          {children}
        </Popup>
      }
    </>
  );
};


export { FullScreenDialog };
export default FullScreenDialog;


