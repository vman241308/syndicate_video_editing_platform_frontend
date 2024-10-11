export default class Color {
  red = 0;
  green = 0;
  blue = 0;
  alpha = 0;

  constructor(
    red: number | string | undefined = 0,
    green: number | undefined = 0,
    blue: number | undefined = 0,
    alpha: number | undefined = 255
  ) {
    if (typeof red === 'string') {
      let colors = [0, 0, 0, 0];
      if (red.startsWith('&H')) {
        colors = Color.fromAssColor(red);
      } else {
        colors = Color.fromWebColor(red);
      }
      this.red = colors[0];
      this.green = colors[1];
      this.blue = colors[2];
      this.alpha = colors[3];
    } else if (red !== undefined) {
      this.red = red || 0;
      this.green = green || 0;
      this.blue = blue || 0;
      this.alpha = alpha || 0;
    }
  }

  private to2DigitsHex(num: Number) {
    const hex = num.toString(16).toUpperCase();
    if (hex.length === 1) return '0' + hex;
    return hex;
  }

  public toWebColor(): string {
    return (
      '#' +
      this.to2DigitsHex(this.red) +
      this.to2DigitsHex(this.green) +
      this.to2DigitsHex(this.blue) +
      this.to2DigitsHex(this.alpha)
    );
  }

  public toAssColor(): string {
    return (
      '&H' +
      this.to2DigitsHex(255 - this.alpha) +
      this.to2DigitsHex(this.blue) +
      this.to2DigitsHex(this.green) +
      this.to2DigitsHex(this.red)
    );
  }

  private static readableColor(color: string): string {
    if (color === 'white') return '#fff';
    return color;
  }

  public static fromAssColor(color: string): Array<number> {
    if (!color) return [0, 0, 0, 0];
    if (!color.startsWith('&H') || color.length < 3) {
      throw new Error('Color is not suppored format');
    }
    if (color.length === 3) {
      return [parseInt(`${color[2]}}`, 16), 0, 0, 255];
    } else if (color.length === 4) {
      return [parseInt(`${color[2]}${color[3]}`, 16), 0, 0, 255];
    } else if (color.length === 5) {
      return [
        parseInt(`${color[3]}${color[4]}`, 16),
        parseInt(`${color[2]}`, 16),
        0,
        255,
      ];
    } else if (color.length === 6) {
      return [
        parseInt(`${color[4]}${color[5]}`, 16),
        parseInt(`${color[2]}${color[3]}`, 16),
        0,
        255,
      ];
    } else if (color.length === 7) {
      return [
        parseInt(`${color[5]}${color[6]}`, 16),
        parseInt(`${color[3]}${color[4]}`, 16),
        parseInt(`${color[2]}`, 16),
        255,
      ];
    } else if (color.length === 8) {
      return [
        parseInt(`${color[6]}${color[7]}`, 16),
        parseInt(`${color[4]}${color[5]}`, 16),
        parseInt(`${color[2]}${color[3]}`, 16),
        255,
      ];
    } else if (color.length === 9) {
      return [
        parseInt(`${color[7]}${color[8]}`, 16),
        parseInt(`${color[5]}${color[6]}`, 16),
        parseInt(`${color[3]}${color[4]}`, 16),
        255 - parseInt(`${color[2]}`, 16),
      ];
    } else {
      return [
        parseInt(`${color[8]}${color[9]}`, 16),
        parseInt(`${color[6]}${color[7]}`, 16),
        parseInt(`${color[4]}${color[5]}`, 16),
        255 - parseInt(`${color[2]}${color[3]}`, 16),
      ];
    }
  }

  public static fromWebColor(color: string): Array<number> {
    if (!color) return [0, 0, 0, 0];
    color = Color.readableColor(color);
    if (
      color[0] !== '#' &&
      color.length !== 4 &&
      color.length !== 7 &&
      color.length !== 9
    ) {
      throw new Error('Color is not suppored format');
    }
    if (color.length === 4) {
      return [
        parseInt(`${color[1]}${color[1]}`, 16),
        parseInt(`${color[2]}${color[2]}`, 16),
        parseInt(`${color[3]}${color[3]}`, 16),
        255,
      ];
    } else if (color.length === 7) {
      return [
        parseInt(`${color[1]}${color[2]}`, 16),
        parseInt(`${color[3]}${color[4]}`, 16),
        parseInt(`${color[5]}${color[6]}`, 16),
        255,
      ];
    } else {
      return [
        parseInt(`${color[1]}${color[2]}`, 16),
        parseInt(`${color[3]}${color[4]}`, 16),
        parseInt(`${color[5]}${color[6]}`, 16),
        parseInt(`${color[7]}${color[8]}`, 16),
      ];
    }
  }
}
