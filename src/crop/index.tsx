import {
  Module,
  Panel,
  Image,
  customModule,
  Container,
  ControlElement,
  customElements,
  Control,
  Styles,
  Input,
  ComboBox,
  IComboItem,
  observable,
  Checkbox
} from '@ijstech/components'
import './index.css'
import { IImage, ICropData, CropType } from '../interface'
import { getIPFSGatewayUrl } from '../store'
import translations from '../translations.json'
const Theme = Styles.Theme.ThemeVars

interface ScomImageCropElement extends ControlElement {
  url: string
  cid?: string
  cropData?: ICropData
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-image-crop']: ScomImageCropElement
    }
  }
}

const MIN_WIDTH = 50
const DEFAULT_ASPECT_RATIO = '1:1'
const cropTypeOptions = [
  {
    value: CropType.PREEFORM,
    label: 'Freeform'
  },
  {
    value: CropType.CIRCLE,
    label: 'Circle'
  }
]

@customModule
@customElements('i-scom-image-crop')
export default class ScomImageCrop extends Module {
  private _data: IImage = { url: '' }
  private _mouseDownPos: { x: number; y: number }
  private _origWidth: number
  private _origHeight: number
  private _origLeft: number
  private _origTop: number
  private isResizing: boolean = false
  private _cropType: CropType = CropType.PREEFORM
  private _isLockedRatio: boolean = false

  private img: Image
  private pnlCropWrap: Panel
  private pnlCropMask: Panel
  private currentResizer: Control
  private ratioInput: Input
  private typeCombobox: ComboBox
  private lockedCheck: Checkbox
  private pnlResizeWrap: Panel

  private _mouseMoveHandler: any
  private _mouseUpHandler: any

  private timer: any;

  @observable()
  private isShown: boolean = true;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this._mouseMoveHandler = this.handleMouseMove.bind(this)
    this._mouseUpHandler = this.handleMouseUp.bind(this)
  }

  static async create(options?: ScomImageCropElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  init() {
    this.i18n.init({ ...translations });
    super.init()
    const cid = this.getAttribute('cid', true)
    const url = this.getAttribute('url', true)
    const cropData = this.getAttribute('cropData', true)
    this.data = {cid, url, cropData}
  }

  protected _handleMouseDown(
    event: MouseEvent,
    stopPropagation?: boolean
  ): boolean {
    const target = event.target as Control
    const resizer = target.closest('.angle') as Control
    const mask = target.closest('#pnlCropMask') as Control
    this._origWidth = this.pnlCropMask.offsetWidth
    this._origHeight = this.pnlCropMask.offsetHeight
    this._origLeft = this.pnlCropMask.offsetLeft
    this._origTop = this.pnlCropMask.offsetTop
    this._mouseDownPos = { x: event.clientX, y: event.clientY }
    this.isResizing = !!resizer && !resizer.classList.contains('angle-center')

    if (resizer) {
      this.currentResizer = resizer
      this.currentResizer.classList.add('highlight')
    }
    if (mask || resizer) {
      document.addEventListener('mousemove', this._mouseMoveHandler)
      document.addEventListener('mouseup', this._mouseUpHandler)
    }
    return super._handleMouseDown(event)
  }

  private handleMouseMove(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    let offsetX = event.clientX - this._mouseDownPos.x
    let offsetY = event.clientY - this._mouseDownPos.y
    if (this.isResizing) this.onResize(offsetX, offsetY)
    else this.onMove(offsetX, offsetY)
  }

  private onResize(offsetX: number, offsetY: number) {
    const dock = this.currentResizer.tag
    let newWidth = 0
    let newHeight = 0
    const containerWidth = this.pnlCropWrap.offsetWidth
    const containerHeight = this.pnlCropWrap.offsetHeight
    const maxWidthRight = containerWidth - this._origLeft
    const maxWidthLeft = this._origLeft + this._origWidth
    const maxHeightTop = this._origTop + this._origHeight
    const maxHeightBottom = containerHeight - this._origTop
    this.resetCurrentPos()
    switch (dock) {
      case 'left':
        newWidth = this._origWidth - offsetX
        this.updateDimension({maxWidth: maxWidthLeft, maxHeight: maxHeightBottom}, newWidth)
        this.updatePosition(this._origLeft + offsetX)
        break
      case 'top':
        newHeight = this._origHeight - offsetY
        if (this.isCircleType) {
          this.updateDimension({}, undefined, newHeight)
          this.updatePosition(this._origLeft + offsetY / 2, this._origTop + offsetY / 2)
        } else {
          // TODO: check
          this.updateDimension({maxHeight: maxHeightTop}, undefined, newHeight)
          this.updatePosition(undefined, this._origTop + offsetY)
        }
        break
      case 'right':
        newWidth = this._origWidth + offsetX
        this.updateDimension({maxWidth: maxWidthRight, maxHeight: maxHeightBottom}, newWidth)
        break
      case 'bottom':
        newHeight = this._origHeight + offsetY
        this.updateDimension({maxHeight: maxHeightBottom}, undefined, newHeight)
        break
      case 'topLeft':
        newWidth = this._origWidth - offsetX
        newHeight = this._origHeight - offsetY
        this.updateDimension({maxWidth: maxWidthLeft, maxHeight: maxHeightTop}, newWidth, newHeight)
        this.updatePosition(this._origLeft + offsetX, this._origTop + offsetY)
        break
      case 'topRight':
        newWidth = this._origWidth + offsetX
        newHeight = this._origHeight - offsetY
        this.updateDimension({maxWidth: maxWidthRight, maxHeight: this.isFixedRatio ? maxHeightBottom : maxHeightTop}, newWidth, newHeight)
        this.updatePosition(undefined, this._origTop + offsetY)
        break
      case 'bottomLeft':
        newWidth = this._origWidth - offsetX
        newHeight = this._origHeight + offsetY
        this.updateDimension({maxWidth: maxWidthLeft, maxHeight: maxHeightBottom}, newWidth, newHeight)
        this.updatePosition(this._origLeft + offsetX)
        break
      case 'bottomRight':
        newWidth = this._origWidth + offsetX
        newHeight = this._origHeight + offsetY
        this.updateDimension({maxWidth: maxWidthRight, maxHeight: maxHeightBottom}, newWidth, newHeight)
        break
    }
    this.pnlResizeWrap.refresh()
    this.updateMaskImage()
  }

  private updatePosition(left?: number, top?: number) {
    this.resetCurrentPos()
    const currentWidth = this.pnlCropMask.offsetWidth
    const isFullCircle = this.isCircleType && this.pnlCropMask.offsetWidth === this.pnlCropWrap.offsetHeight
    if (currentWidth === MIN_WIDTH || isFullCircle) {
      return
    }
    if (left !== undefined) {
      if (this._isLockedRatio && !this.isCircleType) {
        this.pnlCropMask.style.left = 'auto'
        const rightPos = this.pnlCropWrap.offsetWidth - (this._origLeft + this._origWidth)
        this.pnlCropMask.style.right = `${rightPos}px`
      } else {
        const validLeft = left < 0
          ? 0
          : left > this._origLeft + this._origWidth
          ? (this._origLeft + this._origWidth - MIN_WIDTH)
          : left
        this.pnlCropMask.style.left = `${validLeft}px`
      }
    }
    if (top !== undefined) {
      if (this._isLockedRatio && !this.isCircleType) {
        this.pnlCropMask.style.top = 'auto'
        const bottomPos = this.pnlCropWrap.offsetHeight - (this._origTop + this._origHeight)
        this.pnlCropMask.style.bottom = `${bottomPos}px`
      } else {
        const validTop = top < 0
          ? 0
          : top > this._origTop + this._origHeight
          ? (this._origTop + this._origHeight - MIN_WIDTH)
          : top
        this.pnlCropMask.style.top = `${validTop}px`
        this.pnlCropMask.style.bottom = ''
      }
    }
  }

  private resetCurrentPos() {
    this.pnlCropMask.style.left = `${this.pnlCropMask.offsetLeft}px`
    this.pnlCropMask.style.right = ''
    this.pnlCropMask.style.top = `${this.pnlCropMask.offsetTop}px`
    this.pnlCropMask.style.bottom = ''
  }

  private updateDimension(maxValues: any, newWidth?: number, newHeight?: number) {
    const containerWidth = this.pnlCropWrap.offsetWidth;
    const containerHeight = this.pnlCropWrap.offsetHeight;
    let { maxWidth = containerWidth, maxHeight = containerHeight } = maxValues;
    if (this.isFixedRatio) {
      const [widthRatio, heightRatio] = this.aspectRatio.split(':').map(val => Number(val.trim()))
      if (widthRatio > heightRatio) {
        const newMaxHeight = (maxWidth * heightRatio) / widthRatio
        if (newMaxHeight > maxHeight) {
          maxWidth = (maxHeight * widthRatio) / heightRatio
        } else {
          maxHeight = newMaxHeight
        }
      } else if (heightRatio > widthRatio) {
        const newMaxWidth =  (maxHeight * widthRatio) / heightRatio
        if (newMaxWidth > maxWidth) {
          maxHeight = (maxWidth * heightRatio) / widthRatio
        } else {
          maxWidth = newMaxWidth
        }
      } else {
        const minWal = Math.min(maxWidth, maxHeight)
        maxWidth = maxHeight = minWal
      }
    } else {
      this.pnlCropMask.style.maxHeight = maxHeight + 'px'
      this.pnlCropMask.style.maxWidth = maxWidth + 'px'
    }
    if (newWidth !== undefined) {
      const validWidth = newWidth > maxWidth ? maxWidth : newWidth
      this.pnlCropMask.style.width = Math.max(MIN_WIDTH, validWidth) + 'px'
    }
    if (newHeight !== undefined) {
      const validHeight = newHeight > maxHeight ? maxHeight : newHeight
      const height = Math.max(MIN_WIDTH, validHeight)
      this.pnlCropMask.style.height = height + 'px'
      if (this.isCircleType) {
        this.pnlCropMask.style.width = height + 'px'
      }
    }
    if (this._isLockedRatio) {
      this.pnlCropMask.style.height = 'auto'
      this.pnlCropMask.style.aspectRatio = this.aspectRatio.replace(':', '/')
    }
    this.ratioInput.value = this.aspectRatio
  }

  private onMove(offsetX: number, offsetY: number) {
    if (
      this.pnlCropMask.offsetWidth === this.offsetWidth &&
      this.pnlCropMask.offsetHeight === this.offsetHeight
    )
      return
    const { left, top } = this.validatePosition(
      offsetX,
      offsetY,
      this.pnlCropMask.offsetWidth,
      this.pnlCropMask.offsetHeight
    )
    this.pnlCropMask.style.left = `${left}px`
    this.pnlCropMask.style.top = `${top}px`
    this.updateMaskImage()
  }

  private validatePosition(
    dx: number,
    dy: number,
    width: number,
    height: number
  ) {
    let newLeft = 0
    let newTop = 0
    let left = this._origLeft + dx
    let top = this._origTop + dy
    const containerWidth = this.pnlCropWrap.offsetWidth
    const containerHeight = this.pnlCropWrap.offsetHeight
    newLeft =
      left < 0
        ? 0
        : left > containerWidth - width
        ? containerWidth - width
        : left
    newTop =
      top < 0
        ? 0
        : top > containerHeight - height
        ? containerHeight - height
        : top
    return { left: newLeft, top: newTop }
  }

  private updateMaskImage(cropData?: ICropData) {
    let { left, top, width, height, type } = cropData || this.getPercentValues()
    let maskStyle = ''
    if (type === CropType.CIRCLE) {
      const x = left + width / 2
      height = (this.pnlCropMask.offsetHeight / this.pnlCropWrap.offsetHeight) * 100
      const y = top + height / 2
      maskStyle = `radial-gradient(${width}% ${height}% at ${x}% ${y}%, black 50%, rgba(0, 0, 0, 0.4) 50%) no-repeat`
    } else {
      const xSpaces = 100 - width
      const x = xSpaces > 0 ? (left / xSpaces) * 100 : 0
      const ySpaces = 100 - height
      const y = ySpaces > 0 ? (top / ySpaces) * 100 : 0
      const maskPosition = `${x}% ${y}%`
      const maskSize = `${width}% ${height}%`
      maskStyle = `linear-gradient(rgb(0, 0, 0) 0px, rgb(0, 0, 0) 0px) ${maskPosition} / ${maskSize} no-repeat, linear-gradient(rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 0px)`
    }
    this.pnlCropWrap.style.mask = maskStyle
    this.pnlCropWrap.style.webkitMask = maskStyle
  }

  private getPercentValues() {
    const currentParentWidth = this.pnlCropWrap.offsetWidth;
    const currentParentHeight = this.pnlCropWrap.offsetHeight;
    const currentLeft = this.pnlCropMask.offsetLeft
    const currentTop = this.pnlCropMask.offsetTop
    const currentWidth = this.pnlCropMask.offsetWidth
    const currentHeight = this.pnlCropMask.offsetHeight
    return {
      width: (currentWidth / currentParentWidth) * 100,
      height: (currentHeight / currentParentHeight) * 100,
      left: (currentLeft / currentParentWidth) * 100,
      top: (currentTop / currentParentHeight) * 100,
      aspectRatio: this.aspectRatio,
      type: this._cropType,
      locked: this._isLockedRatio
    }
  }

  private handleMouseUp(event: MouseEvent) {
    event.preventDefault()
    this.isResizing = false
    this._mouseDownPos = null
    this.currentResizer = null
    document.removeEventListener('mousemove', this._mouseMoveHandler)
    document.removeEventListener('mouseup', this._mouseUpHandler)
  }

  get url() {
    return this.data.url ?? ''
  }
  set url(value: string) {
    this.data.url = value
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

  get cropData() {
    return this.data.cropData
  }
  set cropData(value: ICropData) {
    this.data.cropData = value
    this._cropType = value.type ?? CropType.PREEFORM
    this.renderCropUI()
  }

  get isCircleType() {
    return this._cropType === CropType.CIRCLE
  }

  get isFixedRatio() {
    return this._isLockedRatio || this.isCircleType
  }

  get aspectRatio() {
    const currentWidth = this.pnlCropMask.offsetWidth
    const currentHeight = this.pnlCropMask.offsetHeight
    let aspectRatio = DEFAULT_ASPECT_RATIO
    if (!this.isCircleType) {
      aspectRatio = this._isLockedRatio ? this.ratioInput.value : `${(currentWidth / currentHeight).toFixed(2)}:1`
    }
    return aspectRatio;
  }

  get data() {
    return this._data
  }
  set data(value: IImage) {
    this._data = value
    this._cropType = value?.cropData?.type ?? CropType.PREEFORM
    this.renderUI()
  }

  private renderUI() {
    const url = this.getImgSrc()
    this.img.url = url
    this.renderCropUI()
  }

  private renderCropUI() {
    const cropData = this.data.cropData || null
    if (cropData) {
      let { width, height, left, top, type, aspectRatio } = cropData
      this.pnlCropMask.style.width = `${width}%`
      this.pnlCropMask.style.height = this.isCircleType ? 'auto' : `${height}%`
      this.pnlCropMask.style.aspectRatio = aspectRatio
      this.pnlResizeWrap.refresh()
      this.pnlCropMask.style.left = `${left}%`
      this.pnlCropMask.style.top = `${top}%`
      this.updateMaskImage({ width, height, left, top, type: type || CropType.PREEFORM, aspectRatio })
    } else {
      this.resetMask()
      this.updateMaskImage()
    }
    this.updateFormUI()
  }

  private resetMask() {
    this.pnlCropMask.style.width = `50%`
    this.pnlCropMask.style.height = `auto`
    this.pnlCropMask.style.aspectRatio = `1/1`
    this.pnlCropMask.style.left = '25%'
    this.pnlResizeWrap.refresh()
    this.pnlCropMask.style.top = `calc(50% - ${this.pnlCropMask.offsetHeight / 2}px)`
  }

  private updateFormUI() {
    const { aspectRatio = DEFAULT_ASPECT_RATIO, type = CropType.PREEFORM, locked = false } = this.data.cropData || {}
    const findedType = cropTypeOptions.find(item => item.value === type)
    this.typeCombobox.selectedItem = findedType
    this.renderTypeUI(aspectRatio)
    this._isLockedRatio = locked
    this.lockedCheck.checked = locked
  }

  private getImgSrc() {
    let url = ''
    if (this.data.cid) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      url = ipfsGatewayUrl + this.data.cid
    } else if (this.data.url?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      url = this.data.url.replace('ipfs://', ipfsGatewayUrl)
    } else {
      url = this.data.url || 'https://placehold.co/600x400?text=No+Image'
    }
    return url
  }

  onCrop() {
    this.cropData = JSON.parse(JSON.stringify(this.getPercentValues()))
  }

  private onTypeChanged() {
    this._cropType = ((this.typeCombobox.selectedItem) as IComboItem).value as CropType
    this.renderTypeUI()
    this.resetMask()
    this.updateMaskImage()
  }

  private renderTypeUI(aspectRatio?: string) {
    if (this.isCircleType) {
      this.pnlCropMask.classList.add('is-circle')
    }
    else {
      this.pnlCropMask.classList.remove('is-circle')
    }
    this.isShown = !this.isCircleType
    this.ratioInput.value = aspectRatio || DEFAULT_ASPECT_RATIO
    this.ratioInput.readOnly = this.isCircleType
  }

  private onInputChanged(source: Input) {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      const value = source.value ?? ''
      if (/(\d+)\s?\:(\d+)\s?/g.test(value)) {
        const [_var, string = '', height = ''] = /(\d+)\s?\:(\d+)\s?/g.exec(value)
        let newWidthRatio = Math.min(Number(string || 1), 100)
        let newHeightRatio = Math.min(Number(height || 1), 100)
        this.pnlCropMask.style.top = 'auto' 
        this.pnlCropMask.style.height = 'auto'
        this.pnlCropMask.style.aspectRatio = `${newWidthRatio}/${newHeightRatio}`
        this.ratioInput.value = `${newWidthRatio}:${newHeightRatio}`
        this.pnlResizeWrap.refresh()
        this.updateMaskImage()
      }
    }, 500)
  }

  private onLockChanged(source: Checkbox) {
    const isChecked = source.checked
    this._isLockedRatio = isChecked
    this.ratioInput.readOnly = isChecked
    this.updateMaskImage()
  }

  render() {
    return (
      <i-panel>
        <i-panel margin={{bottom: '1rem', top: '1rem'}}>
          <i-grid-layout
            columnsPerRow={3}
            gap={{column: '1rem', row: '1rem'}}
            horizontalAlignment="stretch"
          >
            <i-combo-box
              id="typeCombobox"
              height={40}
              items={cropTypeOptions}
              selectedItem={cropTypeOptions[0]}
              onChanged={this.onTypeChanged}
            ></i-combo-box>
            <i-hstack verticalAlignment="center" gap="0.5rem">
              <i-label caption="$aspect_ratio"></i-label>
              <i-input
                id="ratioInput"
                placeholder={DEFAULT_ASPECT_RATIO}
                stack={{grow: '1', basis: '0%', shrink: '1'}}
                border={{width: '1px', style: 'solid', color: Theme.divider}}
                onChanged={this.onInputChanged}
                height={40}
              ></i-input>
            </i-hstack>
            <i-hstack verticalAlignment="center" gap="0.5rem">
              <i-checkbox
                id="lockedCheck"
                caption="$lock_aspect_ratio"
                onChanged={this.onLockChanged}
              ></i-checkbox>
            </i-hstack>
          </i-grid-layout>
        </i-panel>
        <i-vstack position="relative" width='100%' height='100%'>
          <i-vstack id="pnlResizeWrap" width='100%'>
            <i-panel
              id='pnlCropMask'
              width='50%'
              height="auto"
              maxWidth='100%'
              maxHeight='100%'
              position='absolute'
              zIndex={1}
            >
              <i-panel class='angle angle-nw' tag='topLeft' visible={this.isShown}></i-panel>
              <i-panel class='angle angle-ne' tag='topRight' visible={this.isShown}></i-panel>
              <i-panel class='angle angle-sw' tag='bottomLeft' visible={this.isShown}></i-panel>
              <i-panel class='angle angle-se' tag='bottomRight' visible={this.isShown}></i-panel>
              <i-panel class='angle angle-e' tag='right' visible={this.isShown}></i-panel>
              <i-panel class='angle angle-s' tag='bottom' visible={this.isShown}></i-panel>
              <i-panel class='angle angle-w' tag='left' visible={this.isShown}></i-panel>
              <i-panel class='angle angle-n' tag='top'></i-panel>
              <i-panel class='angle angle-center'></i-panel>
            </i-panel>
          </i-vstack>
          <i-panel id='pnlCropWrap' overflow='hidden' class='custom-mask'>
            <i-image
              id={'img'}
              url={'https://placehold.co/600x400?text=No+Image'}
              maxWidth='100%'
              display="flex"
              class='custom-img'
            ></i-image>
          </i-panel>
        </i-vstack>
      </i-panel> 
    )
  }
}
