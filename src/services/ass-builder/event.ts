import Text from './text';
import Time from './time';
import StyleV4 from './v4Style';

interface TypeEvent {
  type: string; // Dialogue, Command, Comment, Audio, Movie
  layer: number; // Subtitles having different layer number will be ignored during the collusion detection. Higher numbered layers will be drawn over the lower numbered.
  start: Time; // Start Time of the Event, in 0:00:00:00 format ie. Hrs:Mins:Secs:hundredths. This is the time elapsed during script playback at which the text will appear onscreen. Note that there is a single digit for the hours!
  end: Time; // End Time of the Event, in 0:00:00:00 format ie. Hrs:Mins:Secs:hundredths. This is the time elapsed during script playback at which the text will disappear offscreen. Note that there is a single digit for the hours!
  style: StyleV4 | string; // Style name. If it is "Default", then your own *Default style will be subtituted. However, the Default style used by the script author IS stored in the script even though SSA ignores it - so if you want to use it, the information is there - you could even change the Name in the Style definition line, so that it will appear in the list of "script" styles.
  name?: string; // Character name. This is the name of the character who speaks the dialogue. It is for information only, to make the script is easier to follow when editing/timing.
  marginL?: number; // 4-figure Left Margin override. The values are in pixels. All zeroes means the default margins defined by the style are used.
  marginR?: number; // 4-figure Right Margin override. The values are in pixels. All zeroes means the default margins defined by the style are used.
  marginV?: number; // 4-figure Bottom Margin override. The values are in pixels. All zeroes means the default margins defined by the style are used.
  effect?: string; // Transition Effect. This is either empty, or contains information for one of the three transition effects implemented in SSA v4.x,
  // The effect names are case sensitive and must appear exactly as shown. The effect names do not have quote marks around them.
  // "Karaoke" means that the text will be successively highlighted one word at a time.
  // Karaoke as an effect type is obsolete.
  // "Scroll up;y1;y2;delay[;fadeawayheight]"means that the text/picture will scroll up the screen. The parameters after the words "Scroll up" are separated by semicolons.
  // The y1 and y2 values define a vertical region on the screen in which the text will scroll. The values are in pixels, and it doesn't matter which value (top or bottom) comes first. If the values are zeroes then the text will scroll up the full height of the screen.
  // The delay value can be a number from 1 to 100, and it slows down the speed of the scrolling - zero means no delay and the scrolling will be as fast as possible.
  // “Banner;delay” means that text will be forced into a single line, regardless of length, and scrolled from right to left accross the screen.
  // The delay value can be a number from 1 to 100, and it slows down the speed of the scrolling - zero means no delay and the scrolling will be as fast as possible.
  // "Scroll down;y1;y2;delay[;fadeawayheight]"
  // “Banner;delay[;lefttoright;fadeawaywidth]”
  // lefttoright 0 or 1. This field is optional.  Default value is 0 to make it backwards compatible.
  // When delay is greater than 0, moving one pixel will take (1000/delay) second.
  // (WARNING: Avery Lee’s “subtitler” plugin reads the “Scroll up” effect parameters as delay;y1;y2)
  // fadeawayheight and fadeawaywidth parameters can be used to make the scrolling text at the sides transparent.
  text: Text; // Subtitle Text. This is the actual text which will be displayed as a subtitle onscreen. Everything after the 9th comma is treated as the subtitle text, so it can include commas.
  // The text can include \n codes which is a line break, and can include Style Override control codes, which appear between braces { }.
}

type TypeEventKeys = keyof TypeEvent;

export default class Event {
  event: TypeEvent;

  constructor(event: TypeEvent) {
    this.event = event;
  }

  public toString(): string {
    return `${this.value('type')}: ${this.value('layer')},${this.value(
      'start'
    )},${this.value('end')},${this.value('style')},${this.value(
      'name'
    )},${this.value('marginL')},${this.value('marginR')},${this.value(
      'marginV'
    )},${this.value('effect')},${this.value('text')}
`;
  }

  public static definitionString(): string {
    return `
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
  }

  private value(key: TypeEventKeys): string | number | Time | StyleV4 | Text | undefined {
    let value = this.event ? this.event[key] : undefined;

    // Time type
    if (key === 'start' || key === 'end') {
      value = (value as TypeEvent['start'] | TypeEvent['end']).toString();
      // StyleV4 type
    } else if (key === 'style') {
      value = value as TypeEvent['style']
      if (typeof value !== 'string') {
        value = value.getName();
      }
      // Text type
    } else if (key === 'text') {
      value = (value as TypeEvent['text']).toString();
    } else if (key === 'marginL' || key === 'marginR' || key === 'marginV') {
      value = (value as TypeEvent['marginL'] | TypeEvent['marginR'] | TypeEvent['marginV']) || 0;
    }

    return value;
  }
}
