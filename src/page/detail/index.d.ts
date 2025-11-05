/*
 * @Author: Yixeu
 * @Date: 2022-01-19 17:50:08
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-01-22 13:57:02
 * @Description: 
 */



interface StoreValueTypes {
  storePopUpId: string,   // 弹窗主评论ID，用来请求弹窗数据
  storeIsShowPopUp: boolean,  // 弹窗是否弹起
  storePopUpBasicComment: any,  //  弹窗主评论内容
  storeCommentList: Array<any>  //  评论列表
}

export { StoreValueTypes };
export default StoreValueTypes;