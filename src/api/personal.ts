/*
 * @Author: your name
 * @Date: 2021-11-12 19:10:16
 * @LastEditTime: 2022-03-21 01:32:24
 * @LastEditors: Yixeu
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/src/api/personal.ts
 */
import { request } from '@/api/config';
import { TypePersonalAPI } from './index.d';

//  获取个人主页tab数量
const _getPeronalTabsAmount = () =>
  request('/planet/person/statistics', {
    method: 'get',
  });

//  参与的帖子列表
const _getJoinArticleList = (data: TypePersonalAPI.APIGetJoinArticleList) =>
  request(
    `/planet/person/parArticle?cursorTime=${data.cursorTime}&pageSize=${data.pageSize}`,
    {
      method: 'get',
    }
  );

//  发布的帖子列表
const _getPublishArticleList = (
  data: TypePersonalAPI.APIGetPublishArticleList
) =>
  request(
    `/planet/person/pubArticle?cursorTime=${data.cursorTime}&pageSize=${data.pageSize}`,
    {
      method: 'get',
    }
  );

//  收藏的帖子列表
const _getStarArticleList = (data: TypePersonalAPI.APIGetStarArticleList) =>
  request(
    `/planet/person/colArticle?cursorTime=${data.cursorTime}&pageSize=${data.pageSize}`,
    {
      method: 'get',
    }
  );

const _postVersion = (data: TypePersonalAPI.APIPostVersion) =>
  request('/planet/person/changeVersion', {
    method: 'post',
    data,
  });

export {
  _getPeronalTabsAmount,
  _getJoinArticleList,
  _getPublishArticleList,
  _getStarArticleList,
  _postVersion
};
