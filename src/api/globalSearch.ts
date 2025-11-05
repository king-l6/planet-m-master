import { request } from '@/api/config';

//查询历史记录接口
const _getSearchHistory = () => request(
  '/planet/searchHistory/listSearchHistory',
  {
    method:'get',
  }
);

// 清空搜索历史
const _clearSearchHistory = () => request(
  '/planet/searchHistory/delSearchHistory',
  {
    method:'post',
  }
);
export {
  _getSearchHistory,
  _clearSearchHistory
};