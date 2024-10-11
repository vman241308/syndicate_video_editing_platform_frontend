import Color from './color';
interface TypeStyleV4 {
  name: string;
  key: string | number;
  fontName?: string;
  fontSize?: number | string;
  primaryColour?: Color; // This is the colour that a subtitle will normally appear in.
  secondaryColour?: Color; // This colour may be used instead of the Primary colour when a subtitle is automatically shifted to prevent an onscreen collsion, to distinguish the different subtitles.
  outlineColour?: Color; // This colour may be used instead of the Primary or Secondary colour when a subtitle is automatically shifted to prevent an onscreen collsion, to distinguish the different subtitles.
  backColour?: Color; // This is the colour of the subtitle outline or shadow, if these are used.
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikeOut?: boolean;
  scaleX?: number; // Modifies the width of the font. [percent]
  scaleY?: number; // Modifies the height of the font. [percent]
  spacing?: number; // Extra space between characters. [pixels]
  angle?: number; // The origin of the rotation is defined by the alignment. Can be a floating point number. [degrees]
  borderStyle?: number | string; // 1|Outline = Outline + drop shadow, 3|Opaque = Opaque box
  outline?: number; // If BorderStyle is 1, then this specifies the width of the outline around the text, in pixels. Values may be 0, 1, 2, 3 or 4.
  shadow?: number; // If BorderStyle is 1, then this specifies the depth of the drop shadow behind the text, in pixels. Values may be 0, 1, 2, 3 or 4. Drop shadow is always used in addition to an outline - SSA will force an outline of 1 pixel if no outline width is given.
  alignment?: number | string; // his sets how text is "justified" within the Left/Right onscreen margins, and also the vertical placing. Values may be 1=Left, 2=Centered, 3=Right. Add 4 to the value for a "Toptitle". Add 8 to the value for a "Midtitle". eg. 5 = left-justified toptitle
  marginL?: number; // This defines the Left Margin in pixels. It is the distance from the left-hand edge of the screen.The three onscreen margins (MarginL, MarginR, MarginV) define areas in which the subtitle text will be displayed.
  marginR?: number; // This defines the Right Margin in pixels. It is the distance from the right-hand edge of the screen. The three onscreen margins (MarginL, MarginR, MarginV) define areas in which the subtitle text will be displayed.
  marginV?: number; // This defines the vertical Left Margin in pixels. For a subtitle, it is the distance from the bottom of the screen. For a toptitle, it is the distance from the top of the screen. For a midtitle, the value is ignored - the text will be vertically centred
  encoding?: number; // This specifies the font character set or encoding and on multi-lingual Windows installations it provides access to characters used in multiple than one languages. It is usually 0 (zero) for English (Western, ANSI) Windows. When the file is Unicode, this field is useful during file format conversions.
}
export default class StyleV4 {
  style: TypeStyleV4 = {
    name: 'Default',
    key: '',
    fontName: 'Arial',
    fontSize: 16,
    primaryColour: new Color('&H00ffff'),
    secondaryColour: new Color('&H00ffff'),
    outlineColour: new Color('&H0'),
    backColour: new Color('&H0'),
    bold: false,
    italic: false,
    underline: false,
    strikeOut: false,
    scaleX: 100,
    scaleY: 100,
    spacing: 0,
    angle: 0,
    borderStyle: 1,
    outline: 1,
    shadow: 1,
    alignment: 2,
    marginL: 10,
    marginR: 10,
    marginV: 10,
    encoding: 0,
  };

  constructor(style: TypeStyleV4) {
    this.style = { ...this.style, ...style };
  }

  public getName(): string {
    return this.value('name') as string;
  }

  public toString(): string {
    return `Style: ${this.value('name')},${this.value('fontName')},${this.value(
      'fontSize'
    )},${this.value('primaryColour')},${this.value(
      'secondaryColour'
    )},${this.value('outlineColour')},${this.value('backColour')},${this.value(
      'bold'
    )},${this.value('italic')},${this.value('underline')},${this.value(
      'strikeOut'
    )},${this.value('scaleX')},${this.value('scaleY')},${this.value(
      'spacing'
    )},${this.value('angle')},${this.value('borderStyle')},${this.value(
      'outline'
    )},${this.value('shadow')},${this.value('alignment')},${this.value(
      'marginL'
    )},${this.value('marginR')},${this.value('marginV')},${this.value(
      'encoding'
    )}
`;
  }

  public static definitionString(): string {
    return `
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
`;
  }

  private value(key: keyof TypeStyleV4): string | number | boolean | Color {
    let value = this.style[key];

    // number type
    if (key === 'fontSize') {
      value = value as TypeStyleV4['fontSize'];
      if (typeof value === 'string') value = parseInt(value as string);
      if (typeof value !== 'number') throw new Error('fontSize is invalid');
      // boolean type
    } else if (
      key === 'bold' ||
      key === 'italic' ||
      key === 'underline' ||
      key === 'strikeOut'
    ) {
      // boolean
      if (value) value = -1;
      else value = 0;
      // Color
    } else if (
      key === 'primaryColour' ||
      key === 'secondaryColour' ||
      key === 'outlineColour' ||
      key === 'backColour'
    ) {
      value = value as
        | TypeStyleV4['primaryColour']
        | TypeStyleV4['secondaryColour']
        | TypeStyleV4['outlineColour']
        | TypeStyleV4['backColour'];
      if (value) value = value.toAssColor();
    } else if (key === 'name') {
      value = (value as TypeStyleV4['name']) + this.style.key;
    } else if (key === 'borderStyle') {
      value = value as TypeStyleV4['borderStyle'];
      if (value === 'Outline') value = 1;
      else if (value === 'Opaque') value = 3;
      else if (typeof value == 'string') value = parseInt(value);
      if (value === undefined || (value !== 1 && value !== 3))
        throw new Error('borderStyle is invalid');
    } else if (key === 'alignment') {
      let marginV = 0;
      if (typeof value === 'string') {
        marginV = parseInt(value);
        value = value.replace(`${marginV}`, '');
      }
      if (value === 'bottom-left') value = 1;
      else if (value === 'bottom-center') value = 2;
      else if (value === 'bottom-right') value = 3;
      else if (value === 'middle-left') value = 4;
      else if (value === 'middle-center') value = 5;
      else if (value === 'middle-right') value = 6;
      else if (value === 'top-left') value = 7;
      else if (value === 'top-center') value = 8;
      else if (value === 'top-right') value = 9;
      else if (typeof value === 'string') value = parseInt(value);
      else throw new Error('alignment is invalid');
      this.style['marginV'] = marginV;
    }
    if (value === undefined) return '';
    return value;
  }
}
