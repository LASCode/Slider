export interface SliderState {
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

export type SliderStateModified = Partial<SliderState>
export type StateProperties = keyof SliderState

export interface ViewHandleState {
  px: number,
  percent: number,
  total: number,
  movingNow: boolean,
  pressedNow: boolean,
  pressedLast: boolean,
}
export interface ViewSliderState {
  max: number,
  min: number,
  horizontal: boolean,
  isRange: boolean,
  invert: boolean,
  tips: boolean,
  handleSplit: boolean,
  from: ViewHandleState,
  to: ViewHandleState,
  scaleItemsArray: number[],
  customClass: string,
  customId: string,
  tipsValueFunction: SliderState['tipsValueFunction'],
}

export interface PresenterTempData {
  handlePressedLast: string | null,
  handleSelected: string | null,
  handleMovingNow: string | null,
  handlePressedNow: string | null,
  handleValue: number,
}
