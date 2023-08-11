import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

const maskStyle = `linear-gradient(rgb(0, 0, 0) 0px, rgb(0, 0, 0) 0px) 50% 100% / 100% 100% no-repeat, linear-gradient(rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 0px)`

Styles.cssRule('i-scom-image-crop', {
  $nest: {
    '.custom-img img': {
      objectFit: 'fill',
      objectPosition: 'center',
      width: '100%',
      height: '100%',
      maxWidth: 'none',
      maxHeight: 'none'
    },
    '.is-circle': {
      cursor: 'move',
      borderRadius: '50%',
      border: `2px solid ${Theme.colors.primary.main}`,
      $nest: {
        ".angle": {
          borderRadius: '50%',
          background: Theme.colors.primary.main,
          border: '2px solid #fff',
          marginTop: -8
        },
        ".angle-center": {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '2px solid #fff',
          display: 'block',
          cursor: 'pointer'
        }
      }
    },
    ".angle-center": {
      display: 'none'
    },
    ".angle": {
      zIndex: 2,
      position: 'absolute',
      width: '16px',
      height: '16px',
      background: 'none 0px center',
      border: `6px solid ${Theme.colors.primary.main}`,
      borderRadius: 0
    },
    ".angle-nw": {
      left: 0,
      top: 0,
      borderRight: 0,
      borderBottom: 0,
      marginTop: -2,
      marginLeft: -2,
      cursor: 'nw-resize'
    },
    ".angle-n": {
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      marginTop: -2,
      cursor: 'n-resize',
      left: 'calc(50% - 8px)',
      top: 0
    },
    ".angle-ne": {
      transform: "rotate(360deg)",
      right: 0,
      top: 0,
      borderBottom: 0,
      borderLeft: 0,
      marginTop: -2,
      marginRight: -2,
      cursor: 'ne-resize'
    },
    ".angle-e": {
      borderBottom: 0,
      borderLeft: 0,
      borderTop: 0,
      marginRight: -2,
      cursor: 'e-resize',
      top: 'calc(50% - 8px)',
      right: 0
    },
    ".angle-se": {
      transform: "rotate(0deg)",
      right: 0,
      bottom: 0,
      borderLeft: 0,
      borderTop: 0,
      marginRight: -2,
      marginBottom: -2,
      cursor: 'se-resize'
    },
    ".angle-s": {
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      cursor: 's-resize',
      left: 'calc(50% - 8px)',
      bottom: 0,
      marginBottom: -2
    },
    ".angle-sw": {
      transform: "rotate(360deg)",
      bottom: 0,
      left: 0,
      borderTop: 0,
      borderRight: 0,
      marginBottom: -2,
      marginLeft: -2,
      cursor: 'sw-resize',
    },
    ".angle-w": {
      borderTop: 0,
      borderRight: 0,
      borderBottom: 0,
      marginLeft: -2,
      cursor: 'w-resize',
      top: 'calc(50% - 8px)',
      left: 0
    },
    ".custom-mask": {
      mask: maskStyle,
      '-webkit-mask': maskStyle
    },
    '#pnlCropMask': {
      aspectRatio: '1 / 1',
      minWidth: 50,
      minHeight: 50
    }
  }
});
