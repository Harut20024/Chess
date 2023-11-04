// King class definition
class King {
  constructor(x, y, size, color, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.img = img;
  }

  display() {
    if (this.img) {
      image(this.img, this.x, this.y, this.size, this.size);
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  isClicked(mx, my) {
    return mx >= this.x && mx < this.x + this.size &&
           my >= this.y && my < this.y + this.size;
  }
}
