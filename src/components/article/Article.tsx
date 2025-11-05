/*
 * @Author: Yixeu
 * @Date: 2021-11-01 17:24:00
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-22 20:28:34
 * @Description: 组件-卡片
 */
import React, { FC, Fragment, useRef, useContext, useEffect } from 'react';
import { timestampFormat, decryption } from '@/mixin';
import { ActionSheet, Dialog, Toast, ImageViewer } from 'antd-mobile';
import { ComponentSvgIcon } from '@/components';
import SvgIcon from '@/components/svgicon';
import type {
  Action,
  ActionSheetRef,
} from 'antd-mobile/es/components/action-sheet';
import { DETAILAPI } from '@/api';
import { Store } from '@/store';
import { clearCache, dropByCacheKey } from 'react-router-cache-route';

import './index.less';
import { useHistory } from 'react-router';
import { IsPc, openMessage } from '@/mixin/tools';

interface IProps {
  data: any;
  indicator: {
    articleStatus: number;
    auditStatus: number;
    businessId: string;
    commentCount: number;
    favoriteCount: number;
    isDeleted: number;
    isFav: number;
    isLike: number;
    isOwner: number;
    isTop: number;
    likeCount: number;
    viewCount: number;
  };
  changeScrollIntoView: any;
}

const DOMIconPoint = <span className="c-article-icon-point">&#183;</span>;
const windowPX = Math.round(window.devicePixelRatio);

const Article: FC<IProps> = ({ data, indicator, changeScrollIntoView }) => {
  const handler = useRef<ActionSheetRef>();
  const History = useHistory();
  const routeParams = new URLSearchParams(History.location.search) as any;
  const wx = (window as any).wx;
  const currentVersion = sessionStorage.getItem('app_version');

  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    changeScrollIntoView(2);
  }, [data.picList]);

  const actions: Action[] = [
    {
      text: '删除',
      key: 'delete',
      onClick: () => {
        handler.current?.close();
        toConfirm();
      },
    },
    {
      text: '取消',
      key: 'edit',
      onClick: () => {
        handler.current?.close();
      },
    },
  ];

  const getImgUrl = (baseUrl: string) => {
    if (baseUrl.indexOf('?') != -1) {
      return `${baseUrl.substr(0, baseUrl.indexOf('?'))}@${
        windowPX * 98
      }w_${windowPX * 98}h_1e_1c.png${baseUrl.substr(
        baseUrl.indexOf('?'),
        baseUrl.length
      )}`;
    } else {
      return `${baseUrl}@${windowPX * 98}w_${windowPX * 98}h_1e_1c.png`;
    }
  };

  const toConfirm = async () => {
    /**
         * @description: 确认弹窗
         * @param {*}
         * @return {*}
         */
    const result = await Dialog.confirm({
      content: '确认删除该帖子？',
      confirmText: (
        <div
          className="adm-dialog-footer-delete"
          style={{ fontSize: '16px' }}
        >
                    删除
        </div>
      ),
      cancelText: <div style={{ fontSize: '16px' }}>取消</div>,
    });
    if (result) {
      deleteItem();
    }
  };

  const goLockRelated = () => {
    if (data.lockRelatedContent && data.lockRelatedContent !== '') {
      window.open(data.lockRelatedContent);
    }
  };

  const toOffiaiclPage = (workCode: any) => {
    History.push(`/official?workCode=${workCode}`);
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
        businessType: 1,
      });
      Toast.show({
        content: '删除成功',
      });
      if (
        routeParams.get('from') &&
                routeParams.get('from') == 'homeCommand'
      ) {
        clearCache();
        sessionStorage.setItem('bf', '2');
        History.goBack();
      } else if (
        routeParams.get('from') &&
                routeParams.get('from') == 'homeNew'
      ) {
        clearCache();
        sessionStorage.setItem('bf', '1');
        History.goBack();
      } else if (
        routeParams.get('isenjoy') &&
                routeParams.get('isenjoy') == 1
      ) {
        clearCache();
        sessionStorage.setItem('bf', '1');
        History.replace('/');
      } else if (
        routeParams.get('from') &&
                routeParams.get('from') == 'personal'
      ) {
        dropByCacheKey('/personal');
        History.goBack();
      }
    } catch (e) {
      console.info(e);
    }
  };

  const jumpPage = () => {
    data.workCode.includes('BB')
      ? toOffiaiclPage(data.workCode)
      : openMessage(data.workCode);
  };

  // const openMessage = (workCode:any) => {
  //   wx.invoke('openUserProfile',
  //   {
  // 		"type": 1, //1表示该userid是企业成员，2表示该userid是外部联系人
  // 		"userid": workCode //可以是企业成员，也可以是外部联系人
  //   },
  //   function(res:any) {
  //     console.info(res)
  //       if(res.err_msg != "openUserProfile:ok") {
  //           //错误处理
  //         console.info('错误')
  //       }else{
  //         console.info('成功')
  //       }
  //   });
  // }

  return (
    <div
      className="c-article"
      onCopy={(e) => {
        e.preventDefault();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {data.lockDescription !== '' ? (
        <div
          onClick={() => {
            goLockRelated();
          }}
          className="c-article-lockDescription"
        >
          <div>!</div>
          <div>{data.lockDescription}</div>
        </div>
      ) : null}
      <div
        className="c-article-title"
        style={{
          paddingRight: data.isOwner ? '32px' : '',
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: data.title }}></p>
        {data.isOwner ? (
          <div
            onClick={() => {
              handler.current = ActionSheet.show({
                actions,
                onClose: () => {
                  console.info(1111);
                },
              });
            }}
          >
            <ComponentSvgIcon type={'icon-more_vertical_fill'} />
          </div>
        ) : null}
      </div>
      <div
        className={
          !data.fullContent && data.picList
            ? 'c-article-info c-article-place'
            : 'c-article-info'
        }
      >
        {data.avatarUrl ? (
          <div className="imgWrap">
            <img
              src={data.avatarUrl}
              onClick={() => {
                jumpPage();
              }}
            />
            {data.workCode.includes('BB') ? (
              <SvgIcon type="icon-V_icon" className="vicon" />
            ) : null}
          </div>
        ) : (
          <SvgIcon type="icon-default_tx" className="avar" />
        )}
        <div className="c-article-info-namewrap">
          <div
            className="c-article-info-namewrap-name"
            onClick={() => {
              jumpPage();
            }}
          >
            {data.nickname}
          </div>
          <div>
            <span>{parseInt(currentVersion) === 2? `${timestampFormat(data.publishTime)}发布` : timestampFormat(data.publishTime)}</span>
            {DOMIconPoint}
            <span>
              {indicator && indicator.viewCount
                ? indicator.viewCount > 9999
                  ? `${Math.floor(
                    indicator.viewCount / 10000
                  )}万`
                  : indicator.viewCount
                : 0}
                            次浏览
            </span>
            {data.articleStatus === 99 ? (
              <Fragment>
                {DOMIconPoint}
                <span>置顶</span>
              </Fragment>
            ) : null}
          </div>
        </div>
      </div>
      {!data.fullContent && data.picList ? (
        <div className="c-article-place"></div>
      ) : null}

      {data.fullContent ? (
        <div className="c-article-detail">
          <div
            dangerouslySetInnerHTML={{
              __html: decryption(data.fullContent),
            }}
          />
        </div>
      ) : null}
      {data.picList && data.picList.length > 0 ? (
        <div className="c-article-img">
          {data.picList.map((url: string, index: number) => {
            let errorCount = 0;

            return (
              <img
                src={encodeURI(getImgUrl(url))}
                onError={(e) => {
                  errorCount++;
                  if (e.currentTarget.src != encodeURI(url)) {
                    e.currentTarget.src = encodeURI(url);
                  }else{
                    if(errorCount >= 3){
                      e.currentTarget.onerror = null;
                    }
                  }
                }}
                key={index}
                onClick={() => {
                  {
                    IsPc()
                      ? ImageViewer.Multi.show({
                        defaultIndex: index,
                        images: data.picList,
                      })
                      : wx.previewImage({
                        current: url, // 当前显示图片的http链接
                        urls: data.picList, // 需要预览的图片http链接列表
                      });
                  }
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export { Article };
export default Article;
