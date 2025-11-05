import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Switch, Popup } from 'antd-mobile';
import { MESSAGECOUNTAPI } from '@/api';
import SvgIcon from '@/components/svgicon';

import './index.less';
import { useDidMount } from 'hooooks';
import { useHistory } from 'react-router-dom';


const Notify = () => {
  const History = useHistory();
  const routeParams = new URLSearchParams(History.location.search) as any;
  const _sendTracknc = routeParams.get('nc');
  const pushTime = routeParams.get('t');
  const pushType = routeParams.get('pt');

  const [atNotify, setAtNotify] = useState(0);
  const [commentNotify, setCommentNotify] = useState(0);
  const [favorNotify, setFavorNotify] = useState(0); // 收藏
  const [likeNotify, setLikeNotify] = useState(0); // 点赞
  const [pushNum, setPushNum] = useState(null);

  const [configTxt, setConfigTxt] = useState(null);
  const [visible, setVisible] = useState(_sendTracknc == 2?false:true);

  const RefAite = useRef(null);
  const RefReply = useRef(null);
  const RefFavor = useRef(null);
  const RefLike = useRef(null);
  const RefNotify = useRef(null);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchMoveX, setTouchMoveX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchMoveY, setTouchMoveY] = useState(null);

  let flag: any = null;

  useEffect(() => {
    getConfig();
  }, []);

  useDidMount(() => {
    try {
      if (_sendTracknc) {
        (window as any)?._sendTrack?.({ nc: parseInt(_sendTracknc ? _sendTracknc : 0) }, true);
      }
      if(pushTime && pushType){
        if(routeParams.get('nc') == 1){
          //表示从推送进入消息设置
          (window as any)?._sendTrack?.(
            {
              nj: 3 ,
              sh:pushTime,
              ni: parseInt(pushType)
            },
            true
          );
        }
      }
    } catch (error) {
      console.info(error);
    }
  });
  useEffect(() => {
    setConfigTxt(configtext.find(value => {
      return value.notify == pushNum;
    })?.text);
  }, [pushNum]);

  const getConfig = async () => {
    /**
     * @description: 获取消息设置状态
     * @param {*}
     * @return {*}
     */
    try {
      const res: any = await MESSAGECOUNTAPI._getConfig();
      if (res) {
        res.atNotify == 0 ? setAtNotify(1) : setAtNotify(2);
        res.commentNotify == 0 ? setCommentNotify(1) : setCommentNotify(2);
        res.favNotify == 0 ? setFavorNotify(1) : setFavorNotify(2);
        res.likeNotify == 0 ? setLikeNotify(1) : setLikeNotify(2);
        res.notifyStrategy == 0 ? setPushNum(0) : setPushNum(res.notifyStrategy);
      }
    } catch (error) {
      console.info(error);
    }
  };
  const changeConfig = async (state: any) => {
    /**
     * @description: 接口 - 修改消息设置: at:艾特 comment:评论 like-点赞 fav-收藏 strategy-推送
     * @param {*}
     * @return {*}
     */
    try {
      let data;
      if (flag === 1) {
        data = {
          atNotify: state ? 1 : 0,
          commentNotify: commentNotify === 2 ? 1 : 0,
          favNotify: favorNotify === 2 ? 1 : 0,
          likeNotify: likeNotify === 2 ? 1 : 0,
          notifyStrategy: pushNum
        };
      } else if (flag === 2) {
        data = {
          atNotify: atNotify === 2 ? 1 : 0,
          commentNotify: state ? 1 : 0,
          favNotify: favorNotify === 2 ? 1 : 0,
          likeNotify: likeNotify === 2 ? 1 : 0,
          notifyStrategy: pushNum
        };
      } else if (flag === 3) {
        data = {
          atNotify: atNotify === 2 ? 1 : 0,
          commentNotify: commentNotify === 2 ? 1 : 0,
          favNotify: favorNotify === 2 ? 1 : 0,
          likeNotify: state ? 1 : 0,
          notifyStrategy: pushNum
        };
      } else if (flag === 4) {
        data = {
          atNotify: atNotify === 2 ? 1 : 0,
          commentNotify: commentNotify === 2 ? 1 : 0,
          favNotify: state ? 1 : 0,
          likeNotify: likeNotify === 2 ? 1 : 0,
          notifyStrategy: pushNum
        };
      } else if (flag === 5) {
        data = {
          atNotify: atNotify === 2 ? 1 : 0,
          commentNotify: commentNotify === 2 ? 1 : 0,
          favNotify: favorNotify === 2 ? 1 : 0,
          likeNotify: likeNotify === 2 ? 1 : 0,
          notifyStrategy: state.notify
        };
      }
      const res: any = await MESSAGECOUNTAPI._changeConfig(data);
    } catch (error) {
      console.info(error);
    }
  };
  const changeAite = (e: any) => {
    /**
     * @description: 修改@我的消息状态
     * @param {*}
     * @return {*}
     */
    flag = 1;
    atNotify === 2 ? setAtNotify(1) : setAtNotify(2);
    if (RefAite.current) {
      clearTimeout(RefAite.current);
    }
    RefAite.current = setTimeout(() => {
      changeConfig(e);
    }, 800);
  };
  const changeComment = (e: any) => {
    /**
     * @description: 接口 - 修改评论回复设置
     * @param {*}
     * @return {*}
     */
    flag = 2;
    commentNotify === 2 ? setCommentNotify(1) : setCommentNotify(2);

    if (RefReply.current) {
      clearTimeout(RefReply.current);
    }
    RefReply.current = setTimeout(() => {
      changeConfig(e);
    }, 800);
  };

  const changeLike = (e: any) => {
    /**
     * @description: 接口 - 修改点赞消息设置
     * @param {*}
     * @return {*}
     */
    flag = 3;
    likeNotify === 2 ? setLikeNotify(1) : setLikeNotify(2);

    if (RefLike.current) {
      clearTimeout(RefLike.current);
    }
    RefLike.current = setTimeout(() => {
      changeConfig(e);
    }, 800);
  };

  const changeFav = (e: any) => {
    /**
     * @description: 接口 - 修改收藏消息设置
     * @param {*}
     * @return {*}
     */
    flag = 4;
    favorNotify === 2 ? setFavorNotify(1) : setFavorNotify(2);

    if (RefFavor.current) {
      clearTimeout(RefFavor.current);
    }
    RefFavor.current = setTimeout(() => {
      changeConfig(e);
    }, 800);
  };

  const changePushFrequency = (e: any) => {
    /**
     * @description: 接口 - 更新推送频次
     * @param {*}
     * @return {*}
     */
    flag = 5;
    setConfigTxt(e.text);
    setPushNum(e.notify);
    if (RefNotify.current) {
      clearTimeout(RefNotify.current);
    }
    RefNotify.current = setTimeout(() => {
      changeConfig(e);
      setVisible(false);
    }, 0);
  };

  const cardConfig = [
    {
      title: '@我的消息',
      message: '打开开关，消息会同步到企微',
      type: 'switch',
      notify: atNotify,
      onchange: changeAite
    },
    {
      title: '评论与回复',
      message: '打开开关，消息会同步到企微',
      type: 'switch',
      notify: commentNotify,
      onchange: changeComment
    },
    {
      title: '点赞消息',
      message: '打开开关，消息会同步到企微',
      type: 'switch',
      notify: likeNotify,
      onchange: changeLike
    },
    {
      title: '收藏消息',
      message: '打开开关，消息会同步到企微',
      type: 'switch',
      notify: favorNotify,
      onchange: changeFav
    },
    {
      title: '更新推送频次',
      message: '更新内容会定时推送到企微',
      type: 'popup',
    }
  ];

  const configtext = [
    {
      text: '每条新帖',
      notify: 1
    },
    {
      text: '每天两次',
      notify: 0
    },
    {
      text: '每天一次',
      notify: 2
    },
    {
      text: '每周一次',
      notify: 3
    },
    {
      text: '暂不提醒',
      notify: 4
    }
  ];

  const handleTouchStart = (e: any) => {
    e.preventDefault();
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: any) => {
    e.preventDefault();
    setTouchMoveX(e.touches[0].clientX);
    setTouchMoveY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: any) => {
    /**
     * @description:
     *  1.手势下滑距离超过某个值
     *  2.当滚动条处于顶部
     *  3.横向滑动距离不超过某个值
     * @param {*}
     * @return {*}
     */
    const contentScroll = document.getElementsByClassName('popupwrap')[0].scrollTop;
    if (touchMoveY - touchStartY > 0 && contentScroll == 0 && Math.abs(touchMoveX - touchStartX) < 40) {
      setVisible(false);
    }
  };

  const popupNotify = () => {
    return (
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{ height: '364px' }}
      >
        <div className='popupwrap'
          onTouchMove={(e) => { handleTouchMove(e); }}
          onTouchStart={(e) => { handleTouchStart(e); }}
          onTouchEnd={(e) => { handleTouchEnd(e); }}>
          {
            configtext.map((item, index) => {
              return (
                <div className={item.text == configTxt ? 'select' : ''} key={index} onClick={() => { changePushFrequency(item); }}>{item.text}</div>
              );
            })
          }
          <div onClick={() => { setVisible(false); }}>取消</div>
        </div>
      </Popup>
    );
  };

  const renderDOM = (card: any) => {
    if (card.type == 'switch') {
      return card.notify !== 0 ? 
        <>
          <div>
            <span>{card.title}</span>
            <span>{card.message}</span>
          </div>
          <div className='configmessage-page-card-switch'>
            <Switch
              style={{ '--checked-color': '#00AEEC' }}
              checked={card.notify === 2 ? true : false}
              onChange={(e) => { card.onchange(e); }}
            />
          </div>
        </> : null;
    } else if (card.type == 'popup') {
      return configTxt ? 
        <>
          <div>
            <span>{card.title}</span>
            <span>{card.message}</span>
          </div>
          <div className='configmessage-page-card-confignum'>
            {configTxt}
            <SvgIcon type="icon-arrow_into_right_line" className='iconService' />
          </div>
        </>
        : null;
    }
  };
  return (
    <div className="configmessage-page">
      {
        cardConfig.map((card, index) => {
          return (
            <div className="configmessage-page-card" key={index} onClick={() => { card.type == 'popup' ? setVisible(true) : null; }}>
              {
                renderDOM(card)
              }
            </div>
          );
        })
      }
      {popupNotify()}
    </div>
  );
};
export { Notify };
export default Notify;