interface Caption {
  id: number;
  start: number; // miliseconds
  end: number; // miliseconds
  text: string;
}

interface CaptionStyle {
  font: string;
  fontFiles?: Array<string>;
  fontSize: string;
  fontWeight: string; // lighter, bold, bolder
  italic: boolean;
  underline: boolean;
  textAlign: string; // start, end, left, right, center
  style?: string;
  capitalize: boolean;
  rmp: boolean;
}

interface VideoInfo {
  id: string;
  videoUrl: string;
  mimeType: string;
  thumbs: Array<string>;
  thumbsSize: number;
  subtitles?: {
    url: string | ArrayBuffer;
  };
  captions?: Array<Caption>;
  transcription?: string;
  fonts?: Array<string>;
}
