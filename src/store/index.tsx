/*
 * @Author: xushx
 * @Date: 2022-01-25 13:44:14
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-22 17:34:25
 * @Description: file content
 * @FilePath: \planet-m\planet-m\src\store\index.tsx
 */
import React, { createContext, useReducer } from 'react';

const Store = createContext({
  state: null,
  dispatch: null,
});

type stateType = {
  userInfo: object; //保存个人信息接口
  wxInfo: any; //保存企微sdk信息
  photoViewer: Array<string>;
  photoViewerShow: boolean;
  photoIndex: number;
  selection: any;
  commentSelection: any;
  commentPopShow: boolean;
  isRefresh: boolean; // 滑动到顶部刷新接口
  editIsBlur: boolean;
  titleIsBlur: boolean;
  isPullPersonal: boolean;
  alreadyReadList: Array<string>;
};

const initialState: stateType = {
  userInfo: {},
  wxInfo: null,
  photoViewer: [],
  photoViewerShow: false,
  photoIndex: 0,
  selection: null,
  commentSelection: null,
  commentPopShow: false,
  isRefresh: false,
  editIsBlur: false,
  titleIsBlur: false,
  isPullPersonal: false,
  alreadyReadList:[]
};

const reducer = (
  state: any,
  action: {
    type: string;
    value: any;
  }
) => ({
  ...state,
  ...action.value,
});

const LegoStore: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </Store.Provider>
  );
};

export { Store, LegoStore };
