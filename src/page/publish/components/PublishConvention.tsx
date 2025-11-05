import { Dialog } from 'antd-mobile';
import React, { FC, useEffect, useState } from 'react';

interface planetConventionProps {
  actionText?: string,
  dialogVisible?: any,
  maskClick?: boolean,
  getDialogState?: (dialogState: any) => void,
  onAction?: () => void,
  transAction?: any
}
const ComponentConvention: FC<planetConventionProps> = ({ actionText, dialogVisible, maskClick, getDialogState, onAction, transAction }) => {
  const [visibleCode, setVisibleCode] = useState(dialogVisible);

  useEffect(() => {
    setVisibleCode(dialogVisible);
  }, [dialogVisible]);

  return (
    <div className="publish-convention" onCopy={(e) => { e.preventDefault(); }} onContextMenu={(e) => { e.preventDefault(); }}>
      <Dialog
        closeOnAction
        bodyClassName='planet-convention'
        visible={visibleCode == 1 ? true : false}
        closeOnMaskClick={maskClick}
        title="同事吧公约"
        content={
          <>
            <div>尊重他人是同事吧最基本的底线。请每一位同学发言时务必遵守公约，共建良好的交流氛围。</div>
            <div>禁止发布以下内容：</div>
            <div>1. 违反法规行为和内容，如传谣诽谤、侵犯隐私；</div>
            <div>2. 议论宗教、政治、民族、种族、性别、年龄、地域等内容的歧视性话题或引战行为；</div>
            <div>3. 使用不雅、色情词句，恶意人身攻击、骚扰、辱骂或其他不友善的行为；</div>
            <div>特别提醒所有伙伴：</div>
            <div>不鼓励以盈利为目的的内部交易以及内部福利买卖行为，请以严谨的态度推销产品、服务和发布买卖广告、征婚交友信息，并切实为自己的言行负责。也请其他同学提高鉴别能力，慎重判断行事。</div>
            <div>对于发布的禁止内容，公司将进行文字屏蔽处理，情节严重者将被禁言。欢迎大家互相监督，对各种不当行为进行劝诫和引导。
            让我们一起努力，维护B站人开放透明的内网，共建乐学温暖的精神家园！
            </div>
            <div></div>
          </>
        }
        onClose={() => {
          if (getDialogState) {
            getDialogState(2);
          }
          setVisibleCode(2);
        }}
        onAction={() => { if (onAction) { onAction(); } }}
        actions={[
          {
            key: 'confirm',
            text: actionText,
            style: {
              'color': '#ffffff',
              'fontFamily': 'PingFang SC',
              'fontStyle': 'normal',
              'fontWeight': 'normal',
              'fontSize': '14px',
              'height': '34px',
              'lineHeight': '34px',
              'textAlign': 'center',
            }
          },
        ]}
      />
    </div>
  );
};
export { ComponentConvention };
export default ComponentConvention;
