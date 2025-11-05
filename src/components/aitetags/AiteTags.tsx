import React, { FC } from 'react';
import SvgIcon from '@/components/svgicon';
import './index.less';

interface aiteProps {
  aitetags: any,
  deleteAiteTags: (idx:number) => void
}
const AiteTags: FC<aiteProps> = ({ deleteAiteTags, aitetags }) => {

  const deleteTag = (idx: number) => {
    /**
     * @description: 删除@人，向父组件传递删除的id
     * @param {*}
     * @return {*}
     */
    deleteAiteTags(idx);
  };
  return (
    <div className="c-aiteTags">
      {aitetags.map((peopleTags: any, idx: number) => {
        return (
          <div key={`${peopleTags.nickName}idx`}>{`@${peopleTags.nickName}`}
            <SvgIcon type="icon-at_delete" onClick={deleteTag.bind(this, idx)} />
          </div>
        );
      })
      }
    </div>
  );
};
export { AiteTags };
export default AiteTags;
