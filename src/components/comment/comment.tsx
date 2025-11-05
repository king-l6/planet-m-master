/*
 * @Author: Yixeu
 * @Date: 2021-11-01 14:44:27
 * @LastEditors: xushx
 * @LastEditTime: 2022-02-10 14:52:01
 * @Description: 组件-回复
 */
import React, { FC, useRef, useState, useContext, useEffect } from 'react';
import { timestampFormat } from '@/mixin';
import { ComponentSvgIcon, ComponentReply } from '@/components';
import { OPERATEAPI, DETAILAPI } from '@/api';
import { ActionSheet, Dialog, Toast } from 'antd-mobile';
import { useHistory } from 'react-router';
import type {
  Action,
  ActionSheetRef,
} from 'antd-mobile/es/components/action-sheet';
import SvgIcon from '@/components/svgicon';

import './index.less';
import { DetailPageStore } from '@/page/detail/Detail';
import { decryption, openMessage } from '@/mixin';

interface IProps {
  itemData: any;
  inPopUp?: boolean;
  isPopUpTitle?: boolean;
  beginToInput?: (name: string) => void;
  deletePopUpItem?: (businessId: string) => void;
  deletePopUpTitle?: () => void;
  likePopUpTitle?: (type: number) => void;
  articleStatus?: number
}

const businessType = 2;

const Comment: FC<IProps> = ({ itemData, inPopUp, beginToInput, deletePopUpItem, isPopUpTitle, deletePopUpTitle, articleStatus, likePopUpTitle }) => {
  const wx = (window as any).wx;
  const RefTime = useRef(null);

  const [data, setData] = useState(itemData);
  
  const handler = useRef<ActionSheetRef>();

  const { StoreDetailPage, dispatchStoreDetailPage } = useContext(DetailPageStore);

  const History = useHistory();

  const actions: Action[] = [
    {
      text: '删除',
      key: 'delete',
      onClick: () => {
        handler.current?.close();
        toConfirm();
      }
    },
    {
      text: '取消',
      key: 'edit',
      onClick: () => {
        handler.current?.close();
      },
    },
  ];

  useEffect(() => {
    if (!inPopUp) {
      //  在主评论列表所有数据要和storecommentlist关联
      const newData = JSON.parse(JSON.stringify(data));
      newData.replyCount = itemData.replyCount;
      newData.replyList = [...itemData.replyList];
      newData.isLike = itemData.isLike;
      newData.likeCount = itemData.likeCount;
      setData(newData);
    } else {
      setData(itemData);
    }
  }, [itemData]);

  const submitIsLike = async (value: number) => {
    /**
     * @description: 接口 - 点赞
     * @param {*}
     * @return {*}
     */
    try {
      await OPERATEAPI._postToLike({
        businessId: data.businessId,
        businessType,
        like: value
      });
    } catch (e) {
      console.info(e);
    }
  
    (window as any)?._sendTrack?.({ na:15,sf: data.articleBusinessId, sg:data.businessId }, true);

  };

  const throttleLikeRequest = () => {
    /**
     * @description: 节流 - 点赞
     * @param {*}
     * @return {*}
     */
    if (inPopUp) {
      setData({
        ...data,
        isLike: data.isLike === 1 ? 0 : 1,
        likeCount: data.isLike === 1 ? data.likeCount - 1 : data.likeCount + 1
      });
    } else {
      dispatchStoreDetailPage({
        type: 'clickLike',
        value: {
          id: data.businessId,
          isLike: data.isLike
        }
      });
    }
    if (likePopUpTitle) {
      //  楼中楼主评论点赞需要刷新评论列表
      likePopUpTitle(data.isLike === 1 ? 0 : 1);
    }
    if (RefTime.current) {
      clearTimeout(RefTime.current);
    }
    RefTime.current = setTimeout(() => {

      submitIsLike(data.isLike === 1 ? 0 : 1);
    }, 500);
  };

  const toConfirm = async () => {
    /**
     * @description: 确认弹窗
     * @param {*}
     * @return {*}
     */
    const result = await Dialog.confirm({
      content: '确认删除该评论？',
      confirmText: <div className="adm-dialog-footer-delete" style={{ fontSize: '16px' }}>
        删除
      </div>,
      cancelText: <div style={{ fontSize: '16px' }}>
        取消
      </div>,
    });
    if (result) {
      deleteItem();
    }
  };

  const deleteItem = async () => {
    /**
     * @description: 接口 - 删除
     * @param {*}
     * @return {*}
     */
    try {
      const res = await DETAILAPI._postToDelete({
        businessId: data.businessId,
        businessType: 2
      });
      Toast.show({
        content: '删除成功'
      });
      afterDelete();
    } catch (e) {
      console.info(e);
    }
  };

  const afterDelete = () => {
    if (inPopUp) {
      //  弹窗的删除
      if (isPopUpTitle) {
        //  弹窗的主评论删除
        deletePopUpTitle();
        return;
      }
      deletePopUpItem(data.businessId);
      return;
    }
    dispatchStoreDetailPage({
      type: 'deleteComment',
      value: data.floorNum
    });
  };

  const toOffiaiclPage = (workCode:any) => {
    History.push(`/official?workCode=${workCode}`);
  };

  const jumpPage = (e:any) => {
    !e.includes('BB') ? openMessage(e) : toOffiaiclPage(e);
  };

  return <div className="c-comment" onCopy={(e) => { e.preventDefault(); }} onContextMenu={(e) => { e.preventDefault(); }} >
    <div className="c-comment-title" >
      {data.avatarUrl ? 
        <div  className="c-comment-avatar">
          <img src={data.avatarUrl} onClick={()=>{jumpPage(data.sourceWorkCode);}}/>
          {data.sourceWorkCode.includes('BB') ? <SvgIcon type="icon-V_icon" className="vicon" /> : null}
        </div>
        : <SvgIcon type="icon-default_tx" className="avar" />}
      <div>
        <div>
          <div className="c-comment-name">
            <span  className={data.isPublisher && data.targetNickname ? 'c-comment-name-publisher' : 'c-comment-name-publish'} onClick={()=>{jumpPage(data.sourceWorkCode);}}>{data.sourceNickname}</span>
            {data.isPublisher ? <span className='c-comment-name-author'>作者</span> : null}
            {data.targetNickname ? <span className='c-comment-name-reply'>回复</span> : null}
            {data.targetNickname ? <span  className={data.isPublisher && data.targetNickname ? 'c-comment-name-raply' : 'c-comment-name-raplyer'} onClick={()=>{jumpPage(data.targetWorkCode);}}>{data.targetNickname}</span> : null}
            {data.isReplyToPublisher ? <span className='c-comment-name-author'>作者</span> : null}
          </div>
          <div className="c-comment-info">
            {data.floorNum ? `${data.floorNum}楼 · ` : null}{timestampFormat(data.commentTime)}
          </div>
        </div>
        {articleStatus !== 3 ? <div className="c-comment-method">
          <div
            onClick={() => {              
              beginToInput(data.sourceNickname);
            }}
          >
            <ComponentSvgIcon type={'icon-list_comment_line'} />
          </div>
          <div
            className={data.isLike ? 'active-btn' : ''}
            onClick={() => {
              throttleLikeRequest();
            }}
          >
            <ComponentSvgIcon type={data.isLike ? 'icon-list_recommend_fill' : 'icon-list_recommend_line'} />
          </div>
          {
            data.likeCount ? <span className="c-comment-method-likecount" style={{ color: data.isLike ? '#00AEEC' : '' }}>{data.likeCount > 9999 ? `${Math.floor(data.likeCount / 10000)}万` : data.likeCount}</span>
              : null
          }
          {
            data.isOwner ? <div className="c-comment-method-menu" onClick={() => {
              handler.current = ActionSheet.show({
                actions,
                // getContainer:document.getElementsByClassName('detail-page')[0],
                onClose: () => {
                  console.info(1111);
                },
              });
            }}><ComponentSvgIcon type={'icon-more_vertical_fill'} /></div>
              : null
          }
        </div> : null}
      </div>
    </div>
    <div className="c-comment-content">
      {
        data.isTop ? <span>置顶</span> : ''
      }
      <div dangerouslySetInnerHTML={{ __html: decryption(data.content) }}></div>
    </div>
    {
      data.replyCount && data.replyList && !inPopUp ? <ComponentReply data={data} count={data.replyCount} /> : null
    }

  </div>;
};

export { Comment };
export default Comment;
