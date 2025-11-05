import * as regExp from './regularType.ts';
type User = { nickName: string, workCode: string }

const { wordAllRegs, characters, wordRegs, gt, lt, speo } = regExp.commonRegs;
const { closeBeginLabel, closedTailLabel, notCloseBeginLabel, notCloseTailLabel } = regExp.labelRegs;

// 获取光标位置
const getCursorIndex = () => {
  const selection = window.getSelection();
  return selection?.focusOffset;
};

// 获取节点
const getRangeNode = () => {
  const selection = window.getSelection();
  return selection?.focusNode;
};

// 是否展示 @
const showAt = () => {  
  const node = getRangeNode();  
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const content = node.textContent || '';
  const regx = /@([^@\s]*)$/;
  const match = regx.exec(content.slice(getCursorIndex() - 1, getCursorIndex()));
  return match && match.length === 2;
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

//输入@之后，光标后的内容插入
const replaceAtUser = (user: User, state: any) => {  
  const selectionData = state.selection;
  const node = selectionData?.focusNode;  
  if (node) {
    const content = node?.textContent || '';
    //获取当前光标位置
    const endIndex = selectionData?.focusOffset;
    const preSlice = replaceString(content.slice(0, endIndex), '');
    const restSlice = content.slice(endIndex);
    const parentNode = node?.parentNode!;
    const nextNode = node?.nextSibling;
    const previousTextNode = new Text(preSlice + '\u200b');
    const nextTextNode = new Text('\u200b' + restSlice);
    const atButton = createAtButton(user);
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

    //重置光标 
    const range = new Range();
    range.setStart(nextTextNode, 1);
    range.setEnd(nextTextNode, 1);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

//点击@按钮 插入@
const pasteHtmlAtCaret = () => {
  let sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement('at');
      el.innerHTML = '@';
      const frag = document.createDocumentFragment();
      let node, lastNode;
      while ((node = el.firstChild)) {        
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
};

//解决富文本font标签问题
const jugdeWriteSpace = () => {
  if (!document.querySelector('#editRef > font')) return;
  const parent = document.querySelector('#editRef');
  const editRefs: any = document.querySelector('#editRef > font');
  const text = document.createTextNode(editRefs.innerText);
  parent.insertBefore(text, editRefs);
  parent.removeChild(editRefs);
};

//提取at标签id和名字
const htmlSpanParse = (res: any) => {
  const data: any = [];
  res.replace(/<at [^>]*data-user=['"]([^'"]+)[^>]*>/g, function (match: any, capture: any) {
    data.push(JSON.parse(escape2Html(capture)));
  });
  return data;
};

//富文本编辑器转意符换成普通字符
const escape2Html = (str: string) => {
  const arrEntities: any = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
};

//去除富文本标签所有属性
const removeAttr = (str: string) => {
  return str.replace(/<([a-zA-Z1-6]+)(\s*[^>]*)?>/g, '<$1>');
};

//去除除at标签以外的所有标签
const removeAllLabel = (str: string) => {
  return str.replace(/<(?!\/?at|\/?br)[^<>]*>/ig, '');
};

//富文本换行新创建div标签替换为\n --- 发帖
const divReplaceBr = (str: string) => {
  return removeAllLabel(str.replace(/<div>/g, '<br>'));
};

//富文本换行新创建div标签替换为\n --- 评论部分
const divReplaceBr_comment = (str: string) => {
  if (str.indexOf('<div><br></div>') == 0) {
    str = str.replace('<div><br></div>', '');
  }
  return removeAllLabel(str.replace(/<div>/, '<br>'));
};

//发布规则整合 -- 发帖
const pushInnerFormat = (str: string) => {
  return divReplaceBr(removeAttr(str)) === '<br>' ?
    '' : divReplaceBr(removeAttr(str));
};

//发布规则整合 -- 评论
const pushInnerFormat_comment = (str: string) => {
  return divReplaceBr_comment(removeAttr(str)) === '<br>' ?
    '' : divReplaceBr_comment(removeAttr(str));
  // return removeAttr(str) === '<br>' ?
  //   '' : removeAttr(str);
};

//去除at标签
const removeAt = (str: string) => {
  return str.replace(/<\/?at[^>]*>/ig, '');
};

//支持链接
const identifyHyperlinks = (str: string) => {
  /* eslint-disable */
  const a = /((http|ftp|https):\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;
  str = str.replace(a, (match) => {
    //过滤站内地址
    // if (/bbplanet.bilibili.co/g.test(match)) return match
    return `<a href="${match}">网页链接</a>`;
  });
  return str;
};

//匹配a标签插入icon
const AInsertIcon = (str: string) => {
  const aHrefRegExp = /<a[^>]+href=['"]([^'"]*)['"]>/gi
  str = str.replace(aHrefRegExp, (match) => {
    return ` <svg class="icon-link"><use xlink:Href=#icon-chain_link_line></use></svg>${match}`;
  });
  return str;
}

//正文部分出现闭合标签和非闭合标签的处理(规则有文档)
const matchFirstCharacters = (match: string, str: string, contrast: RegExp): string => {
  const ets = match.replace(lt, '').replace(gt, '');
  return str && contrast.test(str[0]) ? ets : match;
};

const regx = (dealExpress: string) => {
  return dealExpress = dealExpress.replace(closeBeginLabel, (match: string, $1: string): string => {
    if (wordAllRegs.test($1)) {
      return match = '';
    }
    else {
      return characters.test($1) ? match : match = matchFirstCharacters(match, $1, wordRegs);
    }
  })
    .replace(closedTailLabel, (match: string, $1: string) => {
      if (wordAllRegs.test($1)) {
        match = '';
      }
      else {
        match = match.replace(lt, '').replace(gt, '').replace(speo, '');
      }
      return match;
    })
    .replace(notCloseBeginLabel, (match: string, $1: string) => {
      return matchFirstCharacters(match, $1, wordRegs);
    })
    .replace(notCloseTailLabel, (match: string, $1: string) => {
      return match = match.replace(lt, '').replace(speo, '');
    });
};

const regFilter = (str: string) => {
  return identifyHyperlinks(regx(str).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ''))
};

export {
  getCursorIndex,
  getRangeNode,
  showAt,
  createAtButton,
  replaceString,
  replaceAtUser,
  htmlSpanParse,
  escape2Html,
  pasteHtmlAtCaret,
  jugdeWriteSpace,
  pushInnerFormat,
  pushInnerFormat_comment,
  regFilter,
  removeAt,
  removeAllLabel,
  AInsertIcon
};