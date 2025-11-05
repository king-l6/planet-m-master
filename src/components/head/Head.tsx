import React, { useRef, useState } from 'react';
import { ComponentSearch } from '@/components/index';
import { useHistory } from 'react-router';
import { useDidMount, useDidUpdate } from 'hooooks';
import './index.less';

const Head = () => {
  const RefInput = useRef<HTMLInputElement>(null);
  const History = useHistory();
  const routeParams = new URLSearchParams(History.location.search);
  const searchValue = routeParams.get('searchValue');
  const [inputValue, setInputValue] = useState(searchValue || '');

  useDidUpdate(() => {
    const routeParams = new URLSearchParams(History.location.search);
    const searchValue = routeParams.get('searchValue');
    searchValue ? setInputValue(decodeURIComponent(searchValue.replace(/%/g,'%25'))) : setInputValue('');
  }, [History.location.search]);

  useDidMount(()=>{
    if(History.action === 'POP'){
      RefInput.current?.blur();
    }else if(History.action === 'PUSH'){
      RefInput.current?.focus();
    }
  });
  const changeValue = (e: any) => {
    setInputValue(e.target.value);
  };
  const clearInput = () => {
    setInputValue('');
    RefInput.current?.focus();
  };
  const backHome = () => {
    /**
     * @description: 取消事件
     * @param {*} ele
     * @return {*}
     */
    history.back();
  };

  const jumpToResult = (e: any) => {
    /**
     * @description: 跳转到搜索结果页面
     * @param {*} ele
     * @return {*}
     */
    if (inputValue && inputValue.trim() ) {
      if (e.key == 'Enter' || e.code == 'Enter' || e.keyCode == 13) {
        History.replace(`/globalSearchResult?searchValue=${(encodeURIComponent(e.target.value))}`);
        RefInput.current.blur();
      }
    }
  };

  return (
    <div className="search-page-input">
      <ComponentSearch
        inputRef={RefInput}
        placeholder="请输入查询内容"
        value={inputValue}
        onChange={changeValue}
        clearable={true}
        onClear={clearInput}
        keydown={jumpToResult}
      />
      <span onClick={backHome}>取消</span>
    </div>

  );
};
export { Head };
export default Head;