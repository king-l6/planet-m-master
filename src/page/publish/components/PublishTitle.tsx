/*
 * @Author: your name
 * @Date: 2021-11-02 19:44:38
 * @LastEditTime: 2022-02-10 18:02:57
 * @LastEditors: xushx
 * @Description: In User Settings Edit
 * @FilePath: \planet-m\planet-m\src\page\publish\components\PublishTitle.tsx
 */

import React, { FC, useEffect, useRef, useState, useContext } from 'react';
import { Toast } from 'antd-mobile';
import { autoTextarea } from '@/mixin';
import { useDidCache, useDidRecover } from 'react-router-cache-route';
import { Store } from '@/store';

interface postTitleProps {
  postTitle: any,
  getPostTitle: any,
  titleFocus?: any,
  titleBlur?: any
  titleRef?:any
  pageScrollTop?:number
}

const Title: FC<postTitleProps> = ({titleRef, postTitle, getPostTitle, titleFocus, titleBlur }) => {
  const postTitleRef = useRef<HTMLTextAreaElement>(null);
  const [titleStyle, setTitleStyle] = useState(true);

  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    /**
     * @description: 进入页面自动聚焦
     * @param {*}
     * @return {*}
     */
    // titleRef.current.focus();
    autoTextarea(titleRef.current);
  }, []);

  useEffect(() => {
    /**
     * @description: aite页面返回到当前页面时保留内容撑起高度
     * @param {*}
     * @return {*}
     */
    if (localStorage.getItem('TitleHeight')) {
      const contentTextarea = document.getElementsByTagName('textarea')[0];
      contentTextarea.style.height = localStorage.getItem('TitleHeight');
    }
    localStorage.removeItem('TitleHeight');
  }, []);

  useDidCache(() => {
    (document as any).activeElement.blur();
  });

  useDidRecover(() => {
    titleRef.current.focus();
  });

  useEffect(() => {
    if ([...(postTitle)].length > 30) {
      setTitleStyle(false);
      Toast.show({
        content: '标题最多可输入30个字',
        duration: 3000
      });
    }else{
      setTitleStyle(true);
    }
  }, [postTitle]);

  const changePostTitle = (e: any) => {
    const regx =  /@([^@\s]*)$/;
    if(regx.test(e.target.value)) {
      Toast.show({
        content: '标题不支持@人噢',
        duration: 3000
      });
    }
    getPostTitle(e.target.value);
  };

  const stopEnter = (e: any) => {
    /**
     * @description: 阻止标题回车键
     * @param {*}
     * @return {*}
     */
    if (e.key == 'Enter' || e.code == 'Enter' || e.keyCode == 13) {
      e.preventDefault();
    }
  };

  return (
    <div className="publish-post-text-title">
      <textarea name="" id="" cols={30} rows={1}
        placeholder="请输入标题"
        value={postTitle}
        onChange={changePostTitle}
        onKeyDown={stopEnter}
        ref={titleRef?titleRef:null}
        onFocus={()=>{
          dispatch({
            value:{ 
              titleIsBlur:true
            }
          });
          if(titleFocus){
            titleFocus();
          }
        }}
        onBlur={()=>{
          dispatch({
            value:{ 
              titleIsBlur:false
            }
          });
          if(titleBlur){
            titleBlur();
          }
        }}
      >
      </textarea>
      {/* {30 - [...postTitle].length >= 0 ?<span></span>:<span></span>} */}
      <span className={titleStyle ? '' : 'title-toast'}>{30 - [...(postTitle)].length}</span>
    </div>
  );
};
export { Title };
export default Title;