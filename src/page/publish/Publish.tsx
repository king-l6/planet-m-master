import React, { useEffect, useState, useRef } from 'react';
import { fixedIOSInput } from '@/mixin/index';
import * as Components from './components';
import {
  ComponentWXUpload,
  ComponentFooter
} from '@/components/index';
import PublishEdit from './components/publishEdit/index';

import './index.less';
import { useDidMount } from 'hooooks';
import { useDidCache } from 'react-router-cache-route';

const Publish = () => {
  const publishPageRef = useRef<HTMLDivElement>(null);
  const publishTitleRef = useRef<HTMLTextAreaElement>(null);
  const [wordsNumber, setWordsNumber] = useState<number>(0);

  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [postInner, setPostInner] = useState('');
  const [conventionDialog, setConventionDialog] = useState(2);
  const [fileList, setFileList] = useState([]);

  const [pageScrollTop, setPageScrollTop] = useState(0);

  useEffect(() => {
    /**
     * @description: 校正IOS下滑后不能回到顶部
     * @param {*}
     * @return {*}
     */
    fixedIOSInput();
  }, []);


  useDidMount(() => {
    /**
     * @description: 进入页面自动聚焦
     * @param {*}
     * @return {*}
     */
    publishTitleRef.current.focus();
  });

  useDidCache(()=>{
    if(location.hash === '#/'){
      document.title = '首页';
    }else if(location.hash === '#/personal'){
      document.title = '我的';
    }
  });
  const getPostTitle = (title: any) => {
    /**
     * @description: 接收标题组件传递的标题
     * @param {*}
     * @return {*}
     */
    setPostTitle(title);
  };

  const showConventionDialog = () => {
    /**
     * @description: 点击显示公约
     * @param {*}
     * @return {*}
     */
    setConventionDialog(1);
  };

  const getDialogState = (state: any) => {
    /**
     * @description: 接收公约组件传递的状态参数
     * @param {*}
     * @return {*}
     */
    setConventionDialog(state);
  };

  const receiveList = (fileList: any) => {
    /**
     * @description: 接收上传图片组件传过来的图片url
     * @param {*}
     * @return {*}
     */
    setFileList([...fileList]);
  };

  const deleteImg = (idx: number) => {
    fileList.splice(idx, 1);
    setFileList([...fileList]);
  };

  const getNumbers = (number: number) => {
    setWordsNumber(number);
  };

  const getchildText = (inner:any,text:any) => {
    setPostText(inner);
    setPostInner(text);
  };

  const listenScroll = () => {
    if(isiOS){
      setPageScrollTop(publishPageRef.current.scrollTop);
    }
  };
  const handleBlur = ()=>{
    if(isiOS){
      window.scrollTo(0, pageScrollTop);
    }
  };

  const isiOS = ()=>{
    const u = navigator.userAgent;
    const iOs = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端\
    if(iOs){
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className='publish-post-page fadeIn' ref={publishPageRef} onScroll={listenScroll}>
      <div className="publish-post-text" >
        <div style={{ padding: '0 16px' }}>
          <Components.Title
            postTitle={postTitle}
            getPostTitle={getPostTitle}
            titleRef={publishTitleRef}
            pageScrollTop={pageScrollTop}
            titleBlur={handleBlur}
          />
          <div className="publish-post-text-line" ></div>
        </div>
        <div className="publish-post-text-content">
          <PublishEdit getNumbers={getNumbers} getchildText={getchildText} editBlur={handleBlur}/>
          <ComponentWXUpload maxCount={9} transFileList={fileList} receiveList={receiveList} deleteImg={deleteImg} />
        </div>

      </div>

      <div className= {isiOS() ? 'publish-post-footer' : 'publish-post-footer publish-post-footerandroid'} >
        <div className="bottom">
          <div className="bottom__left">
            <div className="publish-post-convention">
              <span className="convention">
                <div>
              发布请遵守<span onClick={showConventionDialog} className="terms">《同事吧公约》</span>
                </div>
                {/* <span className="text-limit">{wordsNumber>1000? `超出限制字数${1000-wordsNumber}` : ''}</span> */}
              </span>
              <Components.Convention actionText="我知道了"
                dialogVisible={conventionDialog}
                getDialogState={getDialogState}
              />
            </div>
          </div>
          <ComponentFooter 
            postTitle={postTitle} 
            postText={postText} 
            PostInner={postInner}
            fileList={fileList} />
        </div>
      </div>
    </div>
  );
};

export { Publish };
export default Publish;