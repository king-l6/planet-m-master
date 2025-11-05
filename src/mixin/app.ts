import { openMessage } from "@/mixin";
import { USERAPI } from "@/api";

const { location } = window;
// uat地址
const IsUatPage = location.hostname === "uat-bbplanet.bilibili.co";
//详情页
const isDetailPage =
    decodeURIComponent(location.hash).split("?")[0] === "#/detail" ||
    decodeURIComponent(location.hash).split("?")[0] === "#/" ||
    decodeURIComponent(location.hash).split("?")[0] === "" ||
    decodeURIComponent(location.hash).split("?")[0] === "#/messageConfig";

const writeList = isDetailPage;

const debounce = (fn: any, wait: any) => {
    let timer: any = null;
    const that = this;
    return function (...args: any) {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(that, args);
        }, wait);
    };
};

const handleClick = async (e: any) => {
    e.stopPropagation();
    // a标签被点击了
    try {
        if (e.target.tagName === "AT") {
            const workName = e.target.innerHTML.replace("@", "");
            const res: any = await USERAPI._getWorkCode(workName);
            res.official
                ? (window.location.href = `#/official?workCode=${res.workCode}`)
                : openMessage(res.workCode);
        }
    } catch (error) {
        console.info(error);
    }
};

const atPersonal = () => {
    document.addEventListener("click", debounce(handleClick, 500));
};
export { IsUatPage, isDetailPage, writeList, atPersonal };
