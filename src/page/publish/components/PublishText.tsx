/*
 * @Author: your name
 * @Date: 2021-11-02 20:00:45
 * @LastEditTime: 2021-12-03 17:35:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /planet-m/src/components/publishPost/postText/postText.tsx
 */
import React, { FC, useEffect, useRef, useState } from 'react';
import { Toast, TextArea } from 'antd-mobile';
import { autoTextarea } from '@/mixin';

interface postTextProps {
  postText: any
  setPostText: any
  textAreaFocus?: any
  textAreaBlur?: any
  textRef?: any
  footerRef: any
  changeFooter: any

}

const Text: FC<postTextProps> = ({ textRef, postText, setPostText, textAreaFocus, textAreaBlur, footerRef, changeFooter }) => {

  let initialBottom: any = null;
  const afterBottom: any = null;

  useEffect(() => {
    autoTextarea(textRef.current);
    initialBottom = document.getElementsByClassName('publish-post-page')[0].getBoundingClientRect();
  }, []);

  useEffect(() => {
    // if (postText && postText.length > 1000) {
    //   Toast.show({
    //     content: '正文最多可输入1000个字',
    //     duration: 3000
    //   });
    // }
  }, [postText.length]);

  useEffect(() => {
    /**
     * @description: aite页面返回到当前页面时保留内容撑起高度
     * @param {*}
     * @return {*}
     */
    if (localStorage.getItem('contentHeight')) {
      const contentTextarea = document.getElementsByTagName('textarea')[1];
      contentTextarea.style.height = localStorage.getItem('contentHeight');
    }
    const publishPostText_DOM = document.getElementsByClassName('publish-post-text')[0];
    publishPostText_DOM.scrollTop = publishPostText_DOM.scrollHeight;

    localStorage.removeItem('contentHeight');

  }, []);
  const changePostText = (e: any) => {
    /**
     * @description: 随着输入内容增多滚动条下移
     * @param {*}
     * @return {*}
     */
    const publishPostText_DOM = document.getElementsByClassName('publish-post-text')[0];
    publishPostText_DOM.scrollTop = publishPostText_DOM.scrollHeight - publishPostText_DOM.clientHeight;

    setPostText(e.target.value);
    // footerRef.current.scrollIntoView()
  };

  const handleFocus = () => {
    // changeFooter(false)
    setTimeout(() => {
      footerRef.current.scrollIntoView();
      const viewInfo = textRef.current.getBoundingClientRect();
      console.info(viewInfo);
      const viewInfo1 = document.getElementsByClassName('publish-post-page')[0].getBoundingClientRect();
      console.info(viewInfo1);

      // afterBottom = viewInfo1.bottom
      // let finishPosition = initialBottom - afterBottom - 34 + 'px';
      //获取视图偏移量，重新定位操作栏
      // footerRef.current.style.bottom = '411px';

      //重置编辑区高度
      // (document.getElementsByClassName('publish-post-text')[0] as any).style.height = `calc(100vh - 411px )`;
      // (document.getElementsByClassName('publish-post-page')[0] as any).style.height =  `calc(100vh - ${finishPosition}px )`;
      // document.body.style.height = `calc(100vh - 411px )`;
      // (document.getElementsByClassName('lego')[0] as any).style.height =  `calc(100vh - 411px )`;
      //还原偏移量
      // scrollTo(0, 0)
      // changeFooter(true)
    }, 100);
  };

  const handleBlur = () => {
    // footerRef.current.style.bottom = 0;
    // (document.getElementsByClassName('publish-post-text')[0] as any).style.height = `100vh`;
    // (document.getElementsByClassName('publish-post-page')[0] as any).style.height =  `100vh`;
    // document.body.style.height = `100vh`;
    // (document.getElementsByClassName('lego')[0] as any).style.height =  `100vh`;
    // changeFooter(true);
  };
  return (
    <textarea
      ref={textRef}
      placeholder='正文'
      rows={3}
      value={postText}
      onChange={changePostText}
      // onFocus={() => { handleFocus() }}
      // onBlur={() => { handleBlur() }}
    />
  );
};
export { Text };
export default Text;