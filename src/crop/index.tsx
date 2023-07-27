import {
  Module,
  Panel,
  Image,
  customModule,
  Container,
  ControlElement,
  customElements,
  Control,
} from '@ijstech/components'
import './index.css'
import { IImage, ICropData } from '../interface'
import { getIPFSGatewayUrl } from '../store'

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

  private img: Image
  private pnlCropWrap: Panel
  private pnlCropMask: Panel
  private currentResizer: Control

  private _mouseMoveHandler: any
  private _mouseUpHandler: any

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
    this.isResizing = !!resizer

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
    switch (dock) {
      case 'left':
        newWidth = this._origWidth - offsetX
        this.updateDimension(newWidth)
        this.updatePosition(this._origLeft + offsetX)
        break
      case 'top':
        newHeight = this._origHeight - offsetY
        this.updateDimension(undefined, newHeight)
        this.updatePosition(undefined, this._origTop + offsetY)
        break
      case 'right':
        newWidth = this._origWidth + offsetX
        this.updateDimension(newWidth)
        this.updatePosition(this._origLeft + offsetX)
        break
      case 'bottom':
        newHeight = this._origHeight + offsetY
        this.updateDimension(undefined, newHeight)
        this.updatePosition(undefined, this._origTop + offsetY)
        break
      case 'topLeft':
        newWidth = this._origWidth - offsetX
        newHeight = this._origHeight - offsetY
        this.updateDimension(newWidth, newHeight)
        this.updatePosition(this._origLeft + offsetX, this._origTop + offsetY)
        break
      case 'topRight':
        newWidth = this._origWidth + offsetX
        newHeight = this._origHeight - offsetY
        this.updateDimension(newWidth, newHeight)
        this.updatePosition(this._origLeft + offsetX, this._origTop + offsetY)
        break
      case 'bottomLeft':
        newWidth = this._origWidth - offsetX
        newHeight = this._origHeight + offsetY
        this.updateDimension(newWidth, newHeight)
        this.updatePosition(this._origLeft + offsetX, this._origTop + offsetY)
        break
      case 'bottomRight':
        newWidth = this._origWidth + offsetX
        newHeight = this._origHeight + offsetY
        this.updateDimension(newWidth, newHeight)
        this.updatePosition(this._origLeft + offsetX, this._origTop + offsetY)
        break
    }
    this.pnlCropWrap.refresh()
    this.updateMaskImage()
  }

  private updatePosition(left?: number, top?: number) {
    const containerWidth = this.pnlCropWrap.offsetWidth
    const containerHeight = this.pnlCropWrap.offsetHeight
    const width = this.pnlCropMask.offsetWidth
    const height = this.pnlCropMask.offsetHeight
    if (left !== undefined) {
      const validLeft = left < 0
        ? 0
        : left > containerWidth - width
        ? containerWidth - width
        : left
      this.pnlCropMask.style.left = validLeft + 'px'
    }
    if (top !== undefined) {
      const validTop = top < 0
        ? 0
        : top > containerHeight - height
        ? containerHeight - height
        : top
      this.pnlCropMask.style.top = validTop + 'px'
    }
  }

  private updateDimension(newWidth?: number, newHeight?: number) {
    const containerWidth = this.pnlCropWrap.offsetWidth
    const containerHeight = this.pnlCropWrap.offsetHeight
    if (newWidth !== undefined) {
      const validWidth = newWidth > containerWidth ? containerWidth : newWidth
      this.pnlCropMask.style.width = (validWidth || 5) + 'px'
    }
    if (newHeight !== undefined) {
      const validHeight = newHeight > containerHeight ? containerHeight : newHeight
      this.pnlCropMask.style.height = (validHeight || 5) + 'px'
    }
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
    this.pnlCropWrap.refresh()
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
    const { left, top, width, height } = cropData || this.getPercentValues()
    const containerWidth = this.pnlCropWrap.offsetWidth;
    const containerHeight = this.pnlCropWrap.offsetHeight;
    const leftVal = (left * containerWidth) / 100
    const topVal = (top * containerHeight) / 100
    // TODO: update to percent
    const maskPosition = `${leftVal}px ${topVal}px`
    const maskSize = `${width}% ${height}%`
    const maskStyle = `linear-gradient(rgb(0, 0, 0) 0px, rgb(0, 0, 0) 0px) ${maskPosition} / ${maskSize} no-repeat, linear-gradient(rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 0px)`
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
      aspectRatio: currentWidth / currentHeight
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
    this.renderCropUI()
  }

  get data() {
    return this._data
  }
  set data(value: IImage) {
    this._data = value
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
      const { width, height, left, top } = cropData
      this.pnlCropMask.style.width = `${width}%`
      this.pnlCropMask.style.height = `${height}%`
      this.pnlCropMask.style.left = `${left}%`
      this.pnlCropMask.style.top = `${top}%`
      this.pnlCropWrap.refresh()
      this.updateMaskImage({ width, height, left, top })
    } else {
      this.pnlCropMask.style.width = `100%`
      this.pnlCropMask.style.height = `100%`
      this.pnlCropMask.style.left = `0px`
      this.pnlCropMask.style.top = `0px`
    }
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

  render() {
    return (
      <i-panel id='pnlCropWrap' overflow='hidden' class='custom-mask'>
        <i-panel
          id='pnlCropMask'
          width='100%'
          height='100%'
          maxWidth='100%'
          maxHeight='100%'
          position='absolute'
          zIndex={1}
        >
          <i-panel class='angle angle-nw' tag='topLeft'></i-panel>
          <i-panel class='angle angle-ne' tag='topRight'></i-panel>
          <i-panel class='angle angle-sw' tag='bottomLeft'></i-panel>
          <i-panel class='angle angle-se' tag='bottomRight'></i-panel>
          <i-panel class='angle angle-e' tag='right'></i-panel>
          <i-panel class='angle angle-s' tag='bottom'></i-panel>
          <i-panel class='angle angle-w' tag='left'></i-panel>
          <i-panel class='angle angle-n' tag='top'></i-panel>
        </i-panel>
        <i-image
          id={'img'}
          url={'https://placehold.co/600x400?text=No+Image'}
          maxHeight='100%'
          maxWidth='100%'
          class='custom-img'
        ></i-image>
      </i-panel>
    )
  }
}
