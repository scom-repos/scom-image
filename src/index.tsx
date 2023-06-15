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

interface ICropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScomImageElement extends ControlElement {
  lazyLoad?: boolean;
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
    url: '',
    altText: '',
    backgroundColor: '',
    link: ''
  }
  private uploader: Upload
  private img: Image
  private linkStack: Panel
  private edtLink: Input
  private pnlImage: Panel
  private imgLink: Label

  private newCropData: ICropData
  private oldCropData: ICropData
  private originalUrl: string = ''
  private isReset: boolean = false
  private isInitedLink: boolean = false

  tag: any

  readonly onConfirm: () => Promise<void>
  readonly onDiscard: () => Promise<void>
  readonly onEdit: () => Promise<void>

  defaultEdit?: boolean
  validate?: () => boolean
  edit: () => Promise<void>
  confirm: () => Promise<void>
  discard: () => Promise<void>

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    if (configData)
      setDataFromSCConfig(configData);
  }
  
  init() {
    super.init()
    this.setTag({width: '100%', height: 'auto'});
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      this.url = this.getAttribute('url', true);
      this.altText = this.getAttribute('altText', true);
    }
  }

  static async create(options?: ScomImageElement, parent?: Container){
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
      this.toggleEditMode(true)
      this.img.url = ''
      return
    }
    this.toggleEditMode(false)
    if (this.data.url?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl)
    } else if (value) {
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
    this.setLink();
  }

  private toggleEditMode(value: boolean) {
    this.uploader.visible = value
    this.linkStack.visible = value
    this.imgLink.visible = !value
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
          const defaultData = configData.defaultBuilderData;
          await this.setData({...defaultData, ...data});
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
      required: ["url"],
      "properties": {
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
        name: 'Crop (Enter)',
        icon: 'crop-alt',
        command: (builder: any, userInputData: any) => {
          return {
            execute: () => {
              if (!userInputData) return;
              if (!this.isReset)
                this.oldCropData = this.newCropData;
              this.newCropData = userInputData;
              this.onCrop(this.newCropData);
              if (builder?.setData) builder.setData(this.data);
              this.isReset = false;
            },
            undo: () => {
              if (!userInputData) return;
              if (!this.oldCropData) {
                this.img.url = this.data.url = this.originalUrl;
                this.isReset = true;
              } else {
                this.onCrop(this.oldCropData);
                this.isReset = false;
              }
              if (builder?.setData) builder.setData(this.data);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: {
          "type": "object",
          required: ["x", "y"],
          "properties": {
            "x": {
              "type": "integer"
            },
            "y": {
              "type": "integer"
            },
            "width": {
              "type": "integer"
            },
            "height": {
              "type": "integer"
            }
          }
        } as IDataSchema
      },
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let oldData: IImage = { url: '' };
          return {
            execute: () => {
              oldData = {...this.data};
              if (builder?.setData) builder.setData(userInputData);
              this.setData(userInputData);
            },
            undo: () => {
              if (builder?.setData) builder.setData(oldData);
              this.setData(oldData);
            },
            redo: () => {}
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
    if (!value.url) return
    this.data = value
    if (!this.originalUrl) this.originalUrl = this.data.url

    const uploader = document.getElementById('uploader')
    const imageElm = uploader?.getElementsByTagName('img')[0]
    if (imageElm) imageElm.src = value.url
    else this.edtLink.value = value.url
    this.updateImg()
    this.pnlImage.background.color = value.backgroundColor || ''
    this.setLink();
  }

  private updateImg() {
    this.toggleEditMode(false)
    if (this.data.url?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl)
    } else {
      this.img.url = this.data.url
    }
    if (this.tag.width || this.tag.height) {
      this.img.display = 'block';
      this.tag.width && (this.img.width = this.tag.width)
      this.tag.width && (this.img.height = this.tag.height)
    }
    const imgElm = this.img.querySelector('img')
    imgElm && imgElm.setAttribute('alt', this.data.altText || '')
  }

  private async setLink() {
    if (this.data.link)
      this.imgLink.link = await Link.create({ href: this.data.link, target: '_blank' })
    else
      this.imgLink.link = await Link.create({ target: '_self' })
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

  private onCrop(data: ICropData) {
    const { x: newX, y: newY, width: newWidth, height: newHeight } = data;
    let img_uploader = this.uploader.getElementsByTagName('img')[0]

    // originalImage in form of img
    const originalImage = document.createElement('img')
    originalImage.src = img_uploader?.src || this.data.url

    // create a new empty canvas
    let canvas = document.createElement('canvas')
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    const ctx = canvas!.getContext('2d')

    var ptrn = ctx!.createPattern(originalImage, 'no-repeat')
    ctx!.fillStyle = ptrn!

    // converted the originalImage to canvas
    ctx!.fillRect(0, 0, canvas.width, canvas.height)

    // set the canvas size to the new width and height
    canvas.width = newWidth
    canvas.height = newHeight

    // draw the image
    ctx!.drawImage(
      originalImage,
      newX,
      newY,
      newWidth,
      newHeight,
      0,
      0,
      newWidth,
      newHeight
    )
    this.img.url = canvas!.toDataURL();
    this.data.url = canvas!.toDataURL();
  }

  private async onChangedImage(control: Control, files: any[]) {
    let newUrl = ''
    if (files && files[0]) {
      newUrl = (await this.uploader.toBase64(files[0])) as string
      this.originalUrl = newUrl
    }
    this.setData({...this.data, url: newUrl})
    const builder = this.parent.closest('ide-toolbar') as any
    if (builder) builder.setData({...this.data, url: newUrl})
  }

  private onRemovedImage(control: Control, file: File) {
    this.data.url = this.edtLink.value || ''
  }

  private onChangedLink(source: Control) {
    const newUrl = (source as Input).value
    this.originalUrl = newUrl
    this.setData({...this.data, url: newUrl})
    const builder = this.parent.closest('ide-toolbar') as any
    if (builder) builder.setData({...this.data, url: newUrl})
  }

  render() {
    return (
      <i-panel>
        <i-vstack id={'pnlImage'}>
          <i-upload
            id={'uploader'}
            multiple={false}
            height={'100%'}
            visible={false}
            onChanged={this.onChangedImage}
            onRemoved={this.onRemovedImage}
          ></i-upload>
          <i-label id="imgLink" display="block" maxHeight="100%" maxWidth="100%">
            <i-image
              id={'img'}
              maxHeight="100%" maxWidth="100%"
              linkTo={this.imgLink}
              class="custom-img"
            ></i-image>
          </i-label>
          <i-panel id='linkStack'  visible={false}>
            <i-label caption='URL'></i-label>
            <i-input
              id='edtLink'
              width='100%'
              onChanged={this.onChangedLink.bind(this)}
            ></i-input>
          </i-panel>
        </i-vstack>
      </i-panel>
    )
  }
}
