/*
 * @Author: your name
 * @Date: 2021-11-13 17:43:05
 * @LastEditTime: 2021-11-22 14:53:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/src/page/aite/Aite.tsx
 */
import React, { FC, useState, useRef, useEffect } from 'react';
import { ComponentSearch } from '@/components';
import { AITEAPI } from '@/api';
import { useHistory } from 'react-router';
import  { PIC_EMPTY } from '@/assets/image.ts';
import SvgIcon from '@/components/svgicon';
import './index.less';

type IAite = {
  from?: string
  getAiteChildren?:(as: {}) => void
  closeCallback?:(close: boolean) => void
  blurInput?: () => void;
}

const Aite = (props:IAite) => {
  let timer:any = null;
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] =  useState('');

  const [searchData, setSearchData] = useState([]);
  const [noResult, setNoResult] = useState(true);
  const RefSearch = useRef(null);

  useEffect(() => {
    // props.blurInput && props.blurInput();
    timer = setTimeout(() => {
      inputRef.current.focus();
    },500);

    return () => {
      timer = null;
      clearTimeout(timer);
    };
  },[]);
 

  const searchAite = async (name: any) => {
    /**
     * @description: 搜索
     * @param {*}
     * @return {*}
     */
    const res: any = await AITEAPI._searchAiteTags({ name });
    if (res.result && res.result.length > 0) {
      setNoResult(true);
      setSearchData(res.result);
    } else {
      setSearchData([]);
      setNoResult(false);
    }
  };

  const debounceSearch = (e:any) => {
    /**
     * @description: input onchange事件防抖
     * @param {*}
     * @return {*}
     */

    setSearchValue(e.target.value);

    if (RefSearch.current) {
      clearTimeout(RefSearch.current);
    }
    const trimValue = e.target.value.trimLeft().trimRight();
    if (trimValue !== '') {
      RefSearch.current = setTimeout(() => {
        searchAite(trimValue);
      }, 500);
    } else {
      setSearchData([]);
    }
  };

  
  const addAiteTags = (nickName: any, workCode: any) => {
    /**
     * @description: 添加@人。
     * @param {*}
     * @return {*}
     */
    //正文发布
    if(props.from==='edit') {
      props.getAiteChildren({nickName, workCode});
    } 
  };

  function back() {
    /**
     * @description: 取消事件
     * @param {*}
     * @return {*}
     */
    if(props.from==='edit') {
      props.closeCallback(false);
    } 
  }
  
  return (
    <div className='page-searchAitetags'>
      <div className="page-searchAitetags-search">
        <ComponentSearch placeholder='输入你想@的人' value={searchValue} onChange={debounceSearch} inputRef={inputRef}/>
        <span onClick={back}>取消</span>
      </div>
      <div className="page-searchAitetags-result">
        <div className='result-list'>
          {
            searchData.map((item, idx) => (
              <div key={`${item.name}${idx}`} onClick={addAiteTags.bind(this, item.nickName, item.workCode)}>
                { item.avatarUrl ?
                  <div className=''>
                    <img className='img' src={item.avatarUrl} alt="" />
                    {item.workCode.includes('BB') ? <SvgIcon type="icon-V_icon"  className="vicon"/> : null}
                  </div> : <SvgIcon type="icon-default_tx" className="avar"/>}
                {
                  item.adAccount ? <span>{`${item.nickName}(${item.adAccount})`}</span> : <span>{item.nickName}</span>
                }
              </div>
            ))
          }
        </div>
        <div className={noResult ? 'result-no' : 'result-no result-show'}>
          <img src={PIC_EMPTY} alt="" />
          <span>这里什么都没有叻～</span>
        </div>
      </div>

    </div>
  );
};
export { Aite };
export default Aite;