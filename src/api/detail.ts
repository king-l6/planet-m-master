import { request } from '@/api/config';
import { TypeDetailAPI } from './index.d';

//  获取文章详情
const _getArticleDetail = (data: TypeDetailAPI.APIGetArticleDetail) => request(
  `/planet/article/detail?businessId=${data.businessId}`,
  {
    method: 'get',
  },
);

//  获取文章统计信息
const _getArticleIndicator = (data: TypeDetailAPI.APIGetArticleIndicator) => request(
  `/planet/article/countInfo?businessId=${data.businessId}`,
  {
    method: 'get',
  },
);

//  获取文章评论
const _getArticleComment = (data: TypeDetailAPI.APIGetArticleComment) => request(
  `/planet/comment/commentList?articleBusinessId=${data.articleBusinessId}&pageSize=${data.pageSize}&pageNum=${data.pageNum}&order=${data.order}&scrollId=${data.scrollId}`,
  {
    method: 'get',
  },
);

//  获取评论的回复
const _getCommentReply = (data: TypeDetailAPI.APIGetCommentReply) => request(
  `/planet/comment/replyList?parentBusinessId=${data.parentBusinessId}&pageSize=${data.pageSize}&pageNum=${data.pageNum}&order=${data.order}&scrollId=${data.scrollId}`,
  {
    method: 'get',
  },
);


//  评论
const _postToComment = (data: TypeDetailAPI.APIPostToComment) => request('/planet/comment/publish', {
  method: 'post',
  data,
});

//  回复
const _postToReply = (data: TypeDetailAPI.APIPostToReply) => request('/planet/comment/reply', {
  method: 'post',
  data,
});

//  删除
const _postToDelete = (data: TypeDetailAPI.APIPostToDelete) => request('/planet/operation/delete', {
  method: 'post',
  data,
});


export {
  _getArticleDetail,
  _getArticleIndicator,
  _getArticleComment,
  _getCommentReply,
  _postToComment,
  _postToReply,
  _postToDelete
};
