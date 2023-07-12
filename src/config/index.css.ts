import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export default Styles.cssRule('i-scom-image-config', {
  $nest: {
    '.type-btn:hover': {
      background: Theme.action.hover,
      borderStyle: 'solid'
    },
    '.is-actived > check-icon': {
      opacity: 1
    },
    '.type-pnl': {
      $nest: {
        'i-button': {
          justifyContent: 'start'
        }
      }
    },
    '.hover-btn:hover': {
      background: Theme.action.hover,
      borderStyle: 'solid'
    },
    '#typeButton': {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    '#typeModal .modal': {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '0.5rem',
      $nest: {
        '.i-modal_header': {
          display: 'none'
        }
      }
    },
    'i-input input': {
      padding: '0 10px'
    }
  }
})
