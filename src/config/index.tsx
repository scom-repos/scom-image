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
import { IType, IUnsplashPhoto, UploadType } from './interface';
import { IImage } from '../interface';
import { filterUnsplashPhotos, getIPFSGatewayUrl, getRandomKeyword, getUnsplashPhotos } from '../store';
const Theme = Styles.Theme.ThemeVars;

interface ScomImageConfigElement extends ControlElement {
  cid?: string;
  url: string;
  photoId?: string;
  keyword?: string;
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
  private imageGrid: GridLayout;
  private typeModal: Modal;
  private typeStack: VStack;
  private unsplashPnl: Panel;
  private normalPnl: Panel;
  private imgEl: Image;
  private pnlEditor: Panel;
  private pnlImage: Panel;
  private imgUploader: Upload;
  private imgLinkInput: Input;
  private goButton: Button;
  private searchInput: Input;
  private pnlUpload: Panel;

  private typeList = [
    {
      type: UploadType.UPLOAD,
      caption: 'Image upload or URL',
      icon: {name: 'image' as any, width: 16, height: 16, fill: Theme.colors.primary.main}
    },
    {
      type: UploadType.UNSPLASH,
      caption: 'Unsplash images',
      icon: {name: 'images' as any, width: 16, height: 16, fill: Theme.colors.primary.main}
      // icon: {image: {url: assets.fullPath('img/unsplash.svg'),  width: 16, height: 16}}
    }
  ]
  private currentType = this.typeList[0];
  private typeMapper:  Map<string, HStack>;
  private photoList: IUnsplashPhoto[] = [];
  private selectedPhoto: Panel = null;
  private currentPage: number = 1;

  private _data: IImage;

  private searchTimer: any = null;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onShowType = this.onShowType.bind(this);
  }

  get data() {
    return this._data;
  }
  set data(value: IImage) {
    this._data = value;
  }

  get url() {
    return this._data.url ?? '';
  }
  set url(value: string) {
    this._data.url = value ?? '';
    this.updateImg();
  }

  async setData(value: IImage) {
    this._data = value;
    const unsplashRegex = /^https:\/\/images\.unsplash\.com\/\S*/g;
    this.updateCurrentType(this.data.photoId || unsplashRegex.test(this.url) ? this.typeList[1] : this.typeList[0]);
    await this.renderUI();
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
          border={{radius: '0.375rem'}}
          onClick={(source: Control) => this.onTypeSelected(source, type)}
        >
          <i-icon name="check" width={14} height={14} fill={Theme.text.primary} opacity={0} class="check-icon"></i-icon>
          <i-button
            width="100%"
            padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
            border={{width: '1px', style: 'none', color: Theme.divider, radius: '0.375rem'}}
            icon={type.icon}
            caption={type.caption}
            boxShadow='none'
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
    this.updateCurrentType(data);
    this.renderUI();
  }

  private async updateCurrentType(type: IType) {
    const oldType = this.typeMapper.get(this.currentType.type);
    if (oldType) oldType.classList.remove('is-actived');
    this.currentType = {...type};
    const currentType = this.typeMapper.get(this.currentType.type);
    if (currentType) currentType.classList.add('is-actived');
    this.typeButton.caption = this.currentType.caption;
    this.typeButton.icon = await Icon.create({...this.currentType.icon});
  }

  private onShowType(target: Control, event: MouseEvent) {
    event.preventDefault();
    this.typeModal.visible = !this.typeModal.visible;
  }

  private async renderUI() {
    if (this.currentType.type === UploadType.UNSPLASH) {
      this.searchInput.value = this.data.keyword || '';
      await this.onFetchPhotos();
      this.unsplashPnl.visible = true;
      this.normalPnl.visible = false;
    } else {
      this.unsplashPnl.visible = false;
      this.normalPnl.visible = true;
      this.onToggleImage(!!this.data.url)
    }
    this.updateImg();
    this.pnlUpload.visible = this._data.canUpload === true;
    this.typeModal.refresh();
  }

  private updateImg() {
    if (this.currentType.type === UploadType.UPLOAD) {
      if (this.data.url) {
        const url = this.getImgSrc();
        this.imgEl.url = url;
      } else {
        this.imgUploader.clear();
        this.imgLinkInput.value = '';
        this.goButton.enabled = false;
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

  private async renderGrid(photoList: IUnsplashPhoto[]) {
    const placeholders = this.imageGrid.querySelectorAll('.image-placeholder');
    for (let placeholder of placeholders) placeholder.remove();
    if (!photoList?.length) return;
    for (let photo of photoList) {
      this.imageGrid.appendChild(
        <i-panel
          border={{radius: '0.25rem'}}
          height={100}
          background={{image: photo.urls.thumb}}
          onClick={(source: Panel) => this.onPhotoSelected(source, photo)}
          class={`${this._data?.photoId && photo.id === this._data.photoId ? 'image-item img-actived' : 'image-item'}`}
        >
          <i-vstack
            border={{radius: '0.25rem'}}
            position='absolute'
            width="100%" height="100%"
            left="0px"
            bottom="0px"
            zIndex={90}
            background={{color: 'rgba(0, 0, 0, 0.5)'}}
            horizontalAlignment="center" verticalAlignment="center"
            class="img-fade"
          >
            <i-icon name="check" fill="#fff" width="14px" height="14px"></i-icon>
          </i-vstack>
          <i-vstack
            position='absolute'
            width="100%" height="100%"
            left="0px"
            bottom="0px"
            zIndex={99}
            verticalAlignment="end"
            class="image-content"
          >
            <i-hstack
              verticalAlignment="center" gap="0.25rem"
              padding={{top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem'}}
              background={{color: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)'}}
              class="overflow"
            >
              <i-label link={{href: `https://unsplash.com/@${photo.user.username}`}}>
                <i-icon name='external-link-alt' width={12} height={12} fill={'#fff'}></i-icon>
              </i-label>
              <i-label caption={photo.user.name} font={{color: '#fff', size: '0.75rem'}} class="overflow"></i-label>
            </i-hstack>
          </i-vstack>
        </i-panel>
      )
    }
  }

  private onPhotoSelected(source: Panel, photo: IUnsplashPhoto) {
    if (this.selectedPhoto)
      this.selectedPhoto.classList.remove('img-actived');
    this.url = photo.urls.regular;
    this.data.altText = photo.alt_description;
    this.data.photoId = photo.id;
    source.classList.add('img-actived');
    this.selectedPhoto = source;
  }

  private async onLoadMore() {
    ++this.currentPage;
    this.renderPlaceholders();
    const newData = await getUnsplashPhotos({page: this.currentPage});
    this.renderGrid([...newData]);
  }

  private onSearchPhoto() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.onFetchPhotos(), 1000)
  }

  private async onFetchPhotos(keyword?: string) {
    this.data.keyword = keyword || this.searchInput.value;
    this.imageGrid.clearInnerHTML();
    this.renderPlaceholders();
    const response = await filterUnsplashPhotos({query: this.data.keyword});
    this.imageGrid.clearInnerHTML();
    this.photoList = response?.results || [];
    this.renderGrid([...this.photoList]);
  }

  private renderPlaceholders() {
    for (let i = 0; i < 18; i++) {
      this.imageGrid.appendChild(
        <i-panel class="image-placeholder" height="100px" border={{radius: '0.25rem'}}></i-panel>
      )
    }
  }

  private async onSurpriseClicked() {
    this.onFetchPhotos(getRandomKeyword());
  }

  // For uploader
  private onToggleImage(value: boolean) {
    this.pnlEditor.visible = !value;
    this.pnlImage.visible = value;
  }

  private onGoClicked() {
    this.url = this.imgLinkInput.value;
    this.data.photoId = '';
    this.onToggleImage(true);
  }

  private async onChangedImage(control: Control, files: any[]) {
    let newUrl = '';
    if (files && files[0]) {
      newUrl = (await this.imgUploader.toBase64(files[0])) as string;
      this.data.photoId = '';
      this.onToggleImage(true);
    }
    this.url = newUrl;
  }

  private onReplaceImage() {
    this.imgUploader.clear();
    this.url = '';
    this.onToggleImage(false);
  }

  private onChangedLink() {
    this.goButton.enabled = this.imgLinkInput.value;
  }

  disconnecedCallback(): void {
    super.disconnectedCallback();
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  async init() {
    super.init();
    this.renderType();
    const cid = this.getAttribute('cid', true);
    const url = this.getAttribute('url', true);
    const keyword = this.getAttribute('keyword', true);
    const photoId = this.getAttribute('photoId', true);
    await this.setData({ cid, url, keyword, photoId });
  }

  render() {
    return (
      <i-panel>
        <i-vstack>
          <i-panel margin={{bottom: '1.5rem'}} class="type-pnl" stack={{grow: '1'}}>
            <i-button
              id="typeButton"
              height={40} width="100%"
              border={{width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem'}}
              background={{color: 'transparent'}}
              rightIcon={{name: 'angle-down', width: 16, height: 16, fill: Theme.text.primary, margin: {left: 'auto'}}}
              onClick={this.onShowType}
              padding={{left: 12, right: 12}}
              class="shadow-btn"
            ></i-button>
            <i-modal
              id="typeModal"
              showBackdrop={false}
              width='100%'
              minWidth={200}
              popupPlacement="bottomLeft"
              visible={false}
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
                  onKeyUp={this.onSearchPhoto.bind(this)}
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
                templateColumns={['repeat(auto-fill, minmax(min(122px, 100%), 1fr))']}
                grid={{horizontalAlignment: 'center'}}
                gap={{row: '0.5rem', column: '0.5rem'}}
              ></i-grid-layout>
              <i-hstack horizontalAlignment="center" margin={{top: '1rem'}}>
                <i-button
                  id="loadMoreButton"
                  height={40} width="45%"
                  border={{width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem'}}
                  font={{color: Theme.text.primary}}
                  caption='Load more'
                  background={{color: 'transparent'}}
                  class="shadow-btn"
                  onClick={this.onLoadMore.bind(this)}
                ></i-button>
              </i-hstack>
              <i-hstack horizontalAlignment='center' gap="4px" padding={{top: 30, bottom: 10}}>
                <i-label caption='Photos from'></i-label>
                <i-label caption='Unsplash' link={{href: 'https://unsplash.com/'}}></i-label>
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
                      id="goButton"
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
                <i-vstack id="pnlUpload" gap="1rem" visible={false}>
                  <i-label caption='Upload' font={{size: '1.25rem', weight: 'bold'}}></i-label>
                  <i-upload
                    id={'imgUploader'}
                    multiple={false}
                    height={'100%'}
                    caption='Drag a file or click to upload'
                    minWidth="auto"
                    draggable={true}
                    onChanged={this.onChangedImage}
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
                  onClick={this.onReplaceImage.bind(this)}
                ></i-button>
              </i-vstack>
            </i-panel>
          </i-panel>
        </i-vstack>
      </i-panel>
    )
  }
}
