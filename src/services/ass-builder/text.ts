export default class Text {
  text: string = '';

  constructor(text: string | undefined) {
    this.text = text || '';
  }

  public toString(): string {
    return this.text;
  }
}
