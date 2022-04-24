interface sliderState {
  max: number
  min: number
  step: number
  size: {height: number, width: number, offSetX: number, offSetY: number}
  from: {px: number, percent: number, total: number, isHold: boolean, isAbstractHold: boolean}
  to: {px: number, percent: number, total: number, isHold: boolean, isAbstractHold: boolean}
  isRange?: boolean
  horizontal?: boolean
  scaleStep: number
  scaleStepsArr: Array<number>
}

interface userOptions {
  max?: number,
  min?: number,
  from?: number,
  to?: number,
  step?: number,
  isRange?: boolean,
  horizontal?: boolean,
  scaleStep?: number,
  onChangeFunction?: Function,
  changeValueFunction?: Function;
}
interface SliderState {
  max: number,
  min: number,
  from: number,
  to: number,
  step: number,
  isRange: boolean,
  horizontal: boolean,
  scaleStep: number,
  onChangeFunction: Function,
  changeValueFunction: Function;
}
type SliderStateModified = Partial<SliderState>
type StateProperties = keyof SliderState
interface viewSliderState {
  max: number
  min: number
  horizontal: boolean
  isRange: boolean
  from: {px: number, percent: number, total: number, movingNow: boolean, pressedNow: boolean}
  to: {px: number, percent: number, total: number, movingNow: boolean, pressedNow: boolean}
  scaleItemsArray: number[]
}
interface viewTempData {
  handleSelected: string | null,
  handleMovingNow: string | null,
  handlePressedNow: string | null,
  handleValue: number,
}

export { SliderState, SliderStateModified, StateProperties, viewSliderState, viewTempData, userOptions };

