import {
  Module,
  Panel,
  Image,
  Input,
  Upload,
  Control,
  customModule,
  Label,
  IDataSchema,
  Container,
  Link,
  ControlElement,
  customElements
} from '@ijstech/components'
import { IImage } from './interface'
import { getIPFSGatewayUrl, setDataFromSCConfig } from './store'
import configData from './data.json'
import './index.css'

interface ScomImageElement extends ControlElement {
  lazyLoad?: boolean;
  cid?: string;
  url: string;
  altText?: string;
  link?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-image"]: ScomImageElement;
    }
  }
}

@customModule
@customElements('i-scom-image')
export default class ScomImage extends Module {
  private data: IImage = {
    cid: '',
    url: '',
    altText: '',
    backgroundColor: '',
    link: ''
  }
  private img: Image;
  private pnlImage: Panel;

  private originalUrl: string = '';
  private isInitedLink: boolean = false;

  tag: any;

  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  defaultEdit?: boolean;
  validate?: () => boolean;
  edit: () => Promise<void>;
  confirm: () => Promise<void>;
  discard: () => Promise<void>;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    if (configData)
      setDataFromSCConfig(configData);
  }

  init() {
    super.init()
    this.setTag({ width: '100%', height: 'auto' });
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      let cid = this.getAttribute('cid', true);
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      this.url = this.getAttribute('url', true) || cid ? ipfsGatewayUrl + cid : "";
      this.altText = this.getAttribute('altText', true);
    }
  }

  static async create(options?: ScomImageElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get url() {
    return this.data.url ?? '';
  }
  set url(value: string) {
    this.data.url = value;
    if (!value) {
      this.img.url = 'https://placehold.co/600x400?text=No+Image'
      return
    }
    if (this.data.url?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl)
    } else {
      this.img.url = this.data.url
    }
  }

  get altText() {
    return this.data.altText ?? '';
  }
  set altText(value: string) {
    this.data.altText = value;
    const imgElm = this.img.querySelector('img')
    imgElm && imgElm.setAttribute('alt', this.data.altText || '')
  }

  get link() {
    return this.data.link ?? '';
  }
  set link(value: string) {
    this.data.link = value;
  }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          return this._getActions(this.getPropertiesSchema(), this.getThemeSchema());
        },
        getData: this.getData.bind(this),
        setData: async (data: IImage) => {
          // const defaultData = configData.defaultBuilderData;
          // await this.setData({...defaultData, ...data});
          await this.setData({ ...data })
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getActions: () => {
          return this._getActions(this.getPropertiesSchema(), this.getThemeSchema(true));
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private getPropertiesSchema() {
    const propertiesSchema: IDataSchema = {
      "type": "object",
      "properties": {
        "cid": {
          title: 'Image',
          type: 'string',
          format: 'data-cid'
        },
        "url": {
          "type": "string"
        },
        "altText": {
          "type": "string"
        },
        "link": {
          "type": "string"
        }
      }
    };

    return propertiesSchema;
  }

  private getThemeSchema(readOnly?: boolean) {
    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        backgroundColor: {
          type: 'string',
          format: 'color',
          readOnly
        },
        width: {
          type: 'string',
          readOnly
        },
        height: {
          type: 'string',
          readOnly
        }
      }
    }

    return themeSchema;
  }

  private _getActions(settingSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let oldData: IImage = { url: '' };
          return {
            execute: () => {
              oldData = { ...this.data };
              if (builder?.setData) builder.setData(userInputData);
              this.setData(userInputData);
            },
            undo: () => {
              if (builder?.setData) builder.setData(oldData);
              this.setData(oldData);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: settingSchema as IDataSchema
      }
    ]
    return actions
  }

  private getData() {
    return this.data
  }

  private async setData(value: IImage) {
    this.data = value
    if (!this.originalUrl) this.originalUrl = this.data.url;

    this.updateImg()
    this.pnlImage.background.color = value.backgroundColor || '';
  }

  private updateImg() {
    if (this.data.cid) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      this.img.url = ipfsGatewayUrl + this.data.cid;
    } else if (this.data.url?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl)
    } else {
      this.img.url = this.data.url || 'https://placehold.co/600x400?text=No+Image'
    }
    if (this.tag.width || this.tag.height) {
      this.img.display = 'block';
      this.tag.width && (this.img.width = this.tag.width)
      this.tag.width && (this.img.height = this.tag.height)
    }
    const imgElm = this.img.querySelector('img')
    imgElm && imgElm.setAttribute('alt', this.data.altText || '')
  }

  async connectedCallback() {
    super.connectedCallback();
    if (!this.isConnected) return;
    const link = this.data.link || this.getAttribute('link', true);
    if (link !== undefined && !this.isInitedLink) {
      this.isInitedLink = true;
      this.link = link;
    }
  }

  private getTag() {
    return this.tag
  }

  private async setTag(value: any) {
    this.tag = value;
    if (this.img) {
      this.img.display = "block";
      this.img.width = this.tag.width;
      this.img.height = this.tag.height;
    }
  }
  
  private onImageClick() {
    if (!this.data.link) return;
    window.open(this.data.link, '_blank');
  }

  render() {
    return (
      <i-panel>
        <i-vstack id={'pnlImage'}>
          <i-image
            id={'img'}
            url={'https://placehold.co/600x400?text=No+Image'}
            maxHeight="100%" maxWidth="100%"
            class="custom-img"
            onClick={this.onImageClick.bind(this)}
          ></i-image>
        </i-vstack>
      </i-panel>
    )
  }
}
