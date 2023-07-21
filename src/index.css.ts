import { Styles } from '@ijstech/components';

Styles.cssRule('#pnlImage', {
  $nest: {
    '.custom-img img': {
      objectFit: 'fill',
      objectPosition: 'center',
      width: '100%',
      height: '100%'
    },
    "&.img-wrapper": {
      mask: 'none',
      '-webkit-mask': 'none'
    },
    "&.cropped-pnl": {
      maxWidth: '100%',
      maxHeight: '100%',
      width: '100%',
      overflow: 'hidden',
      $nest: {
        '.custom-img img': {
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%',
          transformOrigin: 'left top',
          width: '100%',
          height: 'auto'
        }
      }
    }
  }
});
