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
import { IImage, PageBlock } from './interface'
import { getIPFSGatewayUrl, setDataFromSCConfig } from './store'
import './index.css'
import scconfig from './scconfig.json';

const configSchema = {
  type: 'object',
  required: [],
  properties: {
    width: {
      type: 'string',
    },
    height: {
      type: 'string'
    }
  }
}

const settingSchema = {
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "minLength": 1
    },
    "altText": {
      "type": "string"
    },
    "backgroundColor": {
      "type": "string",
      "format": "color"
    },
    // "height": {
    //   "type": "integer",
    //   "default": 100
    // },
    // "width": {
    //   "type": "integer"
    // },
    "link": {
      "type": "string"
    }
  },
  "required": [
    "url"
  ]
}

const cropSchema =  {
  "type": "object",
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
  },
  "required": [
    "x",
    "y"
  ]
}

interface ICropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScomImageElement extends ControlElement {
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
export default class ScomImage extends Module implements PageBlock {
  private data: IImage = {
    url: '',
    altText: '',
    backgroundColor: '',
    link: ''
  }
  private oldData: IImage = {
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
  private _oldURl: string = ''
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
    if (scconfig)
      setDataFromSCConfig(scconfig);
  }
  
  init() {
    super.init()
    this.setTag({width: '100%', height: 'auto'});
    this.url = this.getAttribute('url', true);
    this.altText = this.getAttribute('altText', true);
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
    this.data.url = value || '';
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
    this.setLink();
  }

  getConfigSchema() {
    return configSchema
  }

  getData() {
    return this.data
  }

  private async updateImg() {
    this.uploader.visible = false
    this.linkStack.visible = false
    this.imgLink.visible = true
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

  async setData(value: IImage) {
    if (!this.checkValidation(value)) return
    this.oldData = this.data
    this.data = value
    if (!this.originalUrl) this.originalUrl = this.data.url

    const uploader = document.getElementById('uploader')
    const imageElm = uploader?.getElementsByTagName('img')[0]
    if (imageElm) imageElm.src = value.url
    else this.edtLink.value = value.url
    this.updateImg()
    this.pnlImage.background.color = value.backgroundColor || ''
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

  getTag() {
    return this.tag
  }

  async setTag(value: any) {
    this.tag = value;
    if (this.img) {
      this.img.display = "block";
      this.img.width = this.tag.width;
      this.img.height = this.tag.height;
    }
  }

  getActions() {
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
        userInputDataSchema: cropSchema as IDataSchema
      },
      // {
      //   name: 'Insert Link',
      //   icon: 'link',
      //   command: (builder: any, userInputData: any) => {
      //     return {
      //       execute: () => {
      //         this._oldLink = this.data.link;
      //         this.data.link = userInputData;
      //       },
      //       undo: () => {
      //         this.data.link = this._oldLink;
      //       },
      //       redo: () => {}
      //     }
      //   },
      //   userInputDataSchema: {
      //     type: 'string' as any,
      //   },
      // },
      // {
      //   name: 'Replace image',
      //   icon: 'pencil-alt',
      //   command: (builder: any, userInputData: any) => {
      //     return {
      //       execute: () => {
      //         this._oldURl = this.data.url;
      //         this.data.url = userInputData;
      //       },
      //       undo: () => {
      //         this.data.url = this._oldURl;
      //       },
      //       redo: () => {}
      //     }
      //   },
      //   userInputDataSchema: {
      //     type: 'string' as any,
      //   },
      // },
      // {
      //   name: 'Add alt text',
      //   icon: 'plus',
      //   command: (builder: any, userInputData: any) => {
      //     return {
      //       execute: () => {
      //         this._oldAltText = this.img.getAttribute('alt');
      //         this.data.altText = userInputData.description;
      //         this.img.setAttribute('alt', userInputData.description);
      //       },
      //       undo: () => {
      //         this.data.altText = this._oldAltText;
      //       },
      //       redo: () => {}
      //     }
      //   },
      //   userInputDataSchema: {
      //     type: 'object' as any,
      //     description: 'Alt text is accessed by screen readers for people who might have trouble seeing your content',
      //     properties: {
      //       "description": {
      //         type: 'string' as any
      //       }
      //     }
      //   }
      // },
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          return {
            execute: () => {
              if (builder?.setData) builder.setData(userInputData);
              this.setData(userInputData);
            },
            undo: () => {
              if (builder?.setData) builder.setData(this.oldData);
              this.setData(this.oldData);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: settingSchema as IDataSchema
      }
    ]
    return actions
  }

  checkValidation(value: IImage): boolean {
    return !!value.url;
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
    this._oldURl = this.data.url;
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
    this._oldURl = this.edtLink.value || ''
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
