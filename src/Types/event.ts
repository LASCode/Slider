


interface resizeViewEvent {
  type: 'resizeViewEvent',
  data: {
    width: number,
    height: number,
    offSetX: number,
    offSetY: number,
  }
}
type viewEventType = subViewEvent | resizeViewEvent

interface viewEvent {
  target: string,
  type: string,
  event: string,
  value: {x: number, y: number}
}


interface handleEvent {
  target: 'handle',
  type: 'from' | 'to',
  event: 'click' | 'move' | 'drop',
  value: {x: number, y: number}
}
interface lineEvent {
  target: 'line',
  type: string,
  event: 'click' | 'move' | 'drop',
  value: {x: number, y: number}
}
interface scaleEvent {
  target: 'scale',
  type: string,
  event: 'click' | 'move' | 'drop',
  value: {x: number, y: number},
}
interface rangeEvent {
  target: 'range',
  type: string,
  event: 'click' | 'move' | 'drop',
  value: {x: number, y: number}
}
interface subViewEvent {
  type: 'subViewEvent',
  data: handleEvent | lineEvent | rangeEvent | scaleEvent
}

export { viewEvent, viewEventType, subViewEvent, handleEvent, lineEvent, rangeEvent, scaleEvent };
