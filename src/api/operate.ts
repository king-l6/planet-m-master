import { request } from '@/api/config';
import { TypeOperateAPI } from './index.d';

//  点赞
const _postToLike = (data: TypeOperateAPI.APIPostToLike) => request('/planet/operation/like', {
  method: 'post',
  data,
});



//  收藏
const _postToStar = (data: TypeOperateAPI.APIPostToStar) => request('/planet/operation/fav', {
  method: 'post',
  data,
});

export {
  _postToLike,
  _postToStar
};
