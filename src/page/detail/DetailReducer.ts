/*
 * @Author: Yixeu
 * @Date: 2022-01-19 17:39:52
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-01-24 19:52:53
 * @Description: 
 */
import { values } from 'lodash';
import StoreValueTypes from './index.d';

type ActionProps = {
  type: string;
  value?: any;
}

const DetailReducer: any = (draft: StoreValueTypes, action: ActionProps) => {
  switch (action.type) {
    // 下拉更新列表
    case 'updateCommentList': {
      draft.storeCommentList = action.value;
      return draft;
    }

    //  增加评论
    case 'addComment': {
      draft.storeCommentList = draft.storeCommentList ? [action.value, ...draft.storeCommentList] : [action.value];
      return draft;
    }

    //  删除评论
    case 'deleteComment': {
      const i = draft.storeCommentList.findIndex((item: any) => item.floorNum === action.value);
      draft.storeCommentList.splice(i, 1);
      return draft;
    }

    //  增加回复
    case 'addReply': {
      draft.storeCommentList[action.value['i']] = action.value['v'];
      return draft;
    }

    //  关闭弹窗状态
    case 'closePopUpAndUpdateState': {
      draft.storeIsShowPopUp = action.value;
      return draft;
    }

    //  清除弹窗id
    case 'clearPopUpId': {
      draft.storePopUpId = null;
      return draft;
    }

    //  打开弹窗时传值
    case 'openPopUp': {
      draft.storePopUpBasicComment = action.value.basicComment;
      draft.storePopUpId = action.value.id;
      draft.storeIsShowPopUp = true;
      return draft;
    }

    //  在评论点赞
    case 'clickLike': {
      const i = draft.storeCommentList.findIndex((s: any) => {
        return s.businessId === action.value.id;
      });
      draft.storeCommentList[i]['isLike'] = action.value.isLike === 1 ? 0 : 1;
      draft.storeCommentList[i]['likeCount'] = action.value.isLike === 1 ? draft.storeCommentList[i]['likeCount'] - 1 : draft.storeCommentList[i]['likeCount'] + 1;
      return draft;
    }

    //  在弹窗里给主评论点赞
    case 'clickLikeInPopUp': {
      const i = draft.storeCommentList.findIndex((s: any) => {
        return s.businessId === draft.storePopUpId;
      });
      if (draft.storeCommentList[i]['isLike'] != action.value) {
        if (action.value === 1) {
          draft.storeCommentList[i]['likeCount']++;
        } else {
          draft.storeCommentList[i]['likeCount']--;
        }
        draft.storeCommentList[i]['isLike'] = action.value;

      }
      return draft;
    }

    //  关闭弹窗后刷新评论列表
    case 'updateCommentAfterPopUpClosed': {
      const i = draft.storeCommentList.findIndex((s: any) => {
        return s.businessId === action.value.id;
      });
      draft.storeCommentList[i]['replyCount'] = action.value.res['total'];
      draft.storeCommentList[i]['replyList'] = [];
      if (action.value.res['commentReplyList'].length >= 2) {
        draft.storeCommentList[i]['replyList'].push(action.value.res['commentReplyList'][0]);
        draft.storeCommentList[i]['replyList'].push(action.value.res['commentReplyList'][1]);
      }
      if (action.value.res['commentReplyList'].length === 1) {
        draft.storeCommentList[i]['replyList'] = [...action.value.res['commentReplyList']];
      }
      return draft;
    }

    //  弹窗删除主评论
    case 'deleteCommentInPopUp': {
      const i = draft.storeCommentList.findIndex((item: any) => item.businessId === draft.storePopUpId);
      draft.storeCommentList.splice(i, 1);
      return draft;
    }
  }
};


export default DetailReducer;