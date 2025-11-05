/*
 * @Author: Yixeu
 * @Date: 2021-11-01 17:24:00
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-22 20:28:19
 * @Description: 组件-卡片
 */
import React, { FC, useEffect, useState, useRef, useContext } from 'react';
import { ComponentOperate, ComponentSvgIcon } from '../';
import { timestampFormat } from '@/mixin';
import { ImageViewer } from 'antd-mobile';
import './index.less';
import { useHistory } from 'react-router';
import SvgIcon from '@/components/svgicon';
import { decryption } from '@/mixin';
import { IsPc } from '@/mixin/tools';
import { BROWSEAPI } from '@/api';
import { Store } from '@/store';

interface IProps {
  data: any;
  hideType?: boolean;
  orderType?: number;
  lunarH?: number;
  isHomePage?: boolean;
}
const windowPX = Math.round(window.devicePixelRatio);
const DOMIconPoint = <span className="c-card-icon-point">&#183;</span>;

const Card: FC<IProps> = ({
  data,
  hideType,
  orderType,
  lunarH,
  isHomePage,
}) => {
  const wx = (window as any).wx;
  const History = useHistory();
  const highLight = data.highLight ? data.highLight : null;
  const highLight_title =
    highLight && highLight.title ? highLight.title[0] : '';
  const highLight_content =
    highLight && highLight.simple_content
      ? highLight.simple_content[0]
      : '';

  const [isShowAnimate, setIsShowAnimate] = useState(true);

  const [isRead, setIsRead] = useState(data?.isRead === 1 ? true : false);
  const RefTime = useRef() as any;

  const currentVersion = sessionStorage.getItem('app_version');

  const { state } = useContext(Store);

  const toPage = () => {
    /**
     * @description: 跳转文章页面
     * @param {*}
     * @return {*}
     */
    const { pathname } = History.location;
    History.push(
      `/detail?tId=${data.businessId}&skeleton=${data.commentCount === 1 ? 1 : data.commentCount ? 5 : 0
      }${lunarH || lunarH == 0 ? `&h=${lunarH}` : ''}&from=${pathname == '/'
        ? orderType == 1
          ? 'homeCommand'
          : 'homeNew'
        : 'personal'
      }`
    );
  };

  const getImgUrl = (baseUrl: string) => {
    if (baseUrl.indexOf('?') != -1) {
      return `${baseUrl.substr(0, baseUrl.indexOf('?'))}@${windowPX * 98}w_${windowPX * 98}h_1e_1c.png${baseUrl.substr(
        baseUrl.indexOf('?'),
        baseUrl.length
      )}`;
    } else {
      return `${baseUrl}@${windowPX * 98}w_${windowPX * 98}h_1e_1c.png`;
    }
  };

  const browseNumber = async (data: any) => {
    /**
     * @description: 接口 - 列表中帖子加载次数
     * @param {*}
     * @return {*}
     */
    try {
      const res = await BROWSEAPI._getBrowseArticle(data);
    } catch (error) {
      console.info(error);
    }
  };

  const browsePicture = (
    e: any,
    url: string,
    index: number,
    businessId: string
  ) => {
    /**
     * @description: 图片预览，浏览数量
     * @param {*}
     * @return {*}
     */
    e.stopPropagation();

    IsPc()
      ? ImageViewer.Multi.show({
        defaultIndex: index,
        images: data.picList,
      })
      : wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: data.picList, // 需要预览的图片http链接列表
      });
    //点击图片新增一次浏览
    browseNumber({ businessIdList: [businessId] });
    (window as any)?._sendTrack?.({ sd: businessId }, true);
  };
  useEffect(() => {
    RefTime.current = setTimeout(() => {
      setIsShowAnimate(false);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (RefTime.current) {
        clearTimeout(RefTime.current);
      }
    };
  }, []);

  return (
    <>
      {parseInt(currentVersion) === 2 ? (
        <div
          onClick={(e: any) => {
            setIsRead(true);
            //过滤链接和@人员
            !e.target.href && e.target.tagName !== 'AT' && toPage();
          }}
          onCopy={(e) => {
            e.preventDefault();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          className={isShowAnimate ? 'c-card-v2 fadeIn' : 'c-card-v2'}
        >
          {state.alreadyReadList.includes(
            data.businessId
          ) ? null : !isRead && isHomePage ? (
              <span className="c-card-v2-isRead"></span>
            ) : null}

          <div>
            <div>
              <div className="c-card-v2-title">
                {!hideType && data.articleStatus === 99 ? (
                  <span>置顶</span>
                ) : !hideType && data.articleStatus === 3 ? (
                  <span className="c-card-v2-title-lock">
                    锁定
                  </span>
                ) : null}
                <div
                  dangerouslySetInnerHTML={{
                    __html: highLight_title
                      ? highLight_title
                      : data.title,
                  }}
                ></div>
              </div>
              {data.simpleContent ? (
                <div className="c-card-v2-detail">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: decryption(
                        highLight_content
                          ? highLight_content
                          : data.simpleContent
                      ),
                    }}
                  />
                </div>
              ) : null}
            </div>

            {data.picList && data.picList.length > 0 ? (
              <div className="c-card-v2-img">
                {data.picList.map(
                  (url: string, index: number) => {
                    let errorCount = 0;
                    return index < 1 ? (
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
                        onClick={(e) => {
                          browsePicture(
                            e,
                            url,
                            index,
                            data.businessId
                          );
                        }}
                      />
                    ) : null;
                  }
                )}
                {data.picList.length > 1 ? (
                  <div className="c-card-v2-img-number">
                    <span>+</span>
                    {data.picList.length - 1}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            <span>{data.nickname}</span>
            <span>
              <span>
                <ComponentSvgIcon
                  type={'icon-ic_eye_browse_line'}
                />
                <span>
                  {data.viewCount
                    ? data.viewCount > 9999
                      ? `${Math.floor(
                        data.viewCount / 10000
                      )}万`
                      : data.viewCount
                    : 0}
                </span>
              </span>

              <span>
                <ComponentSvgIcon
                  type={'icon-list_comment_line'}
                />
                <span>
                  {data.commentCount
                    ? data.commentCount > 9999
                      ? `${Math.floor(
                        data.commentCount / 10000
                      )}万`
                      : data.commentCount
                    : 0}
                </span>
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div
          className={isShowAnimate ? 'c-card fadeIn' : 'c-card'}
          onClick={(e: any) => {
            //过滤链接和@人员
            !e.target.href && e.target.tagName !== 'AT' && toPage();
          }}
          onCopy={(e) => {
            e.preventDefault();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <div className="c-card-title">
            {!hideType && data.articleStatus === 99 ? (
              <span>置顶</span>
            ) : !hideType && data.articleStatus === 3 ? (
              <span className="c-card-title-lock">锁定</span>
            ) : null}
            <div
              dangerouslySetInnerHTML={{
                __html: highLight_title
                  ? highLight_title
                  : data.title,
              }}
            ></div>
          </div>
          <div className="c-card-info">
            {data.avatarUrl ? (
              <div>
                <img src={data.avatarUrl} />
                {data.workCode.includes('BB') ? (
                  <SvgIcon
                    type="icon-V_icon"
                    className="vicon"
                  />
                ) : null}
              </div>
            ) : (
              <SvgIcon type="icon-default_tx" className="avar" />
            )}
            <span>{data.nickname}</span>
            {DOMIconPoint}
            <span>
              {timestampFormat(data.latestReplyTime)} 更新
            </span>
            {DOMIconPoint}
            <span>
              {data.viewCount > 9999
                ? `${Math.floor(data.viewCount / 10000)}万`
                : data.viewCount}
              次浏览
            </span>
          </div>
          {data.simpleContent ? (
            <div className="c-card-detail">
              <div
                dangerouslySetInnerHTML={{
                  __html: decryption(
                    highLight_content
                      ? highLight_content
                      : data.simpleContent
                  ),
                }}
              />
            </div>
          ) : null}
          {data.picList && data.picList.length > 0 ? (
            <div className="c-card-img">
              {data.picList.map((url: string, index: number) => {
                let errorCount = 0;

                return index < 3 ? (
                  <img
                    src={ encodeURI(getImgUrl(url)) }
                    onError={(e) => {
                      errorCount++;
                      if (e.currentTarget.src != encodeURI(url)) {
                        e.currentTarget.src = encodeURI(url) ;
                      }else{
                        if(errorCount >= 3 ){
                          e.currentTarget.onerror = null;
                        }
                      }
                      
                    }}
                    key={index}
                    onClick={(e) => {
                      browsePicture(
                        e,
                        url,
                        index,
                        data.businessId
                      );
                    }}
                  />
                ) : null;
              })}
              {data.picList.length > 3 ? (
                <div className="c-card-img-number">
                  <span>+</span>
                  {data.picList.length - 3}
                </div>
              ) : null}
            </div>
          ) : null}
          <ComponentOperate
            disable={data.articleStatus === 3 ? true : false}
            isOwner={data.isOwner}
            isFav={data.isFav}
            isLike={data.isLike}
            likeCount={data.likeCount}
            commentCount={data.commentCount}
            favoriteCount={data.favoriteCount}
            businessId={data.businessId}
            businessType={1}
            parentCommentCount={data.parentCommentCount}
            pathname={History.location.pathname}
            orderType={orderType}
            lunarH={lunarH}
          />
        </div>
      )}
    </>
  );
};

export { Card };
export default Card;
