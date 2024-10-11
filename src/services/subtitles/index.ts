import { AssBuilder } from '../ass-builder';
import DefaultAnimation from './animations/default';
import KaraokeAnimation from './animations/karaoke';

export function subtitles(
  captions: Array<Caption>,
  style: CaptionStyle,
  start: number = 0,
  end: number = 0,
  width: number = 1920,
  height: number = 1080
): string {
  const builder = new AssBuilder('Syndicate Ass', width, height);
  const drawers: { [key: string]: CaptionDrawer } = {};
  let captionDrawer: CaptionDrawer;
  switch (style.style) {
    case 'karaoke':
      if (drawers[style.style]) {
        captionDrawer = drawers[style.style];
      } else {
        captionDrawer = new KaraokeAnimation(builder, style);
        drawers[style.style] = captionDrawer;
      }
      break;
    default:
      if (drawers['default']) {
        captionDrawer = drawers['default'];
      } else {
        captionDrawer = new DefaultAnimation(builder, style);
        drawers['default'] = captionDrawer;
      }
  }
  for (let i = 0; i < captions.length; i++) {
    if (start + end !== 0 && captions[i].start < start) continue;
    if (start + end !== 0 && captions[i].start > end) continue;

    const currCaption = { ...captions[i] };

    if (style.capitalize) {
      currCaption.text = currCaption.text.toUpperCase();
    }
    if (style.rmp) {
      currCaption.text = currCaption.text.replace(/[?.,]/g, '');
    }

    captionDrawer.drawCaptions(currCaption, [], start, end);
  }

  return builder.build();
}
