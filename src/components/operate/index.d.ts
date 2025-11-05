/*
 * @Author: Yixeu
 * @Date: 2021-11-08 20:01:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-12 19:19:08
 * @Description: 
 */

interface OperateProps {
  disable: boolean;   // menu是否允许编辑 tru 允许 false 不允许
  isOwner: number;  // 是否为当前作者  1 是 0 否
  isFav: number;  //  是否收藏 1 是 0 否
  isLike: number;  //  是否点赞 1 是 0 否
  likeCount: number;  //  点赞数量
  commentCount: number;  //  回复数量
  favoriteCount: number;  //  收藏数量
  businessId: string;  //  操作条目的ID
  businessType: number;  //  操作业务类型： 1 帖子 2 评论/回复
  parentCommentCount:number; // 骨架图
  pathname:string; //history pathname
  orderType:number; // 点击时是在 推荐 还是 最新
  lunarH:number; //点击评论进入详情，区分从主列表还是搜索
}

export { OperateProps };
export default OperateProps;
