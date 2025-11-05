import React from 'react';

interface IProps {
  onClick?: () => void
}

const InputPc = ({ onClick }: IProps) => {
  return (
    <div className="c-input-btn-publish" onMouseDown={onClick}>发布</div>
  );
};

export { InputPc };
export default InputPc;
