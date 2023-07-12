import {
  Module,
  customModule,
  ControlElement,
  customElements,
  Input,
  Button,
  Styles,
  GridLayout,
  Modal,
  VStack,
  Control,
  HStack,
  Container,
  Panel,
  Icon,
  Upload,
  Image
} from '@ijstech/components'
import './index.css'
import assets from '../assets';
import { IType, UploadType } from './interface';
import { IImage } from '../interface';
import { getIPFSGatewayUrl, getUnsplashPhotos } from '../store';
const Theme = Styles.Theme.ThemeVars;

interface ScomImageConfigElement extends ControlElement {
  cid?: string;
  url: string;
	altText?: string;
	link?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-image-config"]: ScomImageConfigElement;
    }
  }
}

@customModule
@customElements('i-scom-image-config')
export default class ScomImageConfig extends Module {
  private typeButton: Button;
  private searchInput: Input;
  private imageGrid: GridLayout;
  private typeModal: Modal;
  private typeStack: VStack;
  private unsplashPnl: Panel;
  private normalPnl: Panel;
  private imgEl: Image;
  private pnlEditor: Panel;
  private pnlImage: Panel;
  private replaceBtn: Button;
  private imgUploader: Upload;
  private imgLinkInput: Input;
  private goBtn: Button;

  private typeList = [
    {
      type: UploadType.UPLOAD,
      caption: 'Image upload or URL',
      icon: {name: 'image' as any, width: 16, height: 16, fill: Theme.colors.primary.main}
    },
    {
      type: UploadType.UNPLASH,
      caption: 'Unplash images',
      icon: {image: {url: assets.fullPath('img/unsplash.svg'),  width: 16, height: 16}}
    }
  ]
  private currentType = this.typeList[0];
  private typeMapper:  Map<string, HStack>;
  private _data: IImage;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  get data() {
    return this._data;
  }
  set data(value: IImage) {
    this._data = value;
    this.renderUI();
  }

  get url() {
    return this._data.url ?? '';
  }
  set url(value: string) {
    this._data.url = value ?? '';
    this.updateImg();
  }

  get altText() {
    return this._data.altText ?? '';
  }
  set altText(value: string) {
    this._data.altText = value;
  }

  get link() {
    return this._data.link ?? '';
  }
  set link(value: string) {
    this._data.link = value;
  }

  private async renderType() {
    this.typeMapper = new Map();
    this.typeStack.clearInnerHTML();
    this.typeStack.appendChild(<i-label caption='Image' font={{weight: 600, color: Theme.text.secondary}}></i-label>)
    for (let type of this.typeList) {
      const hstack = (
        <i-hstack
          verticalAlignment='center' gap="0.5rem"
          class={`${type.type === this.currentType.type ? 'type-item is-actived' : 'type-item'}`}
          padding={{left: '0.5rem', right: '0.5rem'}}
          onClick={(source: Control) => this.onTypeSelected(source, type)}
        >
          <i-icon name="check" width={14} height={14} fill={Theme.text.primary} opacity={0} class="check-icon"></i-icon>
          <i-button
            width="100%"
            padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
            border={{width: '1px', style: 'none', color: Theme.divider, radius: '0.375rem'}}
            icon={type.icon}
            caption={type.caption}
            background={{color: 'transparent'}}
          ></i-button>
        </i-hstack>
      )
      this.typeStack.appendChild(hstack);
      this.typeMapper.set(type.type, hstack);
    }
    this.typeButton.caption = this.currentType.caption;
    this.typeButton.icon = await Icon.create({...this.currentType.icon});
  }

  private async onTypeSelected(source: Control, data: IType) {
    this.typeModal.visible = false;
    const oldType = this.typeMapper.get(this.currentType.type);
    if (oldType) oldType.classList.remove('is-actived');
    this.currentType = {...data};
    source.classList.add('is-actived');
    this.typeButton.caption = this.currentType.caption;
    this.typeButton.icon = await Icon.create({...this.currentType.icon});
    this.renderUI();
  }

  private onShowType() {
    this.typeModal.visible = !this.typeModal.visible;
  }

  private renderUI() {
    if (this.currentType.type === UploadType.UNPLASH) {
      this.renderGrid();
      this.unsplashPnl.visible = true;
      this.normalPnl.visible = false;
    } else {
      this.unsplashPnl.visible = false;
      this.normalPnl.visible = true;
      this.onToggleImage(!!this.data.url)
    }
    this.updateImg();
  }

  private updateImg() {
    if (this.currentType.type === UploadType.UNPLASH) {
    } else {
      if (this.data.url) {
        const url = this.getImgSrc();
        console.log(this.data.url, url)
        this.imgEl.url = url;
      } else {
        this.imgUploader.clear();
        this.imgLinkInput.value = '';
        this.goBtn.enabled = false;
      }
    }
  }

  private getImgSrc() {
    let url = ''
    if (this.data.cid) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      url = ipfsGatewayUrl + this.data.cid;
    } else if (this.data.url?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl()
      url = this.data.url.replace('ipfs://', ipfsGatewayUrl)
    } else {
      url = this.data.url || 'https://placehold.co/600x400?text=No+Image'
    }
    return url;
  }

  private async renderGrid() {
    this.imageGrid.clearInnerHTML();
    const photoList = await getUnsplashPhotos();
    console.log(photoList)
    if (photoList.length) {
      for (let photo of photoList) {
        const image = <i-image
          url={photo.urls.thumb}
          width="100%"
        ></i-image>
        image.setAttribute('alt', photo.alt_description);
        this.imageGrid.appendChild(
          <i-panel
            border={{radius: '0.25rem'}}
          >
            <i-vstack
              position='absolute'
              width="100%" height="100%"
              left="0px"
              bottom="0px"
              horizontalAlignment="end"
            >
              <i-hstack
                verticalAlignment="center" gap="0.25rem"
                padding={{top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem'}}
                background={{color: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)'}}
                class="overflow"
              >
                <i-label link={{href: `https://unsplash.com/@${photo.user.username}`}}>
                  <i-icon name='link' width={12} height={12} fill={'#fff'}></i-icon>
                </i-label>
                <i-label caption={photo.user.name} font={{color: '#fff', size: '0.75rem'}}></i-label>
              </i-hstack>
            </i-vstack>
            {image}
          </i-panel>
        )
      }
    }
  }

  private onSurpriseClicked() {}

  private onToggleImage(value: boolean) {
    this.pnlEditor.visible = !value;
    this.pnlImage.visible = value;
  }

  private onGoClicked() {
    this.url = this.imgLinkInput.value;
    this.onToggleImage(true);
  }

  private async onChangedImage(control: Control, files: any[]) {
    let newUrl = '';
    if (files && files[0]) {
      newUrl = (await this.imgUploader.toBase64(files[0])) as string;
      this.onToggleImage(true);
    }
    this.url = newUrl;
  }

  private onRemovedImage(control: Control, file: File) {
    this.url = '';
  }

  private onReplaceImage() {
    this.imgUploader.clear();
    this.url = '';
  }

  private onChangedLink() {
    this.goBtn.enabled = this.imgLinkInput.value;
  }

  private onLoadMore() {}

  init() {
    super.init();
    this.renderType();
    let cid = this.getAttribute('cid', true);
    const ipfsGatewayUrl = getIPFSGatewayUrl()
    const url = this.getAttribute('url', true) || cid ? ipfsGatewayUrl + cid : "";
    const altText = this.getAttribute('altText', true);
    this.data = { url, altText };
  }

  render() {
    return (
      <i-panel>
        <i-vstack>
          <i-panel margin={{bottom: '1.5rem'}} class="type-pnl">
            <i-button
              id="typeButton"
              height={40} width="100%"
              border={{width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem'}}
              background={{color: 'transparent'}}
              rightIcon={{name: 'angle-down', width: 16, height: 16, fill: Theme.text.primary, margin: {left: 'auto'}}}
              onClick={this.onShowType.bind(this)}
              class="shadow-btn"
            ></i-button>
            <i-modal
              id="typeModal"
              showBackdrop={false}
              width='200px'
              popupPlacement="bottomLeft"
            >
              <i-vstack id="typeStack" gap="0.5rem" padding={{left: '1rem', right: '1rem'}}></i-vstack>
            </i-modal>
          </i-panel>
          <i-panel>
            <i-panel id="unsplashPnl" visible={false}>
              <i-hstack
                gap={12} verticalAlignment='center' justifyContent="space-between"
                height={40} width="100%"
                padding={{left: 12, right: 12}}
                border={{width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem'}}
              >
                <i-icon name='search' width={16} height={16} fill={Theme.text.primary}></i-icon>
                <i-input
                  id="searchInput"
                  placeholder='Find an image'
                  border={{style: 'none'}}
                  height="100%" width="100%"
                ></i-input>
                <i-button
                  icon={{name: 'surprise', width: 16, height: 16, fill: Theme.colors.primary.main}}
                  border={{radius: '0.375rem', style: 'none', width: '1px', color: Theme.divider}}
                  font={{weight: 600}}
                  background={{color: 'transparent'}}
                  tooltip={{content: 'Surprise me'}}
                  onClick={this.onSurpriseClicked.bind(this)}
                  class="hover-btn"
                ></i-button>
              </i-hstack>
              <i-grid-layout
                id="imageGrid"
                margin={{top: '1rem'}}
                templateColumns={['repeat(3, minmax(0px, 1fr))']}
                gap={{row: '0.5rem', column: '0.5rem'}}
              ></i-grid-layout>
              <i-button
                id="loadMoreButton"
                height={40} width="100%"
                border={{width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem'}}
                font={{color: Theme.text.primary}}
                caption='Load more'
                background={{color: 'transparent'}}
                class="shadow-btn"
                margin={{top: '1rem'}}
                onClick={this.onLoadMore.bind(this)}
              ></i-button>
              <i-hstack horizontalAlignment='center' gap="4px" padding={{top: 30, bottom: 10}}>
                <i-label caption='Photo from'></i-label>
                <i-label caption='Unplash' link={{href: 'https://unsplash.com/'}}></i-label>
              </i-hstack>
            </i-panel>
            <i-panel id="normalPnl" visible={false}>
              <i-vstack id="pnlEditor" gap="1rem">
                <i-vstack gap="1rem">
                  <i-label caption='URL' font={{size: '1.25rem', weight: 'bold'}}></i-label>
                  <i-hstack
                    gap="0.5rem"
                    verticalAlignment="center"
                    horizontalAlignment="space-between"
                  >
                    <i-input
                      id='imgLinkInput'
                      width='100%' height={40}
                      border={{radius: '0.375rem'}}
                      placeholder='Paste on enter image URL'
                      onChanged={this.onChangedLink.bind(this)}
                    ></i-input>
                    <i-button
                      id="goBtn"
                      border={{radius: '0.375rem', style: 'none', width: '1px', color: Theme.divider}}
                      font={{weight: 600}}
                      background={{color: 'transparent'}}
                      height="40px"
                      caption='Go'
                      enabled={false}
                      onClick={this.onGoClicked.bind(this)}
                      class="hover-btn"
                    ></i-button>
                  </i-hstack>
                </i-vstack>
                <i-vstack gap="1rem">
                  <i-label caption='Upload' font={{size: '1.25rem', weight: 'bold'}}></i-label>
                  <i-upload
                    id={'imgUploader'}
                    multiple={false}
                    height={'100%'}
                    caption='Drag a file or click to upload'
                    minWidth="auto"
                    onChanged={this.onChangedImage}
                    onRemoved={this.onRemovedImage}
                  ></i-upload>
                </i-vstack>
              </i-vstack>
              <i-vstack id={'pnlImage'} gap="1rem" visible={false}>
                <i-image
                  id={'imgEl'}
                  url={'https://placehold.co/600x400?text=No+Image'}
                  maxHeight="100%" maxWidth="100%"
                  class="custom-img"
                ></i-image>
                <i-button
                  id="replaceButton"
                  height={40} width="100%"
                  border={{width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem'}}
                  font={{color: Theme.text.primary}}
                  caption='Replace Image'
                  background={{color: 'transparent'}}
                  class="shadow-btn"
                  onClick={this.onReplaceImage}
                ></i-button>
              </i-vstack>
            </i-panel>
          </i-panel>
        </i-vstack>
      </i-panel>
    )
  }
}
