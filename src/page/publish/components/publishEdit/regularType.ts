interface IStates {
  closeBeginLabel: string,
  closedTailLabel: string,
  notCloseBeginLabel: string,
  notCloseTailLabel: string,
  wordAllRegs: string,
  wordRegs: string,
  characters: string
}

/* eslint-disable */
const labelRegs = {
  closeBeginLabel: /&lt;([^&]*)&gt;/ig,  // <>
  closedTailLabel: /\&lt;&#47;([^&]*)\&gt;/ig, // </>
  notCloseBeginLabel: /\&lt;([^&]*)/ig, // <
  notCloseTailLabel: /\&lt;&#47;([^&]*)/ig // </
};

const commonRegs = {
  wordAllRegs: /^[a-zA-Z]+$/,
  wordRegs: /[a-zA-Z]/,
  characters: /^[\u4e00-\u9fa5]+$/,
  gt: /\&gt;/,
  lt: /\&lt;/,
  speo: /\&#47;/
}

export {
  labelRegs,
  commonRegs
};