
if (!global.DOMRect) {
  class DOMRect {
    bottom: number = 0;
    left: number = 0;
    right: number = 0;
    top: number = 0;
    x: number = 0;
    y: number= 0;
    width: number = 0;
    height: number = 0;
    constructor(x: number, y: number, width: number, height: number) {
      this.y = y;
      this.x = x;
      this.width = width;
      this.height = height;
      this.top = (y > 0 ? y : y + height);
      this.left = (x > 0 ? x : x + width);
      this.right = (x > 0 ? x + width : x);
      this.bottom = (y > 0 ? y + height : y);
    }
  }
  global.DOMRect = DOMRect as any;
}