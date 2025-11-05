/*
 * @Author: Yixeu
 * @Date: 2021-11-01 14:44:27
 * @LastEditors: xushx
 * @LastEditTime: 2022-02-10 14:17:35
 * @Description: 组件-输入
 */
import
React,
{
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
  useContext
} from 'react';
import { ComponentSvgIcon } from '../';
import { OPERATEAPI, DETAILAPI } from '@/api';
import { Toast } from 'antd-mobile';
import { Store } from '@/store';


import { ComponentFullScreenDialog } from '@/components/index';
import SvgIcon from '@/components/svgicon';
import Aite from '@/page/aite';
import {
  showAt,
  pushInnerFormat_comment,
  pushInnerFormat,
  replaceAtUser,
  regFilter,
  htmlSpanParse, pasteHtmlAtCaret, jugdeWriteSpace
} from '@/page/publish/components/publishEdit/edit';
import { encryption } from '@/mixin';
import InputPc from '@/components/input/pc/input-pc';
import classnames from 'classnames';

import { fixedIOSInput, isiOS, IsPc, jugdeWriteSpace_comment, replaceAtUser_comment } from '@/mixin';
import './index.less';
import { useDidMount } from 'hooooks';
import { PIC_TIPL } from '@/assets/image.ts';


interface IProps {
  countData?: any;
  changeCountData?: (data: any) => void;
  addItem?: (item: any) => void;
  addReply: (item: any, index?: number) => void;
  placeholderPop?: string;
  inPop?: boolean;
  popComment?: any;
  inArticle?: boolean;
  pageScrollTop?: number
}

let flag: any = null; // 对评论进行回复时，避免 再次点击输入框变成对文章的评论
let becauseOfAiteBlur: any = null; //@时会出现弹框导致失去焦点，出现回复错误
const businessType = 1;
const InputV2 = React.forwardRef(({
  countData,
  changeCountData,
  addItem,
  addReply,
  placeholderPop,
  inPop, popComment,
  inArticle, pageScrollTop
}: IProps, ref) => {

  // const currentVersion = sessionStorage.getItem('app_version');

  useDidMount(() => {
    fixedIOSInput();
  });

  const RefTimeSubmitLike = useRef(null);
  const RefTimeSubmitStar = useRef(null);
  const RefEdit = useRef(null);

  const { state, dispatch } = useContext(Store);

  const DOMRefInput = useRef() as any;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const [isInput, setIsInput] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [placeholderValue, setplaceholderValue] = useState(inPop ? placeholderPop : '我也来说两句');

  const [commentData, setCommentData] = useState(inPop ? popComment : null);
  const [commentIndex, setCommentIndex] = useState(null);

  const [isInArticle, setIsInArticle] = useState(inArticle);

  const [inputV2State, setInputV2State] = useState(false);
  useEffect(() => {
    //富文本空标签处理    
    if (DOMRefInput.current?.innerHTML === '<br>') {
      resetInput();
    }
    //去除零宽字符
    if (DOMRefInput.current?.innerHTML.replace(/[\u200B-\u200D\uFEFF]/g, '') === '') {
      resetInput();
    }
    //@内容onInput 检测不到 所以要在次监听
    setInputValue(DOMRefInput.current?.innerHTML);
  }, [DOMRefInput.current?.innerHTML]);

  const submitIsLike = async (value: number) => {
    /**
      * @description: 接口 - 点赞
      * @param {*}
      * @return {*}
    */
    try {
      await OPERATEAPI._postToLike({
        businessId: countData.businessId,
        businessType,
        like: value
      });
      //在详情 点赞埋点      
      (window as any)?._sendTrack?.({ nf: 2, sf: countData.businessId }, true);

    } catch (e) {
      console.info(e);
    }
  };

  const submitIsStar = async (value: number) => {
    /**
      * @description: 接口 - 收藏
      * @param {*}
      * @return {*}
    */
    try {
      await OPERATEAPI._postToStar({
        businessId: countData.businessId,
        businessType,
        fav: value
      });
      //在详情 收藏埋点
      (window as any)?._sendTrack?.({ ne: 2, sf: countData.businessId }, true);

    } catch (e) {
      console.info(e);
    }
  };

  const submitContent = async () => {
    /**
      * @description: 接口 - 评论接口
      * @param {*}
      * @return {*}
    */

    try {
      const sendValue = inputValue.replace(/<div>/g, '').replace(/&nbsp;/g, '').replace(/<\/div>/g, '').replace(/<br>/g, '').trim();
      if (sendValue == '') {
        blurInput();
        Toast.show({
          icon: 'fail',
          content: '评论/回复内容不能为空',
          duration: 2000
        });
        resetInput();
        return;
      }
      const res = await DETAILAPI._postToComment({
        articleBusinessId: countData.businessId,
        content: encryption(regFilter(pushInnerFormat_comment(inputValue))),
        atUserList: htmlSpanParse(inputValue)
      });
      Toast.show({
        content: '评论发表成功',
        duration: 2000
      });
      resetInput();
      addItem(res);
      //评论成功后回到顶部
      // document.querySelector('.detail-page').scrollTo(0,0)
      //评论埋点
      (window as any)?._sendTrack?.({ na:13,sf: countData.businessId }, true);
    } catch (e) {
      console.info(e);
    }
  };

  const submitReplyContent = async () => {
    /**
        * @description: 接口 - 回复
        * @param {*}
        * @return {*}
        */
    try {
      const sendValue = inputValue.replace(/<div>/g, '').replace(/&nbsp;/g, '').replace(/<\/div>/g, '').replace(/<br>/g, '').trim();
      if (sendValue == '') {
        blurInput();
        Toast.show({
          icon: 'fail',
          content: '评论/回复内容不能为空',
          duration: 2000
        });
        resetInput();
        return;
      }
      const res:any = await DETAILAPI._postToReply({
        articleBusinessId: commentData.articleBusinessId,
        parentBusinessId: commentData.commentType === 1 ? commentData.businessId : commentData.parentBusinessId,
        content: encryption(regFilter(pushInnerFormat_comment(inputValue))),
        atUserList: htmlSpanParse(inputValue),
        relationBusinessId: commentData.businessId
      });
      Toast.show({
        content: '回复成功',
        duration: 2000
      });
      if (inPop) {
        //  判断是不是popup 的input
        resetInput();
        setplaceholderValue(placeholderPop);
        setCommentData(popComment);
        addReply(res);

      } else {
        const newComment = JSON.parse(JSON.stringify(commentData));
        newComment.replyList.unshift(res);
        if (newComment.replyList.length > 2) {
          newComment.replyList.splice(2, 1);
        }
        newComment.replyCount = newComment.replyCount ? newComment.replyCount === -1 ? -1 : newComment.replyCount + 1 : 1;
        resetInput();
        setplaceholderValue('我也来说两句');
        addReply(newComment, commentIndex);
      }

      //回复埋点
      if(res){
        (window as any)?._sendTrack?.({ na:14,sf: res.articleBusinessId, se:res.relationBusinessId }, true);
      }

    } catch (e) {
      console.info(e);
    }
  };

  useImperativeHandle(ref, () => ({
    /**
     * @description: 暴露出的方法
     * @param {string} nickName
     * @param {any} data
     * @param {number} i
     * @return {*}
     */
    focus: (nickName: string, data: any, i: number) => {
      setplaceholderValue(`回复 ${nickName}`);
      DOMRefInput.current.focus();
      setCommentData(data);
      setCommentIndex(i);
      if (!inPop) {
        flag = 'reply';
        setIsInArticle(false);
        setInputV2State(true);
      }
    }
  }));

  const renderFavNode = () => {
    /**
     * @description: DOM - 渲染收藏节点
     * @param {*} param1
     * @return {*}
     */
    const renderNodeContent = () => {
      if(!countData || !countData.favoriteCount || countData.favoriteCount <=0 ) {
        return '收藏';
      }
      return countData.favoriteCount > 9999 ? `${Math.floor(countData?.favoriteCount / 10000)}万` : countData.favoriteCount;
    };

    return <div className={countData?.isFav ? 'active-btn' : ''} 
      onClick={() => {
        changeCountData({
          ...countData,
          isFav: countData.isFav === 1 ? 0 : 1,
          favoriteCount: countData.isFav === 1 ? countData.favoriteCount - 1 : countData.favoriteCount + 1
        });
        if (RefTimeSubmitStar.current) {
          clearTimeout(RefTimeSubmitStar.current);
        }
        RefTimeSubmitStar.current = setTimeout(() => {
          submitIsStar(countData.isFav === 1 ? 0 : 1);
        }, 500);
      }}>
      <ComponentSvgIcon type={countData?.isFav ? 'icon-list_star_fill' : 'icon-list_star_line'} />
      <span>{renderNodeContent()}</span>
    </div>;
  };

  const renderLikeNode = () => {
    /**
     * @description: DOM - 渲染点赞节点
     * @param {*} param1
     * @return {*}
     */

    const renderNodeContent = () => {
      if(!countData || !countData.likeCount || countData.likeCount <=0 ) {
        return '点赞';
      }
      return countData.likeCount > 9999 ? `${Math.floor(countData?.likeCount / 10000)}万` : countData.likeCount;
    };

    return <div className={countData?.isLike ? 'active-btn' : ''} 
      onClick={() => {
        changeCountData({
          ...countData,
          isLike: countData.isLike === 1 ? 0 : 1,
          likeCount: countData.isLike === 1 ? countData.likeCount - 1 : countData.likeCount + 1
        });
        if (RefTimeSubmitLike.current) {
          clearTimeout(RefTimeSubmitLike.current);
        }
        RefTimeSubmitLike.current = setTimeout(() => {
          submitIsLike(countData.isLike === 1 ? 0 : 1);
        }, 500);
      }}>
      <ComponentSvgIcon type={countData?.isLike ? 'icon-list_recommend_fill' : 'icon-list_recommend_line'} />
      <span>{renderNodeContent()}</span>
    </div>;
  };

  //监听输入
  const handleKeyUp = (isAt?: boolean) => {
    setText(DOMRefInput.current.innerText);
    //判断是否在删除
    if (text.length > DOMRefInput.current.innerText.length) return;
    if (isAt || showAt()) {
      const select: any = window.getSelection();
      becauseOfAiteBlur = true;
      dispatch({
        value: {
          selection: {
            focusOffset: select.focusOffset,
            focusNode: select.focusNode.childNodes.length === 1 ?
              select.focusNode.childNodes[0] : select.focusNode
          }
        }
      });
      if (select) {
        setVisible(true);
        dispatch({ value: { commentPopShow: true } });
      }
    }
  };

  const getAiteChildren = (data: any) => {
    replaceAtUser_comment(data, state);
    setVisible(false);
    dispatch({
      value: { commentPopShow: true }
    });
  };

  const closeCallback = (close: boolean) => {
    setVisible(close);
    //首次取消@值清空
    if (DOMRefInput.current?.innerHTML === '@') {
      DOMRefInput.current.innerText = '';
    }
    DOMRefInput.current.focus();
  };

  const renderCommentNode = () => {
    /**
     * @description: DOM - 评论节点
     * @param {*}
     * @return {*}
     */
    
    const renderNodeContent = () => {
      if(!countData || !countData.commentCount || countData.commentCount <=0 ) {
        return '评论';
      }
      return countData.commentCount > 9999 ? `${Math.floor(countData?.commentCount / 10000)}万` : countData.commentCount;
    };

    return <div
      onClick={() => {
        if (!isInArticle) {
          setInputValue('');
        }
        setInputV2State(true);
        
        setIsInArticle(true);
        // resetInput();
        DOMRefInput.current.focus();
        setCommentData(null);
        setCommentIndex(null);
      }}
      className="comment"
    >
      <ComponentSvgIcon type={'icon-list_comment_line'} />
      <span>{renderNodeContent()}</span>
    </div>;
  };

  const listenEditScroll = (e: any) => {
    e.stopPropagation();
  };

  const renderInputNode = () => {
    return (
      <>
        <div className="edit-wrapper" id="edit-wrapper" 
          style={
            !inputV2State?{
              opacity:0,
              zIndex:-100,
            }:{
              opacity:1,
              zIndex:100
            }
          }
          ref={RefEdit} onScroll={(e) => { listenEditScroll(e); }}>
          {
            IsPc() ?
              renderInputNodePc() :
              <>
                <div
                  placeholder={placeholderValue}
                  ref={DOMRefInput}
                  id="editRef"
                  contentEditable
                  onInput={() => {
                    jugdeWriteSpace_comment();
                    setInputValue(DOMRefInput.current?.innerHTML);
                    handleKeyUp(false);
                  }}
  
                  onClick={(e: any) => {
                    if (!inPop && !inputValue && flag !== 'reply') {
                      setIsInArticle(true);
                    }
                  }}
                  onFocus={() => {
                    setIsInput(true);
                  }}
                  onBlur={() => {
                    if (!inPop) {
                      if (flag == 'reply' && becauseOfAiteBlur) {
                        setIsInArticle(false);
                      } else {
                        setIsInArticle(true);
                      }
                      flag = null;
                    }
                    
                    if(inputV2State && !becauseOfAiteBlur){                      
                      setInputV2State(false);
                    }
                    becauseOfAiteBlur = null;
                    setIsInput(false);
                    if (isiOS) {
                      window.scrollTo(0, pageScrollTop);
                    }
                    setplaceholderValue(placeholderPop ? placeholderPop : '我也来说两句');
                  }}
  
                  onKeyDown={(e:any) => {
                    if (e.key == '@' || e.keyCode=='@' || e.code === 50) {
                      becauseOfAiteBlur = true;
                    }
                  }}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData('Text');
                    document.execCommand('insertText', false, text);
                    e.preventDefault();
                  }}
                  className={classnames(
                    [
                      'comment-input',
                      isInput && !inputValue && 'overall',
                      isInput && inputValue && 'overall-not'
                    ])}
                >
                </div>
                {inputValue ? renderPublish(): null}
              </>
              
          }
          
          <ComponentFullScreenDialog isShow={visible} specialStyle={inPop ? 'comment-style' : ''}>
            <Aite from="edit" getAiteChildren={getAiteChildren} closeCallback={closeCallback} blurInput={blurInput} />
          </ComponentFullScreenDialog>
        </div>
        
      </>
    );
    
  };

  //pc端评论
  const renderInputNodePc = () => {
    return (
      <div
        placeholder={placeholderValue}
        ref={DOMRefInput}
        id="editRef"
        contentEditable
        onInput={() => {
          jugdeWriteSpace_comment();
          setInputValue(DOMRefInput.current?.innerHTML);
          handleKeyUp(false);
        }}
        onClick={() => {
          if (!inPop && !inputValue && flag !== 'reply') { setIsInArticle(true); }
        }}
        onFocus={() => { setIsInput(true); }}
        onBlur={() => {
          if (!inPop) {
            if (flag == 'reply' && becauseOfAiteBlur) {
              setIsInArticle(false);
            } else {
              setIsInArticle(true);
            }
            flag = null;
          }
          becauseOfAiteBlur = null;
          setIsInput(false);
          if (isiOS) {
            window.scrollTo(0, pageScrollTop);
          }
          setplaceholderValue(placeholderPop ? placeholderPop : '我也来说两句');
        }}
        onKeyDown={(e:any) => {
          if (e.key == '@' || e.keyCode=='@' || e.code === 50) {
            becauseOfAiteBlur = true;
          }
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData('Text');
          document.execCommand('insertText', false, text);
          e.preventDefault();
        }}
        className={classnames(
          [
            'comment-input',
            isInput && !inputValue && 'overall',
            isInput && inputValue && 'overall-not'
          ])}
      ></div>
    );
  };

  const renderPublish = () => {
    return (
      IsPc() ?
        <InputPc onClick={() => {
          if (isInArticle) {
            submitContent();
          } else {
            submitReplyContent();
          }
        }} /> :
        <div className="c-input-v2-btn-publish" 
          
          onTouchStart={(e) => {
            if (isInArticle) {
              submitContent();
            } else {
              submitReplyContent();
            }
          }}>发布</div>
    );
  };


  const resetInput = () => {
    DOMRefInput.current.innerHTML = '';    
    setInputValue('');
    setText('');
  };

  const blurInput = () => {
    DOMRefInput.current.blur();
  };

  const formetFont = (e: any) => {
    if (e.length <= 5) {
      return e;
    } else {
      return e.slice(0, 5) + '...';
    }
  };

  return <div className="c-input-v2">
    <div>
      {
        isInput && !inputValue && state.userInfo.currentOfficial ? <div className='c-input-v2-customerService'>
          <div className='identitycard'>当前身份为:{formetFont(state.userInfo.nickName)}</div>
          <img src={PIC_TIPL} className='tips' />
          {
            state.userInfo.avatarUrl ? <img src={state.userInfo.avatarUrl} alt="" className='iconService' />
              : <SvgIcon type="icon-default_tx" className='iconService' />
          }
        </div> : null
      }
      {renderInputNode()}
      {
        isInput && inputValue  ? null : isInput ? null : countData ? <div className='c-input-v2-operate'>
          {renderFavNode()}
          {renderCommentNode()}
          {renderLikeNode()}
        </div> : null
      }
    </div>
  </div>;
});

export { InputV2 };
export default InputV2;
