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

export { sliderState };

