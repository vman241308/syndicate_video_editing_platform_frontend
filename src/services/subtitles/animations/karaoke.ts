import {
  AssBuilder,
  AssEvent,
  AssStyle,
  AssText,
  AssTime,
} from '../../ass-builder';
import Color from '../../ass-builder/color';

export default class DefaultAnimation implements CaptionDrawer {
  builder: AssBuilder;
  captionStyle: CaptionStyle | null = null;
  defaultStyle: AssStyle | null = null;
  styleIndex: number = 0;

  constructor(builder: AssBuilder, style: CaptionStyle) {
    this.builder = builder;
    this.setStyle(style);
  }

  setStyle(style: CaptionStyle) {
    this.captionStyle = style;
    this.defaultStyle = new AssStyle({
      name: 'KA',
      key: this.builder.getStyleCount(),
      fontName: style.font,
      fontSize: style.fontSize,
      bold: style.fontWeight !== 'lighter',
      italic: style.italic,
      underline: style.underline,
      alignment: style.textAlign,
      secondaryColour: new Color('#000000'),
    });
    this.builder.addStyle(this.defaultStyle);
  }

  drawCaptions(
    caption: Caption,
    words: Array<Caption> = [],
    start: number = 0,
    end: number = 0
  ) {
    const wds = caption.text.split(' ');
    const duration = Math.floor(
      ((caption.end - caption.start) * 100) / wds.length
    );
    let text = '';
    wds.map((wd) => {
      text += `{\\ko${duration}}${wd} `;
    });
    const event = new AssEvent({
      type: 'Dialogue',
      layer: 0,
      start: new AssTime((caption.start - start) * 1000),
      end: new AssTime((caption.end - start) * 1000),
      text: new AssText(text),
      style: this.defaultStyle || '',
      effect: 'Karaoke',
    });
    this.builder.addEvent(event);
  }
}
