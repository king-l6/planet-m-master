/*
 * @Author: your name
 * @Date: 2021-11-10 20:56:20
 * @LastEditTime: 2021-11-12 16:55:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/src/api/publish.ts
 */
import { request } from '@/api/config';
import { TypeAiteAPI } from './index.d';

// 查询@人接口
const _searchAiteTags = (data:TypeAiteAPI.APISearchAitePerson) => request(
  `/planet/article/userList?pageNum=1&pageSize=20&keyword=${encodeURIComponent(data.name.trim())}`,
  {
    method:'get'
  }
);

export {
  _searchAiteTags
};