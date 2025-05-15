import {
  Module,
  Panel,
  Image,
  customModule,
  Container,
  ControlElement,
  customElements,
  VStack,
  HStack,
  Button,
  Styles
} from '@ijstech/components';
import { CropType, executeFnType, ICropData, IImage } from './interface';
import { getIPFSGatewayUrl } from './store';
import './index.css';
import { Model } from './model';
import ScomImageCrop from './crop/index';
import translations from './translations.json';
const Theme = Styles.Theme.ThemeVars;

interface ScomImageElement extends ControlElement {
  lazyLoad?: boolean;
  cid?: string;
  url: string;
  altText?: string;
  link?: string;
  cropData?: ICropData;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-image']: ScomImageElement
    }
  }
}

interface BlockSpecs {
  addBlock: (blocknote: any, executeFn: executeFnType, callbackFn?: any) => { block: any, slashItem: any };
}

@customModule
@customElements('i-scom-image', {
  icon: 'stop',
  props: {
    cid: { type: 'string', default: '' },
    url: { type: 'string', default: '' },
    altText: { type: 'string', default: '' },
    link: { type: 'string', default: '' },
    cropData: { type: 'object', default: {} },
    data: {type: 'object'}
  },
  className: 'ScomImage',
  events: {},
  dataSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string'
      },
      cid: {
        type: 'string',
        required: false
      },
      link: {
        type: 'string',
        required: false
      },
      altText: {
        type: 'string',
        required: false
      },
      cropData: {
        type: 'object',
        required: false
      }
    }
  }
})
export default class ScomImage extends Module implements BlockSpecs {
  private model: Model;
  private img: Image;
  private pnlImage: Panel;
  private pnlImgWrap: Panel;

  private isInitedLink: boolean = false;

  tag: any = {};

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.initModel();
  }

  addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: any) {
    const blockType = 'imageWidget';

    function getData(element: HTMLElement) {
      if (element?.nodeName === 'IMG') {
        return {
          url: element.getAttribute('src'),
          altText: element.getAttribute('alt')
        };
      }
      return false;
    }

    const ImageBlock = blocknote.createBlockSpec({
      type: blockType,
      propSchema: {
        ...blocknote.defaultProps,
        url: {default: ''},
        cid: {default: ''},
        link: {default: ''},
        altText: {default: '',},
        keyword: {default: ''},
        photoId: {default: ''},
        width: {default: 512},
        height: {default: 'auto'}
      },
      content: "none"
    },
    {
      render: (block: any) => {
        const wrapper = new Panel();
        const { url, cid, link, altText, keyword, photoId, backgroundColor } = JSON.parse(JSON.stringify(block.props))
        const customElm = new ScomImage(wrapper, { url, cid, link, altText, keyword, photoId, backgroundColor });
        if (callbackFn) callbackFn(customElm, block);
        wrapper.appendChild(customElm);
        return {
          dom: wrapper
        };
      },
      parseFn: () => {
        return [
          {
            tag: `div[data-content-type=${blockType}]`,
            contentElement: "[data-editable]"
          },
          {
            tag: "p",
            getAttrs: (element: string | HTMLElement) => {
              if (typeof element === "string") return false;
              const child = element.firstChild as HTMLElement;
              if (!child) return false;
              return getData(child);
            },
            priority: 400,
            node: blockType
          },
          {
            tag: "img",
            getAttrs: (element: string | HTMLElement) => {
              if (typeof element === "string") return false;
              return getData(element);
            },
            priority: 401,
            node: blockType
          }
        ]
      },
      toExternalHTML: (block: any, editor: any) => {
        const imageTag = document.createElement("img");
        const src = block.props.url || "";
        const alt = block.props.altText || "";
        imageTag.setAttribute("src", src);
        imageTag.setAttribute("alt", alt);
        const wrapper = document.createElement("p");
        wrapper.appendChild(imageTag);
        return {
          dom: wrapper
        }
      },
      pasteRules: [
        {
          find: /https:\/\/\S+\.(jpg|jpeg|png|gif|webp|svg)/g,
          handler(props: any) {
            const { state, chain, range } = props;
            const textContent = state.doc.resolve(range.from).nodeAfter?.textContent;
  
            chain().BNUpdateBlock(state.selection.from, {
              type: blockType,
              props: {
                url: textContent
              },
            }).setTextSelection(range.from + 1);
          }
        },
      ]
    });

    const ImageSlashItem = {
      name: "Image Widget",
      execute: (editor: any) => {
        const block = { type: blockType, props: { url: "" }};
        if (typeof executeFn === 'function') executeFn(editor, block);
      },
      aliases: ["image", "media"],
      group: "Media",
      icon: { name: 'image' },
      hint: this.i18n.get('$insert_an_image'),
    }

    const moduleData = {
      name: '@scom/scom-image',
      localPath: 'scom-image'
    }

    return { block: ImageBlock, slashItem: ImageSlashItem, moduleData };
  }

  static async create(options?: ScomImageElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get url() {
    return this.model.url;
  }
  set url(value: string) {
    this.model.url = value;
    this.updateImgByUrl();
  }

  get fallbackUrl() {
    return this.model.fallbackUrl;
  }
  set fallbackUrl(value: string) {
    this.model.fallbackUrl = value;
    if (!this.img) return;
    this.img.fallbackUrl = value;
  }

  get altText() {
    return this.model.altText;
  }
  set altText(value: string) {
    this.model.altText = value;
    this.updateAltText();
  }

  get link() {
    return this.model.link;
  }
  set link(value: string) {
    this.model.link = value;
  }

  get cropData() {
    return this.model.cropData;
  }
  set cropData(value: ICropData) {
    this.model.cropData = value;
    this.updateCropUI()
  }

  get data() {
    return this.model.getData();
  }

  set data(value: IImage) {
    this.model.setData(value);
  }

  private customUI() {
    const self = this;
    const parentToolbar = this.closest('ide-toolbar');
    return {
      render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
        const vstack = new VStack(null, { gap: '1rem' });
        const config = new ScomImageCrop(null, { ...this.model.getData() });
        const hstack = new HStack(null, {
          verticalAlignment: 'center',
          horizontalAlignment: 'end'
        });
        const button = new Button(null, {
          caption: this.i18n.get('$confirm'),
          width: '100%',
          height: 40,
          font: { color: Theme.colors.primary.contrastText }
        });
        hstack.append(button);
        vstack.append(config);
        vstack.append(hstack);
        if (parentToolbar) parentToolbar.classList.add('is-editing');
        button.onClick = async () => {
          if (onConfirm) {
            config.onCrop();
            onConfirm(true, { ...this.model.getData(), ...config.data });
            self.updateCropUI()
            if (parentToolbar) parentToolbar.classList.remove('is-editing');
          }
        }
        return vstack;
      }
    }
  }

  getConfigurators() {
    this.initModel();
    return this.model.getConfigurators(this.customUI());
  }

  getData() {
    return this.model.getData();
  }

  setData(value: IImage) {
    this.model.setData(value);
  }

  getTag() {
    return this.tag;
  }

  async setTag(value: any) {
    this.model.setTag(value);
  }

  private updateImg() {
    if (!this.img) return;
    this.img.url = this.model.getUrlImage(true);
    this.img.fallbackUrl = this.model.fallbackUrl;
    const { width, height } = this.tag;
    if (width || height) {
      this.img.display = 'block';
      if (width) {
        this.img.width = this.tag.width;
      }
      if (height) {
        this.img.height = this.tag.height;
      }
    }
    if (this.pnlImage) {
      this.pnlImage.background.color = this.model.backgroundColor;
    }
    this.updateAltText();
    this.updateCropUI();
  }

  private updateImgByUrl() {
    if (!this.img) return;
    this.img.url = this.model.getUrlImage();
  }

  private updateAltText() {
    if (!this.img) return;
    const imgElm = this.img.querySelector('img');
    if (imgElm) {
      imgElm.setAttribute('alt', this.model.altText);
    }
  }

  private updateImageByTag() {
    const { width, height, maxWidth, align, link, margin, padding, border } = this.tag;
    if (this.pnlImage) {
      this.pnlImage.style.removeProperty('aspectRatio');
      if (maxWidth !== undefined) {
        this.pnlImage.maxWidth = maxWidth;
      } else {
        this.pnlImage.maxWidth = '100%';
      }
      if (align !== undefined) {
        let customMargin = {};
        if (align === 'left') customMargin = { right: 'auto' };
        else if (align === 'right') customMargin = { left: 'auto' };
        else customMargin = { right: 'auto', left: 'auto' };
        this.pnlImage.margin = customMargin;
      } else {
        this.pnlImage.style.removeProperty('margin')
      }
      if (margin) {
        this.pnlImage.margin = margin;
      }
      if (padding) {
        this.pnlImage.padding = padding;
      }
    }
    if (this.img) {
      this.img.display = "block";
      this.img.width = width;
      this.img.height = height;
      if (border) this.img.border = border;
      this.updateCropUI();
    }
    if (link) {
      this.classList.add('pointer');
    } else {
      this.classList.remove('pointer');
    }
  }

  private updateCropUI() {
    if (!this.img) return;
    const cropData = this.cropData;
    const imgTag = this.img.querySelector('img')
    if (!imgTag) return
    if (cropData) {
      const { left, top, width, height, aspectRatio, type = CropType.PREEFORM } = cropData
      this.pnlImage.classList.add('cropped-pnl')
      const parentWidth = this.pnlImage.offsetWidth
      const right = left + width
      const bottom = top + height
      const scale = parentWidth / (width / 100 * parentWidth)
      if (type === CropType.CIRCLE) {
        imgTag.style.transform = `scale(${scale}) translate(-${left}%, -${top}%)`;
        const x = left + width / 2
        const y = top + height / 2
        const radius = `${(width / 100 * parentWidth) / 2}px`
        imgTag.style.clipPath = `circle(${radius} at ${x}% ${y}%)`
        this.pnlImage && (this.pnlImage.style.aspectRatio = `1 / 1`)
      } else {
        imgTag.style.transform = `scale(${scale}) translate(-${left}%, -${top}%)`;
        imgTag.style.clipPath = `polygon(${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%)`
        if (this.pnlImage && typeof (aspectRatio) == 'string')
          this.pnlImage.style.aspectRatio = `${aspectRatio.replace(':', '/')}`
        else
          this.pnlImage.style.aspectRatio = `${aspectRatio}/1`
      }
    } else {
      this.pnlImage.classList.remove('cropped-pnl')
      imgTag.style.clipPath = ''
      imgTag.style.transform = ''
      this.pnlImgWrap && (this.pnlImgWrap.style.aspectRatio = ``)
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    if (!this.isConnected) return;
    const link = this.link || this.getAttribute('link', true);
    if (link !== undefined && !this.isInitedLink) {
      this.isInitedLink = true;
      this.link = link;
    }
  }

  private onImageClick() {
    if (!this.tag.link) return;
    window.open(this.tag.link, '_blank');
  }

  private initModel() {
    if (!this.model) {
      this.model = new Model(this, {
        updateImg: this.updateImg.bind(this),
        updateImgByTag: this.updateImageByTag.bind(this)
      });
    }
  }

  init() {
    this.i18n.init({ ...translations });
    super.init();
    this.setTag({ width: '100%', height: 'auto' });
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      let cid = this.getAttribute('cid', true);
      const ipfsGatewayUrl = getIPFSGatewayUrl();
      this.url = this.getAttribute('url', true) || (cid ? ipfsGatewayUrl + cid : "");
      this.altText = this.getAttribute('altText', true);
      const cropData = this.getAttribute('cropData', true);
      if (cropData) this.cropData = cropData;
      this.model.photoId = this.options?.photoId || '';
      this.model.keyword = this.options?.keyword || '';

      const tag = this.getAttribute('tag', true);
      if (tag) this.setTag(tag);
    }
  }

  render() {
    return (
      <i-panel id={'pnlImgWrap'} height="100%">
        <i-vstack id={'pnlImage'} class="img-wrapper">
          <i-image
            id={'img'}
            class="custom-img"
            fallbackUrl="https://placehold.co/600x400?text=No+Image"
            onClick={this.onImageClick.bind(this)}
          ></i-image>
        </i-vstack>
      </i-panel>
    )
  }
}
