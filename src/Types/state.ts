interface SliderState {
  max: number,
  min: number,
  from: number,
  to: number,
  step: number,
  scaleStep: number,
  customId: string,
  customClass: string,
  tips: boolean,
  isRange: boolean,
  horizontal: boolean,
  invert: boolean,
  handleSplit: boolean,
  onChangeFunction: (state: SliderState) => void,
  tipsValueFunction: (value: number) => string;
}

type SliderStateModified = Partial<SliderState>
type StateProperties = keyof SliderState

interface viewHandleState {
  px: number,
  percent: number,
  total: number,
  movingNow: boolean,
  pressedNow: boolean,
  pressedLast: boolean,
}
interface viewSliderState {
  max: number,
  min: number,
  horizontal: boolean,
  isRange: boolean,
  invert: boolean,
  tips: boolean,
  handleSplit: boolean,
  from: viewHandleState,
  to: viewHandleState,
  scaleItemsArray: number[],
  customClass: string,
  customId: string,
  tipsValueFunction: SliderState['tipsValueFunction'],
}

interface presenterTempData {
  handlePressedLast: string | null,
  handleSelected: string | null,
  handleMovingNow: string | null,
  handlePressedNow: string | null,
  handleValue: number,
}

export {
  SliderState, SliderStateModified, StateProperties, viewSliderState, presenterTempData,
};
