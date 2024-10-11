export default class Time {
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  miliseconds: number = 0;

  public static fromMiliseconds(mili: number): Array<number> {
    let temp = mili;
    const miliseconds = temp % 1000;
    temp = Math.floor(temp / 1000);
    const seconds = temp % 60;
    temp = Math.floor(temp / 60);
    const minutes = temp % 60;
    const hours = Math.floor(temp / 60);
    return [hours, minutes, seconds, miliseconds];
  }

  public static fromString(formatted: string): Array<number> {
    const parts = formatted.split(':');
    let temp = parts[parts.length - 1];
    const secparts = temp.split('.');
    let hours = 0,
      minutes = 0,
      seconds = 0,
      miliseconds = 0;
    if (secparts.length > 1) {
      miliseconds = parseInt(secparts[1]);
    }
    seconds = parseInt(secparts[0]);
    if (parts.length > 1) {
      minutes = parseInt(parts[parts.length - 2]);
    }
    if (parts.length > 2) {
      hours = parseInt(parts[parts.length - 3]);
    }
    if (isNaN(miliseconds)) miliseconds = 0;
    if (isNaN(seconds)) seconds = 0;
    if (isNaN(minutes)) minutes = 0;
    if (isNaN(hours)) hours = 0;
    return [hours, minutes, seconds, miliseconds];
  }

  constructor(timestamp: number | string = 0) {
    let times = [0, 0, 0, 0];
    if (typeof timestamp === 'string') {
      times = Time.fromString(timestamp);
    } else {
      times = Time.fromMiliseconds(timestamp);
    }
    this.hours = times[0];
    this.minutes = times[1];
    this.seconds = times[2];
    this.miliseconds = times[3];
  }

  private to2Digits(num: number): string | number {
    if (num > 9) return num % 100;
    return `0${num}`;
  }

  public toString(): string {
    return `${this.hours % 10}:${this.to2Digits(
      this.minutes % 60
    )}:${this.to2Digits(this.seconds % 60)}.${this.to2Digits(
      Math.round(this.miliseconds / 10) % 100
    )}`;
  }
}
