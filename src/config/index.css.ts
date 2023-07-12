import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export default Styles.cssRule('i-scom-image-config', {
  $nest: {
    '.type-item:hover': {
      background: Theme.action.hover,
      border: `1px solid ${Theme.divider}`
    },
    '.is-actived > .check-icon': {
      opacity: '1 !important'
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
      border: `1px solid ${Theme.divider}`
    },
    '.shadow-btn': {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      fontWeight: 600
    },
    '.shadow-btn:hover': {
      color: `${Theme.colors.primary.main} !important`
    },
    '#typeModal': {
      $nest: {
        '> div': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        '.modal': {
          padding: '1rem',
          marginTop: '0.5rem',
          $nest: {
            '.i-modal_header': {
              display: 'none'
            }
          }
        }
      }
    },
    'i-input input': {
      padding: '0 10px'
    },
    '#searchInput': {
      border: 'none !important'
    },
    '.overflow': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }
})
