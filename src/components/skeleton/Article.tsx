import React, { FC } from 'react';
import cls from 'classnames';
import './index.less';

const Article: FC<{ className?: string }> = ({className}) => {
  return <div className={cls(['c-skeletonArt', className])}>
    <div className='c-skeletonArt-head'></div>
    <div className='c-skeletonArt-head'></div>
    <div className="c-skeletonArt-title" >
      <div className="c-skeletonArt-avatar"></div>
      <div className='c-skeletonArt-text'>
        <div className='c-skeletonArt-text-name'></div>
        <div className='c-skeletonArt-text-info'></div>
      </div>
    </div>
    <div className='c-skeletonArt-content'></div>
    <div className='c-skeletonArt-content'></div>
    <div className='c-skeletonArt-content'></div>
  </div>;
};

export { Article };
export default Article;
