/*
 * @Author: Yixeu
 * @Date: 2021-11-15 16:34:20
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-22 02:32:32
 * @Description: 工具函数
 */
import { FAVORPIC } from '@/assets/image.ts';
import { Toast } from 'antd-mobile';
import { AInsertIcon } from '@/page/publish/components/publishEdit/edit';
import { stripBasename } from 'history/PathUtils';

const u = navigator.userAgent;
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
type User = { nickName: string, workCode: string }

let favorPicture = `${FAVORPIC}?t=${new Date().valueOf()}`;

const IsPc: any = () => {
  /**
     * @description: 判断pc端
     * @param {*}
     * @return {*}
     */
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    if (/(iPhone|iPad|iPod|iOS)/i.test(window?.navigator.userAgent)) {
      return false;
    } else if (/(Android)/i.test(window?.navigator.userAgent)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const isMobile = () => {
  /**
     * @description: 判断手机端
     * @param {*}
     * @return {*}
     */
  return Boolean(
    navigator.userAgent.match(
      /.*(iphone|ipod|ipad|android|symbian|nokia|blackberry|rim|operamini|opera mobi|windows ce|windows phone|up\.browser|netfront|palm-|palmos|pre\/|palmsource|avantogo|webos|hiptop|iris|kddi|kindle|lg-|lge|mot-|motorola|nintendods|nitro|playstation portable|samsung|sanyo|sprint|sonyericsson|symbian).*/i
    ) ||
            navigator.userAgent.match(
              /alcatel|audiovox|bird|coral|cricket|docomo|edl|huawei|htc|gt-|lava|lct|lg|lynx|mobile|lenovo|maui|micromax|mot|myphone|nec|nexian|nook|pantech|pg|polaris|ppc|sch|sec|spice|tianyu|ustarcom|utstarcom|videocon|vodafone|winwap|zte/i
            )
  );
};

const clearStringImpurity = (str: string) =>
/**
     * @description: 字符串去空格转化为小写，常用于搜索
     * @param {*}
     * @return {*}
     */
  str.replace(/\s*/g, '').toLowerCase();

const timestampFormat = (dateTime: string) => {
  /**
     * @description: 日期显示处理
     * @param {*}
     * @return {*}
     */
  let result = '';
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const halfamonth = day * 15;
  const month = day * 30;

  const now = new Date().getTime();
  const diffValue = now - Date.parse(dateTime?.replace(/-/g, '/'));
  if (diffValue < 0) {
    //若日期不符则弹出窗口告之
    //alert("结束日期不能小于开始日期！");
  }

  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;

  const currentVersion = sessionStorage.getItem('app_version');
  const hideYear = dateTime.substr(5, dateTime.length - 8);

  if (monthC >= 1) {
    // if (parseInt(currentVersion) == 2) {
    //   if (new Date().getFullYear() < parseInt(dateTime.substr(0, 4))) {
    //     result = dateTime;
    //   } else {
    //     result = hideYear;
    //   }
    // } else {
    //   result = dateTime.substr(0, 10);
    // }
    if (new Date().getFullYear() > parseInt(dateTime.substr(0, 4))) {
      result = dateTime.substr(0, dateTime.length - 3);
    } else {
      result = hideYear;
    }
  } else if (weekC >= 1) {
    // if (parseInt(currentVersion) == 2) {
    //     if (new Date().getFullYear() < parseInt(dateTime.substr(0, 4))) {
    //         result = dateTime;
    //     } else {
    //         result = hideYear;
    //     }
    // } else {
    //     result = dateTime.substr(0, 10);
    // }
    if (new Date().getFullYear() > parseInt(dateTime.substr(0, 4))) {
      result =  dateTime.substr(0, dateTime.length - 3);
    } else {
      result = hideYear;
    }
  } else if (dayC >= 1) {
    // if (parseInt(currentVersion) == 2) {
    //     if (new Date().getFullYear() < parseInt(dateTime.substr(0, 4))) {
    //         result = dateTime;
    //     } else {
    //         result = hideYear;
    //     }
    // } else {
    //     result = dateTime.substr(0, 10);
    // }
    if (new Date().getFullYear() > parseInt(dateTime.substr(0, 4))) {
      result =  dateTime.substr(0, dateTime.length - 3);
    } else {
      result = hideYear;
    }
  } else if (hourC >= 1) {
    result = `${parseInt(hourC as any)}小时前`;
  } else if (minC >= 1) {
    result = `${
      parseInt(minC as any) < 1 ? 1 : parseInt(minC as any)
    }分钟前`;
  } else {
    result = '刚刚'; // 1分钟内显示刚刚
  }

  return result;
};

const fixedIOSInput = () => {
  /**
     * @description: ios 输入框焦点上移
     * @param {type}
     * @return:
     * @author: adam.cong
     */
  const temporaryRepair = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  document.querySelectorAll('input').forEach((item) => {
    item.onblur = temporaryRepair;
  });
  document.querySelectorAll('textarea').forEach((item) => {
    item.onblur = temporaryRepair;
  });
};

const autoTextarea = function (elem: any, extra?: any, maxHeight?: any) {
  /**
     * @description: textarea自适应
     * @param {*}
     * @return {*}
     */
  extra = extra || 0;
  const isFirefox: any =
        !!(document as any).getBoxObjectFor || 'mozInnerScreenX' in window;
  const isOpera =
        !!(window as any).opera &&
        !!(window as any).opera.toString().indexOf('Opera');
  const addEvent = function (type: any, callback: any) {
    elem.addEventListener
      ? elem.addEventListener(type, callback, false)
      : elem.attachEvent('on' + type, callback);
  };
  const getStyle: any = elem.currentStyle
      ? function (name: any) {
        const val = elem.currentStyle[name];

        if (name === 'height' && val.search(/px/i) !== 1) {
          const rect = elem.getBoundingClientRect();
          const result =
                          rect.bottom -
                          rect.top -
                          parseFloat(getStyle('paddingTop')) -
                          parseFloat(getStyle('paddingBottom'));
          return String(result) + 'px';
        }

        return val;
      }
      : function (name: any) {
        return getComputedStyle(elem, null)[name];
      },
    minHeight = parseFloat(getStyle('height'));

  elem.style.resize = 'none';

  const change = function () {
    let scrollTop,
      height,
      padding = 0;
    const style = elem.style;

    if (elem._length === elem.value.length) return;
    elem._length = elem.value.length;

    if (!isFirefox && !isOpera) {
      padding =
                parseInt(getStyle('paddingTop')) +
                parseInt(getStyle('paddingBottom'));
    }
    scrollTop =
            document.body.scrollTop || document.documentElement.scrollTop;

    elem.style.height = String(minHeight) + 'px';
    if (elem.scrollHeight > minHeight) {
      if (maxHeight && elem.scrollHeight > maxHeight) {
        height = maxHeight - padding;
        style.overflowY = 'auto';
      } else {
        height = elem.scrollHeight - padding;
        style.overflowY = 'hidden';
      }
      style.height = String(height + extra) + 'px';
      scrollTop += parseInt(style.height) - elem.currHeight;
      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;
      elem.currHeight = parseInt(style.height);
    }
  };

  addEvent('propertychange', change);
  addEvent('input', change);
  addEvent('focus', change);
  change();
};

const uuid = () => {
  /**
     * @description: 获取唯一的id
     * @param {*}
     * @return {*}
     */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
};

const isMaxList = (total: number, currentListCount: number) => {
  /**
     * @description:  后期拓展page相关字段
     * @param {*} total
     * @return {*} true 达到最大值
     */
  if (total > currentListCount) {
    return false;
  } else {
    return true;
  }
};

const backToTop = (scrollDom: any, isFresh: boolean) => {
  /**
     * @description:  滑动到顶部
     * @param {*}
     * @return {*}
     */
  const animateFunc = () => {
    if (scrollDom && scrollDom.scrollTop != 0) {
      let flag = 1;
      let animationId: any = null;
      const scrollAnimation = () => {
        const nowTop = scrollDom.scrollTop;
        if (nowTop > 0 && nowTop < scrollDom.clientHeight * 2) {
          scrollDom.scrollTop = nowTop - 150;
          animationId = requestAnimationFrame(scrollAnimation);
        } else if (nowTop >= scrollDom.clientHeight * 2) {
          if (flag == 1) {
            scrollDom.scrollTop = scrollDom.clientHeight * 2;
            flag = 0;
            animationId = requestAnimationFrame(scrollAnimation);
          } else {
            scrollDom.scrollTop = nowTop - 150;
            animationId = requestAnimationFrame(scrollAnimation);
          }
        } else {
          cancelAnimationFrame(animationId);
          //下拉刷新
          if (
            document.querySelector('.adm-pull-to-refresh-head') &&
                        isFresh
          ) {
            let refreshTop = 50;
            (
              document.querySelector(
                '.adm-pull-to-refresh-head'
              ) as any
            ).style.height = refreshTop + 'px';
            setTimeout(() => {
              const interval = setInterval(() => {
                refreshTop = refreshTop - 5;
                (
                  document.querySelector(
                    '.adm-pull-to-refresh-head'
                  ) as any
                ).style.height = refreshTop + 'px';
                if (refreshTop < 0) {
                  clearInterval(interval);
                }
              }, 20);
            }, 500);
          }
        }
      };
      animationId = requestAnimationFrame(scrollAnimation);
    }
  };
  animateFunc();
};

const dataURLtoFile = (dataurl: string, fileName: string) => {
  /**
     * @description:  图片base64转文文件
     * @param {*}
     * @return {*}
     */

  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  // console.info('mime:',mime)
  // console.info(fileName)
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Promise((resolve) => {
    resolve(new File([u8arr.buffer], fileName, { type: mime }));
  });
};

const transferFile = (dataurl: string, fileName: string) => {
  /**
     * @description:  图片base64转文文件
     * @param {*}
     * @return {*}
     */
  const dataURLtoBlob = (dataurl: any) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  const blobToFile = (theBlob: any, fileName: any) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  };

  return blobToFile(dataURLtoBlob(dataurl), fileName);
};

const getParentNode: any = (currentNode: any, findNode: any) => {
  /**
     * @description:  根据value属性获取父节点
     * @param {*}
     * @return {*}
     */
  if (currentNode?.classList['value'].indexOf(findNode) == -1) {
    return getParentNode(currentNode.parentNode, findNode);
  } else {
    return currentNode;
  }
};

const showFlower = (e: any, showDomClassName: any, showTime: any) => {
  /**
     * @description:  点赞显示花
     * @param {*}
     * @return {*}
     */
  const parentNode = getParentNode(e.target, showDomClassName);
  const div = document.createElement('div');
  div.className = 'favor-pic';
  div.innerHTML = `<img src=${favorPicture} style="width:80px; height:80px" />`;
  (div.childNodes[0] as any).onload = () => {
    div.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    if (parentNode.children.length <= 1) {
      parentNode.appendChild(div);
      favorPicture = `${FAVORPIC}?t=${new Date().valueOf()}`;
      setTimeout(() => {
        parentNode.removeChild(div);
      }, showTime);
    }
  };
};

const stopTouchMove = () => {
  document.addEventListener('touchstart', function (e) {
    e.preventDefault();
  });

  document.body.addEventListener(
    'touchmove',
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
};

//加密 防止富文本xss攻击
const encryption = (character: string) => {
  return character
    .replace(/\//g, '&#47;')
    .replace(/</g, '&#60;')
    .replace(/>/g, '&#62;')
    .replace(/\+/g, '&#43;');
};

//解密
const decryption = (character: string) => {
  return AInsertIcon(
    character
      .replace(/\n/gm, '<br/>')
      .replace(/&#47;/gm, '/')
      .replace(/&#60;/gm, '<')
      .replace(/&#62;/gm, '>')
      .replace(/&#43;/gm, '+')
  );
};

//去除所有标签
const removeAll = (str: string) => {
  return str?.replace(/<\/?.+?\/?>/g, '');
};

//分享解密
const regxShare = (str: string) => {
  return removeAll(
    str
      ?.replace(/&#60;/g, '<')
      .replace(/&#62;/g, '>')
      .replace(/&#47;/g, '/')
      .replace(/&#43;/gm, '+')
      .replace(/&#45;/gm, '-')
  );
};

const deURI = (str: string) => {
  return decodeURIComponent(str.replace(/%/g, '%25'));
};

// 处理发帖标题
const handlePostTitle = (title: string) => {
  return encryption(title.replace(/</g, '').replace(/>/g, ''))
    .trimLeft()
    .trimRight();
};
//判断是否是微信挥着企微环境
const isWxBrowser = () => {
  const env: any = navigator.userAgent.toLowerCase();
  const isWx = env.match(/MicroMessenger/i) == 'micromessenger';
  if (!isWx) {
    return false;
  } else {
    const isWxWork = env.match(/WxWork/i) == 'wxwork';
    if (isWxWork) {
      return true;
    } else {
      return false;
    }
  }
};

const openMessage = (workCode: any) => {
  const wx = (window as any).wx;
  if (workCode) {
    wx.invoke(
      'openUserProfile',
      {
        type: 1, //1表示该userid是企业成员，2表示该userid是外部联系人
        userid: workCode, //可以是企业成员，也可以是外部联系人
      },
      function (res: any) {
        if (res.err_msg != 'openUserProfile:ok') {
          //错误处理
          console.info('错误', res);
        } else {
          console.info('成功');
        }
      }
    );
  }
};

const wxShare = () => {
  const wx = (window as any).wx;
  wx.ready(() => {
    wx.onMenuShareAppMessage({
      title: '同事吧', // 分享标题
      desc: '你想哔哔的都在这里', // 分享描述
      imgUrl: 'https://i0.hdslb.com/bfs/planet/1640756088334-1640756088.jpg',
      link: 'https://dashboard-mng.biliapi.net/api/v4/user/dashboard_login?caller=bbplanet&path=%2F',
      success: function () {
        // 用户确认分享后执行的回调函数
        console.info('同事吧分享成功', window.location.href);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        console.info('同事吧取消了分享', window.location.href);
      },
    });
  });
};

const isIphoneBlackBar = () => {
  if(/iphone/gi.test(window.navigator.userAgent)){
    /* iPhone 5/5s */
    const ip5 = (window.screen.width === 320 && window.screen.height === 568);
    /* iPhone 6/7/8 */
    const ip8 = (window.screen.width === 375 && window.screen.height === 667);
    /* iPhone 6/7/8 plus */
    const ip8p = (window.screen.width === 414 && window.screen.height === 736);
    if( ip5 || ip8p || ip8){
      return true;
    } else {
      return false;
    }
  }else{
    return true;
  }
};

//创建@标签
const createAtButton = (user: User) => {
  const btn = document.createElement('at');
  btn.dataset.user = JSON.stringify(user);
  btn.className = 'at-button';
  btn.contentEditable = 'false';
  btn.textContent = `@${user.nickName}`;
  return btn;
};

const replaceString = (raw: string, replacer: string) => {
  return raw.replace(/@([^@\s]*)$/, replacer);
};

//输入@之后，光标后的内容插入 --- 评论部分
const replaceAtUser_comment = (user: User, state: any) => {  
  const selectionData = state.selection;
  const node =  selectionData?.focusNode;
  if (node) {    
    const content = node?.textContent || '';
    //获取当前光标位置
    const endIndex = selectionData?.focusOffset;    
    const preSlice = replaceString(content.slice(0, endIndex), '');
    const restSlice = content.slice(endIndex);    
    const parentNode = node?.parentNode || document.getElementsByClassName('comment-input')[0].lastChild || document.getElementsByClassName('comment-input')[0];    
    const nextNode = node?.nextSibling;
    const previousTextNode = new Text(preSlice + '\u200b');    
    const nextTextNode = new Text('\u200b' + restSlice);
    const atButton = createAtButton(user);

    if(node.childNodes.length >= 2){
      node.removeChild(node.lastChild);
      node.appendChild(new Text('\u200b'));
      node.appendChild(atButton);
      node.appendChild(nextTextNode);
    }else{
      parentNode.removeChild(node);
      if (nextNode) {
        parentNode.insertBefore(previousTextNode, nextNode);
        parentNode.insertBefore(atButton, nextNode);
        parentNode.insertBefore(nextTextNode, nextNode);
      } else {
        parentNode.appendChild(previousTextNode);
        parentNode.appendChild(atButton);
        parentNode.appendChild(nextTextNode);
      }
    }
    
    //重置光标 
    const range = new Range();
    range.setStart(nextTextNode, 1);
    range.setEnd(nextTextNode, 1);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

const jugdeWriteSpace_comment = () => {
  if (document.querySelectorAll('#editRef  font').length === 0) {
    return;
  }else if(document.querySelector('#editRef > font')){
    const parent = document.querySelector('#editRef');
    const editRefs: any = document.querySelector('#editRef > font');
    const text = document.createTextNode(editRefs.innerText);
    parent.insertBefore(text, editRefs);
    parent.removeChild(editRefs);
  }else {
    const div = document.querySelector('#editRef div');
    const font: any = document.querySelector('div > font');
    const textNode = document.createTextNode(font.innerText);
    div.insertBefore(textNode, font);
    div.removeChild(font);
  }

};

export {
  clearStringImpurity,
  timestampFormat,
  fixedIOSInput,
  autoTextarea,
  isMaxList,
  uuid,
  isMobile,
  IsPc,
  backToTop,
  transferFile,
  dataURLtoFile,
  isiOS,
  showFlower,
  stopTouchMove,
  encryption,
  decryption,
  deURI,
  isWxBrowser,
  openMessage,
  regxShare,
  wxShare,
  handlePostTitle,
  isIphoneBlackBar,
  replaceAtUser_comment,
  jugdeWriteSpace_comment
};
