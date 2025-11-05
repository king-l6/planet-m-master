/*
 * @Author: Yixeu
 * @Date: 2021-11-01 14:44:27
 * @LastEditors: Yixeu
 * @LastEditTime: 2022-03-22 20:26:48
 * @Description: 组件-名片
 */
import React, { FC, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { ComponentSvgIcon } from '../';
import SvgIcon from '@/components/svgicon';
import { Store } from '@/store';
import { PERSONALAPI } from '@/api';
import './index.less';

interface IProps {
  nickName: string;
  workCode: string;
  avatarUrl: string;
  msgToast: boolean;
  changePersonShowPopUp: (value: boolean) => void;
}
const Carte: FC<IProps> = ({
  nickName,
  workCode,
  avatarUrl,
  msgToast,
  changePersonShowPopUp,
}) => {
  const wx = (window as any).wx;
  const History = useHistory();
  const { state, dispatch } = useContext(Store);
  const [msgState, setMsgState] = useState(msgToast);

  const currentVersion = sessionStorage.getItem('app_version');

  const handleValue = () => {
    changePersonShowPopUp(true);
  };

  useEffect(() => {
    setMsgState(msgToast);
  });

  const jumpPage = (e: any) => {
    History.push(`/official?workCode=${e}`);
  };

  const changeVersion = async () => {
    try {
      const res = await PERSONALAPI._postVersion({
        currentVersion: parseInt(currentVersion) === 2 ? 1 : 2,
      });
      sessionStorage.setItem('app_version', parseInt(currentVersion) === 2 ? '1' : '2');
      History.replace('/');

      //切换版本埋点
      (window as any)?._sendTrack?.({ nh: parseInt(currentVersion) === 2 ? 21 : 12},true);
    } catch (e) {
      console.info(e);
    }
  };

  return (
    <div
      className="c-carte"
      onCopy={(e) => {
        e.preventDefault();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="c-carte-container">
        <div className="c-carte-info">
          {avatarUrl ? (
            <div className="c-carte-info-imgwrap">
              <img
                src={avatarUrl}
                onClick={() => {
                  state.userInfo.workCode.includes('BB')
                    ? jumpPage(state.userInfo.workCode)
                    : null;
                }}
              />{' '}
              {state.userInfo.currentOfficial ? (
                <SvgIcon type="icon-V_icon" className="cert" />
              ) : null}
            </div>
          ) : (
            <SvgIcon type="icon-default_tx" className="avar" />
          )}
          <div>
            <div
              className="c-carte-info-name"
              onClick={() => {
                handleValue();
              }}
            >
              <div>{nickName}</div>
              {state.userInfo.identityList?.length > 1 ? (
                <SvgIcon
                  type="icon-arrow_down_line"
                  className="avatar"
                />
              ) : null}
            </div>
            <div className="c-carte-info-number">
              星球编号：{workCode}
            </div>
          </div>
        </div>
        {parseInt(currentVersion) === 2 ? null : (
          <div
            className="c-carte-message"
            onClick={() => {
              const { userInfo } = state;
              userInfo.msgNum = 0;
              dispatch({
                value: {
                  ...state,
                  userInfo,
                },
              });
              setMsgState(false);
              History.push('/message');
            }}
            style={{
              right:
                                state?.userInfo?.grayType == 2
                                  ? '96px'
                                  : '36px',
            }}
          >
            <ComponentSvgIcon type={'icon-envelope_message_line'} />
            {msgState ? (
              <div className="c-carte-message-toast"></div>
            ) : null}
          </div>
        )}
        {state?.userInfo?.grayType == 2 ? (
          <div className="c-carte-version" onClick={changeVersion}>
            {parseInt(currentVersion) === 2 ? '切旧版' : '切新版'}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { Carte };
export default Carte;
