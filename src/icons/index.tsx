import React from 'react';
import IconCC from './cc';
import IconDownload from './download';
import IconShare from './share';
import IconUpload from './upload';
import IconLaptop from './laptop';
import IconMobile from './mobile';
import IconError from './error';
import IconShowMore from './showMore';
import IconShowLess from './showLess';
import IconCopy from './copy';
import IconEdit from './edit';
import IconCopyCheck from './copyCheck';
import IconClose from './close';
import IconItalic from './italic';
import IconUnderline from './underline';
import IconLeftAlign from './leftAlign';
import IconCenterAlign from './centerAlign';
import IconRightAlign from './rightAlign';
import IconSpinner1 from './spinner1';
import IconStartMarker from './startMarker';
import IconEndMarker from './endMarker';
import IconSearch from './search';
import IconOrange from './orange';
import IconSky from './sky';
import IconRed from './red';
import IconBlue from './blue';
interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, ...rest }: IconProps) => {
  switch (name) {
    case 'blue':
      return <IconBlue />;
    case 'red':
      return <IconRed />;
    case 'sky':
      return <IconSky />;
    case 'orange':
      return <IconOrange {...rest} />;
    case 'search':
      return <IconSearch {...rest} />;
    case 'endMarker':
      return <IconEndMarker {...rest} />;
    case 'startMarker':
      return <IconStartMarker {...rest} />;
    case 'check':
      return <IconCopyCheck {...rest} />;
    case 'edit':
      return <IconEdit {...rest} />;
    case 'copy':
      return <IconCopy {...rest} />;
    case 'showLess':
      return <IconShowLess {...rest} />;
    case 'showMore':
      return <IconShowMore {...rest} />;
    case 'error':
      return <IconError {...rest} />;
    case 'mobile':
      return <IconMobile {...rest} />;
    case 'laptop':
      return <IconLaptop {...rest} />;
    case 'download':
      return <IconDownload {...rest} />;
    case 'share':
      return <IconShare {...rest} />;
    case 'upload':
      return <IconUpload {...rest} />;
    case 'cc':
      return <IconCC {...rest} />;
    case 'close':
      return <IconClose {...rest} />;
    case 'italic':
      return <IconItalic {...rest} />;
    case 'underline':
      return <IconUnderline {...rest} />;
    case 'alignment-left':
      return <IconLeftAlign {...rest} />;
    case 'alignment-center':
      return <IconCenterAlign {...rest} />;
    case 'alignment-right':
      return <IconRightAlign {...rest} />;
    case 'spinner1':
      return <IconSpinner1 {...rest} />;
    default:
      return null;
  }
};

export default Icon;
