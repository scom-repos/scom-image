import {
  Module,
  Panel,
  Image,
  Input,
  Upload,
  Control,
  customModule,
  Modal,
  HStack,
  Label,
} from '@ijstech/components'
import { IImage, PageBlock } from '@image/global'
import './index.css'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-section-image']: ImageBlock
    }
  }
}

const configSchema = {
  type: 'object',
  required: [],
  properties: {
    width: {
      type: 'string',
    },
    height: {
      type: 'string',
    },
    position: {
      type: 'string',
      enum: ['left', 'center', 'right'],
    },
  },
}

@customModule
export class ImageBlock extends Module implements PageBlock {
  private data: IImage = {
    url: '',
    altText: '',
    backgroundColor: '',
    height: 0,
    width: 0,
    link: ''
  }
  private uploader: Upload
  private img: Image
  private linkStack: Panel
  private edtLink: Input
  private pnlImage: Panel
  private imgLink: Label

  private _oldX: number = 0
  private _oldY: number = 0
  private _oldWidth: number = 0
  private _oldHeight: number = 0
  private _oldLink: string = ''
  private _oldURl: string = ''
  private _oldAltText: string = ''
  tag: any

  init() {
    super.init()
  }

  getConfigSchema() {
    return configSchema
  }

  async getData() {
    return this.data
  }

  async setData(value: IImage) {
    console.log('set data', value)
    this.data = value

    const uploader = document.getElementById('uploader')
    const imageElm = uploader?.getElementsByTagName('img')[0]
    if (imageElm) imageElm.src = value.url
    else this.edtLink.value = value.url

    this.uploader.visible = false
    this.linkStack.visible = false
    this.img.visible = true
    this.img.url = value.url
    this.img.setAttribute('alt', value.altText || '')
  }

  getTag() {
    return this.tag
  }

  async setTag(value: any) {
    this.tag = value
    if (this.img) {
      this.img.display = 'flex'
      this.img.width = this.tag.width
      this.img.height = this.tag.height
      switch (this.tag.align) {
        case 'left':
          this.img.margin = { right: 'auto' }
          break
        case 'center':
          this.img.margin = { left: 'auto', right: 'auto' }
          break
        case 'right':
          this.img.margin = { left: 'auto' }
          break
      }
    }
    // if (backgroundColor)
    //     this.pnlImage.background.color = backgroundColor;
    // if (url)
    //     this.imgLink.link = new Link(this, { href: url, target: '_blank' })
  }

  private saveImgData(x: number, y: number, width: number, height: number) {
    this._oldX = x;
    this._oldY = y;
    this._oldWidth = width;
    this._oldHeight = height;
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
              const { x, y, width, height } = this.img.getBoundingClientRect();
              this.saveImgData(x, y, width, height);
              const { x: newX, y: newY, width: newWidth, height: newHeight } = userInputData;
              this.onCrop(newX, newY, newWidth, newHeight);
            },
            undo: () => {
              if (!userInputData) return;
              const { x, y, width, height } = this.img.getBoundingClientRect();
              this.onCrop(this._oldX, this._oldY, this._oldWidth, this._oldHeight);
              this.saveImgData(x, y, width, height);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: {
          type: 'object' as any,
          properties: {
            "x": {
              type: 'number' as any
            },
            "y": {
              type: 'number' as any
            },
            "width": {
              type: 'number' as any
            },
            "height": {
              type: 'number' as any
            }
          },
        },
      },
      {
        name: 'Insert Link',
        icon: 'link',
        command: (builder: any, userInputData: any) => {
          return {
            execute: () => {
              this._oldLink = this.data.link;
              this.data.link = userInputData;
            },
            undo: () => {
              const _oldLink = this.data.link;
              this.data.link = this._oldLink;
              this._oldLink = _oldLink;
            },
            redo: () => {}
          }
        },
        userInputDataSchema: {
          type: 'string' as any,
        },
      },
      {
        name: 'Replace image',
        icon: 'pencil-alt',
        command: (builder: any, userInputData: any) => {
          return {
            execute: () => {
              this._oldURl = this.data.url;
              this.data.url = userInputData;
            },
            undo: () => {
              const _oldURl = this.data.url;
              this.data.url = this._oldURl;
              this._oldURl = _oldURl;
            },
            redo: () => {}
          }
        },
        userInputDataSchema: {
          type: 'string' as any,
        },
      },
      {
        name: 'Add alt text',
        icon: 'plus',
        command: (builder: any, userInputData: any) => {
          return {
            execute: () => {
              this._oldAltText = this.img.getAttribute('alt');
              this.data.altText = userInputData.description;
              this.img.setAttribute('alt', userInputData.description);
            },
            undo: () => {
              const oldAltText = this.data.altText;
              this.img.setAttribute('alt', this._oldAltText);
              this.data.altText = this._oldAltText;
              this._oldAltText = oldAltText;
            },
            redo: () => {}
          }
        },
        userInputDataSchema: {
          type: 'object' as any,
          description: 'Alt text is accessed by screen readers for people who might have trouble seeing your content',
          properties: {
            "description": {
              type: 'string' as any
            }
          }
        }
      },
    ]
    return actions
  }

  async edit() {
    if (!this.uploader) return
    this._oldURl = this.img.url
    this.img.visible = false
    this.uploader.visible = true
    this.linkStack.visible = true
  }

  private async onChangedImage(control: Control, files: any[]) {
    // TODO
    if (files && files[0]) {
      this.data.url = (await this.uploader.toBase64(files[0])) as string
    }
    let img_uploader = this.uploader.getElementsByTagName('img')[0]
    this._oldURl = img_uploader.src
    this.setData({...this.data})
  }

  private onRemovedImage(control: Control, file: File) {
    // TODO
    this.data.url = this.edtLink.value || ''
    this._oldURl = this.edtLink.value || ''
  }

  private onCrop(newX: number, newY: number, newWidth: number, newHeight: number) {
    let img_uploader = this.uploader.getElementsByTagName('img')[0]

    // originalImage in form of img
    const originalImage = document.createElement('img')
    if (this.img.url != undefined && this.img.url != null)
      originalImage.src = this.img.url
    else originalImage.src = img_uploader.src || this.data.url

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

    this.img.url = canvas!.toDataURL()
    img_uploader.src = canvas!.toDataURL()
  }

  private onChangedLink(source: Control) {
    const url = (source as Input).value
    this.setData({...this.data, url})
  }

  render() {
    return (
      <i-panel>
        <i-vstack id={'pnlImage'}>
          <i-upload
            id={'uploader'}
            multiple={true}
            height={'100%'}
            onChanged={this.onChangedImage}
            onRemoved={this.onRemovedImage}
          ></i-upload>
          <i-label id="imgLink" display="block" maxHeight="100%" maxWidth="100%">
            <i-image
              id={'img'}
              visible={false}
              margin={{ bottom: '1rem' }}
              maxHeight="100%" maxWidth="100%"
              class="custom-img"
            ></i-image>
          </i-label>
          <i-panel id='linkStack'>
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
