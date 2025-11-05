/*
 * @Author: Yixeu
 * @Date: 2021-11-02 20:08:55
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-22 17:43:30
 * @Description: 组件-菜单
 */

import React, { FC, useContext, useEffect } from 'react';
import { ComponentSvgIcon } from '../';
import { Store } from '@/store';
import './index.less';
import { Toast } from 'antd-mobile';
import { useHistory } from 'react-router';
import { isIphoneBlackBar } from '@/mixin/tools';

interface IProps {
  changeTab: (url: string) => void;
  activeTab: string;
}

const Menu: FC<IProps> = ({ changeTab, activeTab }) => {
  const { state, dispatch } = useContext(Store);
  const History = useHistory();

  const currentVersion = sessionStorage.getItem('app_version');

  return (
    <div
      className={
        parseInt(currentVersion) === 2
          ? 'c-menu c-menu-v2'
          : isIphoneBlackBar()
            ? 'c-menu'
            : 'c-menu cMenu'
      }
      onCopy={(e) => {
        e.preventDefault();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <span
        className={
          activeTab && activeTab === '/'
            ? `c-menu-tab ${
              parseInt(currentVersion) === 2
                ? 'tab-active-v2'
                : 'tab-active'
            }`
            : 'c-menu-tab'
        }
        onClick={() => {
          if (History.location.pathname !== '/') {
            changeTab('/');
          } else {
            dispatch({
              value: {
                ...state,
                isRefresh: true,
              },
            });
          }
        }}
      >
        {parseInt(currentVersion) === 2 ? (
          <span className="c-menu-tab-v2-icon">
            {' '}
            <ComponentSvgIcon type={'icon-ic_home_line'} />
            <span>首页</span>
          </span>
        ) : (
          '首页'
        )}
      </span>
      <span
        className="c-menu-btn"
        onClick={() => {
          const { publish } = state.userInfo;
          if (publish === 0) {
            Toast.show({
              content:
                                '由于严重违反公约规范，你已被系统禁言。遵守同事吧公约，维护同事吧环境，从你我做起！',
              duration: 3000,
            });
          } else {
            changeTab('/publish');
          }
        }}
      >
        <ComponentSvgIcon type={'icon-plus_add_line'} />
      </span>
      <span
        className={
          activeTab && activeTab === '/personal'
            ? `c-menu-tab ${
              parseInt(currentVersion) === 2
                ? 'tab-active-v2'
                : 'tab-active'
            }`
            : 'c-menu-tab'
        }
        onClick={() => {
          if (window.location.hash !== '#/personal') {
            changeTab('/personal');
          }
        }}
      >
        {parseInt(currentVersion) === 2 ? (
          <span className="c-menu-tab-v2-icon">
            {' '}
            <ComponentSvgIcon type={'icon-ic_tv_line'} />
            <span>我的</span>
          </span>
        ) : (
          '我的'
        )}
      </span>
    </div>
  );
};

export { Menu };
export default Menu;
