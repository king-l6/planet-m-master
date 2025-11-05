/*
 * @Author: Yixeu
 * @Date: 2021-11-02 11:41:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-12 19:19:49
 * @Description: 组件-IconFont
 */


import React from 'react';
import './index.less';

const SvgIcon: React.FC<{
  type: string;
  color?: string;
  className?: string;
  onTouchStart?: () => void;
  onClick?: () => void;
}> = ({ type, color, className, onTouchStart, onClick }) => {
  return (
    <svg
      className={`icon ${className || ''}`}
      style={{ color: color || '' }}
      onTouchStart={() => {
        onTouchStart && onTouchStart();
      }}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <use xlinkHref={`#${type}`}></use>
    </svg>
  );
};

export default SvgIcon;
