import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

const loadingAnim = Styles.keyframes({
  'from': {
    backgroundPosition: '0 0'
  },
  'to': {
    backgroundPosition: '1000px 0'
  }
})

export default Styles.cssRule('i-scom-image-config', {
  $nest: {
    '.type-item': {
      border: `1px solid ${Theme.background.modal}`,
      transition: 'opacity, border .2s ease-in'
    },
    '.type-item:hover': {
      background: Theme.action.hover,
      border: `1px solid ${Theme.divider}`,
    },
    '.is-actived > .check-icon': {
      opacity: '1 !important'
    },
    '.type-pnl': {
      $nest: {
        'i-button': {
          justifyContent: 'start',
          gap: '0.5rem'
        }
      }
    },
    'i-button': {
      gap: '0.5rem'
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
          boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px ${Theme.divider}`
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
    },
    '.image-item': {
      cursor: 'pointer',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      $nest: {
        '.image-content': {
          opacity: 0,
          borderBottomLeftRadius: '0.25rem',
          borderBottomRightRadius: '0.25rem',
          transition: 'background-color,border-color,color,fill,stroke,opacity,box-shadow,transform .3s ease-in'
        },
        '&:hover .image-content': {
          opacity: 1
        },
        '.img-fade': {
          opacity: 0,
          borderTopLeftRadius: '0.25rem',
          borderTopRightRadius: '0.25rem',
        },
        '&.img-actived .img-fade': {
          opacity: 1
        }
      }
    },
    '.image-placeholder': {
      backgroundImage: 'linear-gradient(90deg, #e4e4e4 0%, #f1f1f1 40%, #ededed 60%, #e4e4e4 100%)',
      backgroundPosition: '0px 0px',
      backgroundRepeat: 'repeat',
      animation: `${loadingAnim} 5s linear infinite`
    }
  }
})
