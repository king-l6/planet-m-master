/*
 * @Author: your name
 * @Date: 2021-11-13 17:18:24
 * @LastEditTime: 2021-11-24 16:57:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/src/api/home.ts
 */
import { request } from '@/api/config';
import { TypeHomeAPI } from './index.d';


//  帖子列表
const _getArticleList = (data: TypeHomeAPI.APIGetArticleList) => request(
  `/planet/article/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&order=${data.order}&scrollId=${data.scrollId}&searchKey=${data.searchKey?data.searchKey:''}`,
  {
    method: 'get',
  },
);

export {
  _getArticleList
};
