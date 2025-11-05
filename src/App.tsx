import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import RouteConfig from "@/routes";
import { USERAPI, WXSIGNATUREAPI } from "@/api";
import { Store } from "@/store";
import { PIC_PC } from "@/assets/image.ts";
import { Toast } from "antd-mobile";
import "./app.less";
import { IsPc } from "@/mixin";
import {
    ComponentConvention,
    ComponentPhotoViewer,
    ComponentPermission,
} from "./components";
import { useDidMount } from "hooooks";

import { writeList, atPersonal } from "@/mixin/app.ts";
import classnames from "classnames";
// import VConsole from 'vconsole';
import "./app-pc.less";
import { useHistory } from "react-router-dom";
const App: React.FC = () => {
    const History = useHistory();
    const [conventionVisible, setConventionVisible] = useState(null);
    const [browseable, setBrowseable] = useState(null);
    const [isIntern, setIsIntern] = useState(false); // 实习生(B)权限
    const [pcState, setPCState] = useState(false);
    const { state, dispatch } = useContext(Store);
    const [perViewState, setPerViewState] = useState(0);

    const wx = (window as any).wx;
    const WxData = {
        url: window.location.href.split("#")[0],
    };
    //移动端和pc uat和详情可查看
    const perView = !IsPc() || (IsPc() && writeList);
    const pcStyle = IsPc() && writeList;

    useEffect(() => {
        // if (perView) {
        getBasicData();
        captureScreen();
        // }
    }, []);

    // function getCookie(name: string) {
    //   const strcookie = document?.cookie;//获取cookie字符串
    //   const arrcookie = strcookie.split('; ');//分割
    //   //遍历匹配
    //   for (let i = 0; i < arrcookie.length; i++) {
    //     const arr = arrcookie[i].split('=');
    //     if (arr[0] == name) {
    //       return arr[1];
    //     }
    //   }
    //   return '';
    // }

    useDidMount(() => {
        //at人员查看人员信息
        atPersonal();
        // if (getCookie('username') === 'congxin' || getCookie('username') === 'chongming') {
        //   const v = new VConsole();
        // }
    });

    // const addWXSDK = () => {
    //     /**
    //      * @description: 加载WX-SDK
    //      * @return {*}
    //      */      
    //     // const spaScript = document.createElement('script');
    //     // spaScript.setAttribute('type', 'text/javascript');
    //     // spaScript.setAttribute('src', '//res.wx.qq.com/open/js/jweixin-1.2.0.js');
    //     // spaScript.setAttribute('onload', )
    //     var head = document.getElementsByTagName("head")[0] as any;
    //     var script = document.createElement("script") as any;
    //     script.type = "text/javascript";
    //     script.charset = "GBK";
    //     script.onload = script.onreadystatechange = function () {
    //         if (
    //             !this.readyState ||
    //             this.readyState === "loaded" ||
    //             this.readyState === "complete"
    //         ) {
    //             // 鉴权
    //             captureScreen();
    //             script.onload = script.onreadystatechange = null;
    //         }
    //     };
    //     script.src = "//res.wx.qq.com/open/js/jweixin-1.2.0.js";
    //     head.appendChild(script);
    // };

    const captureScreen = async () => {
        /**
         * @description: 接口 - 获取企业微信初始化字段
         * @param {*}
         * @return {*}
         */
        try {
            const res: any = await WXSIGNATUREAPI._getWxSignature(WxData);
            if (res) {
                dispatch({
                    value: {
                        wxInfo: res,
                    },
                });
                wx.config({
                    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.appId, // 必填，企业微信的corpID
                    timestamp: res.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.nonceStr, // 必填，生成签名的随机串
                    signature: res.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                    jsApiList: [
                        "onUserCaptureScreen",
                        "previewImage",
                        "chooseImage",
                        "onMenuShareAppMessage",
                        "openUserProfile",
                        "showMenuItems",
                        "hideAllNonBaseMenuItem",
                    ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
                });
                // wx.agentConfig({
                //   corpid: 'wx0833ac9926284fa5', // 必填，企业微信的corpid，必须与当前登录的企业一致
                //   agentid: 1000293, // 必填，企业微信的应用id （e.g. 1000247）
                //   timestamp: res.planetTimestamp, // 必填，生成签名的时间戳
                //   nonceStr: res.planetNonceStr, // 必填，生成签名的随机串
                //   signature: res.planetSignature,// 必填，签名，见附录-JS-SDK使用权限签名算法
                //   jsApiList: ['onUserCaptureScreen', 'previewImage', 'chooseImage', 'onMenuShareAppMessage', 'openUserProfile'], //必填，传入需要使用的接口名称
                //   success: function (res: any) {
                //     console.info('agentConfig调用成功', res);
                //   },
                //   fail: function (err: any) {
                //     console.info('agentConfig调用失败', err);
                //     if (err.errMsg.indexOf('function not exist') > -1) {
                //       console.info('版本过低请升级');
                //     }
                //   }
                // });
                wx.onUserCaptureScreen &&
                    wx.onUserCaptureScreen(function () {
                        Toast.show({
                            content:
                                "禁止对外使用、复制、传播未经授权的内部信息哦～严格遵守同事吧公约，维护同事吧环境，从你我做起!",
                            duration: 3000,
                        });
                    });
                wx.ready(() => {
                    wx.hideAllNonBaseMenuItem();

                    wx.showMenuItems({
                        menuList: [
                            "menuItem:setFont",
                            "menuItem:refresh",
                            "menuItem:share:appMessage",
                            "menuItem:favorite",
                            "menuItem:copyUrl",
                        ], // 要显示的菜单项
                    });
                });

                wx.error(function (res: any) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    console.info(res);
                });
            }
        } catch (error) {
            console.info(error);
        }
    };

    const getBasicData = async () => {
        /**
         * @description: 接口 - 获取用户基本信息
         * @param {*}
         * @return {*}
         */
        try {
            const res: any = await USERAPI._getUserInfo();
            // 查看公约状态 1表示未阅读,弹框可见，2表示已阅读，弹框不可见
            sessionStorage.setItem(
                "app_version",
                IsPc() ? 1 : res.currentVersion
            );

            //当前版本埋点
            (window as any)?._sendTrack?.({ ng: res.currentVersion }, true);

            if (res.pcGrayType && parseInt(res.pcGrayType) > 1 && IsPc()) {
                if (
                    location.host == "uat-bbplanet.bilibili.co" ||
                    location.host == "local.bilibili.co:3000"
                ) {
                    window.location.replace(
                        `//uat-bbplanet.bilibili.co/pc/${location.hash}`
                    );
                } else {
                    if (location.hash.split("?")[0] == "#/messageConfig") {
                        //跳转到消息中心
                        window.location.replace(
                            `//bbplanet.bilibili.co/pc/#/message?${
                                location.hash.split("?")[1]
                            }&mc=1`
                        );
                    } else {
                        window.location.replace(
                            `//bbplanet.bilibili.co/pc/${location.hash}`
                        );
                    }
                }
            } else {
                if (IsPc()) {
                    if (!res?.pcGrayType || parseInt(res.pcGrayType) <= 1) {
                        //不是灰度用户
                        perView ? setPerViewState(1) : setPerViewState(2);
                    }
                } else {
                    setPerViewState(1);
                }

                setPCState(true);
            }
            res.isReadConvention
                ? setConventionVisible(2)
                : setConventionVisible(1);
            // 是否有权限浏览
            res.browse == 1 ? setBrowseable(1) : setBrowseable(0);
            res.userGroup == "B" ? setIsIntern(true) : setIsIntern(false);
            dispatch({
                value: {
                    userInfo: res,
                },
            });
        } catch (e) {
            console.info(e);
        }
    };

    const PCDialog = () => {
        /**
         * @description: DOM - PC端提示页面
         * @param {*}
         * @return {*}
         */
        return (
            <div className="PC-page">
                <div>
                    <img src={PIC_PC} />
                    <span>电脑端页面即将上线，敬请期待</span>
                    <br />
                    <span>请先使用手机浏览</span>
                </div>
            </div>
        );
    };

    return (
        <div className={classnames("lego", pcStyle && "pc-content")}>
            {perViewState === 0 ? null : perViewState === 1 ? (
                browseable == null ? (
                    <></>
                ) : browseable == 0 ? (
                    <ComponentPermission isVisible={isIntern} />
                ) : pcState ? (
                    (
                        {
                            1: (
                                <ComponentConvention
                                    actionText="我已阅读，确认遵守"
                                    dialogVisible={conventionVisible}
                                    maskClick={false}
                                    onAction={(number: number) => {
                                        setConventionVisible(number);
                                    }}
                                />
                            ),
                            2: <RouteConfig />,
                            null: <></>,
                        } as any
                    )[conventionVisible]
                ) : null
            ) : (
                <PCDialog />
            )}
            <ComponentPhotoViewer />
        </div>
    );
};

export default App;
