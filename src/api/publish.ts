/*
 * @Author: your name
 * @Date: 2021-11-10 20:56:20
 * @LastEditTime: 2021-11-12 15:18:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/src/api/publish.ts
 */
import { request } from '@/api/config';
import { TypeFunctionBarAPI } from './index.d';

//发布接口
const _publishPost = (data:TypeFunctionBarAPI.APIPublishPost) => request(
  '/planet/article/publish',
  {
    method:'post',
    data
  }
);

export {
  _publishPost
};