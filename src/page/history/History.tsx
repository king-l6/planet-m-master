import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Tag, Toast } from 'antd-mobile';
import { GLOBALSEARCHAPI } from '@/api';
import SvgIcon from '@/components/svgicon';

import './index.less';

const History = () => {

  const History = useHistory();
  const [historyState, setHistoryState] = useState(true);
  const [historyTags, setHistoryTags] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    /**
     * @description: 接口 - 获取历史记录
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await GLOBALSEARCHAPI._getSearchHistory();
      if (res) {
        setHistoryTags(res);
      }
    } catch (error) {
      console.info(error);
    }
  };

  const toHistory = (e: any) => {
    History.replace(`/globalSearchResult?searchValue=${encodeURIComponent(e.target.innerText)}`);
  };


  const clearSearchHistory = async () => {
    /**
     * @description: 接口 - 清空历史记录
     * @param {*}
     * @return {*}
     */
    try {
      const res = await GLOBALSEARCHAPI._clearSearchHistory();
      if (res) {
        setHistoryTags([]);
      } else {
        Toast.show({
          content: '清空失败'
        });
      }
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <div className="search-page fadeIn">
      {historyTags.length > 0 && historyState ? <div className="search-page-history">
        <div className="search-page-history-head">
          <div>搜索历史</div>
          <div onClick={clearSearchHistory}>
            <SvgIcon type="icon-trash_delete_line" />
            清空
          </div>
        </div>
        <div className="search-page-history-content">
          {
            historyTags.map((tag, idx) => {
              return (
                <div key={`historyTag${idx}`} onClick={(e: any) => { toHistory(e); }}>
                  <Tag round>{tag.searchWord}</Tag>
                </div>
              );
            })
          }
        </div>
      </div> : <></>}
    </div>
  );
};
export { History };
export default History;