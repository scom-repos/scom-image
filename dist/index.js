var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-image/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CropType = void 0;
    var CropType;
    (function (CropType) {
        CropType["PREEFORM"] = "Freeform";
        CropType["CIRCLE"] = "Circle";
    })(CropType = exports.CropType || (exports.CropType = {}));
});
define("@scom/scom-image/store.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRandomKeyword = exports.filterUnsplashPhotos = exports.getUnsplashPhotos = exports.getUnsplashApiKey = exports.setUnsplashApiKey = exports.getIPFSGatewayUrl = exports.setIPFSGatewayUrl = exports.setDataFromSCConfig = exports.state = void 0;
    ///<amd-module name='@scom/scom-image/store.ts'/> 
    exports.state = {
        ipfsGatewayUrl: "",
        unsplashApiKey: ""
    };
    const setDataFromSCConfig = (options) => {
        if (options.ipfsGatewayUrl) {
            (0, exports.setIPFSGatewayUrl)(options.ipfsGatewayUrl);
        }
        if (options.unsplashApiKey) {
            (0, exports.setUnsplashApiKey)(options.unsplashApiKey);
        }
    };
    exports.setDataFromSCConfig = setDataFromSCConfig;
    const setIPFSGatewayUrl = (url) => {
        exports.state.ipfsGatewayUrl = url;
    };
    exports.setIPFSGatewayUrl = setIPFSGatewayUrl;
    const getIPFSGatewayUrl = () => {
        return exports.state.ipfsGatewayUrl;
    };
    exports.getIPFSGatewayUrl = getIPFSGatewayUrl;
    const setUnsplashApiKey = (key) => {
        exports.state.unsplashApiKey = key;
    };
    exports.setUnsplashApiKey = setUnsplashApiKey;
    const getUnsplashApiKey = () => {
        return exports.state.unsplashApiKey;
    };
    exports.getUnsplashApiKey = getUnsplashApiKey;
    const getUnsplashPhotos = async (params = {}) => {
        if (!params.page)
            params.page = 1;
        if (!params.per_page)
            params.per_page = 18;
        params.client_id = (0, exports.getUnsplashApiKey)();
        const queries = params ? new URLSearchParams({
            ...params
        }).toString() : '';
        try {
            const response = await fetch(`https://api.unsplash.com/photos?${queries}`);
            return await response.json();
        }
        catch {
            return null;
        }
    };
    exports.getUnsplashPhotos = getUnsplashPhotos;
    const filterUnsplashPhotos = async (params = {}) => {
        if (!params.page)
            params.page = 1;
        if (!params.per_page)
            params.per_page = 18;
        if (!params.query)
            params.query = 'nature';
        params.client_id = (0, exports.getUnsplashApiKey)();
        const queries = params ? new URLSearchParams({
            ...params
        }).toString() : '';
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?${queries}`);
            return await response.json();
        }
        catch {
            return null;
        }
    };
    exports.filterUnsplashPhotos = filterUnsplashPhotos;
    const keywords = ['flowers', 'experimental', 'background', 'animals', 'wallpaper', 'nature', 'california', 'water', 'textures'];
    const getRandomKeyword = () => {
        const min = 0;
        const max = keywords.length - 1;
        const index = Math.floor(Math.random() * (max - min) + min);
        return keywords[index];
    };
    exports.getRandomKeyword = getRandomKeyword;
});
define("@scom/scom-image/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-image/data.json.ts'/> 
    exports.default = {
        ipfsGatewayUrl: "https://ipfs.scom.dev/ipfs/",
        unsplashApiKey: 'ylMtikqlCAZdDIxGz-SV15TOfqzf03epdOoE_5hBBUo'
    };
});
define("@scom/scom-image/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    components_1.Styles.cssRule('#pnlImage', {
        $nest: {
            '.custom-img img': {
                objectFit: 'fill',
                objectPosition: 'center',
                width: '100%',
                height: '100%'
            },
            "&.img-wrapper": {
                mask: 'none',
                '-webkit-mask': 'none'
            },
            "&.cropped-pnl": {
                maxWidth: '100%',
                maxHeight: '100%',
                width: '100%',
                overflow: 'hidden',
                $nest: {
                    '.custom-img img': {
                        objectFit: 'contain',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        transformOrigin: 'left top',
                        width: '100%',
                        height: 'auto'
                    }
                }
            }
        }
    });
});
define("@scom/scom-image/config/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    const loadingAnim = components_2.Styles.keyframes({
        'from': {
            backgroundPosition: '0 0'
        },
        'to': {
            backgroundPosition: '1000px 0'
        }
    });
    exports.default = components_2.Styles.cssRule('i-scom-image-config', {
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
                width: '100%',
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
    });
});
define("@scom/scom-image/config/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UploadType = void 0;
    ///<amd-module name='@scom/scom-image/config/interface.ts'/> 
    var UploadType;
    (function (UploadType) {
        UploadType["UPLOAD"] = "upload";
        UploadType["UNSPLASH"] = "unsplash";
    })(UploadType = exports.UploadType || (exports.UploadType = {}));
});
define("@scom/scom-image/config/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-image/config/interface.ts", "@scom/scom-image/store.ts", "@scom/scom-image/config/index.css.ts"], function (require, exports, components_3, interface_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomImageConfig = class ScomImageConfig extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this.typeList = [
                {
                    type: interface_1.UploadType.UPLOAD,
                    caption: 'Image upload or URL',
                    icon: { name: 'image', width: 16, height: 16, fill: Theme.colors.primary.main }
                },
                {
                    type: interface_1.UploadType.UNSPLASH,
                    caption: 'Unsplash images',
                    icon: { name: 'images', width: 16, height: 16, fill: Theme.colors.primary.main }
                    // icon: {image: {url: assets.fullPath('img/unsplash.svg'),  width: 16, height: 16}}
                }
            ];
            this.currentType = this.typeList[0];
            this.photoList = [];
            this.selectedPhoto = null;
            this.currentPage = 1;
            this.searchTimer = null;
            this.onShowType = this.onShowType.bind(this);
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
        }
        get url() {
            return this._data.url ?? '';
        }
        set url(value) {
            this._data.url = value ?? '';
            this.updateImg();
        }
        async setData(value) {
            this._data = value;
            const unsplashRegex = /^https:\/\/images\.unsplash\.com\/\S*/g;
            this.updateCurrentType(this.data.photoId || unsplashRegex.test(this.url) ? this.typeList[1] : this.typeList[0]);
            await this.renderUI();
        }
        async renderType() {
            this.typeMapper = new Map();
            this.typeStack.clearInnerHTML();
            this.typeStack.appendChild(this.$render("i-label", { caption: 'Image', font: { weight: 600, color: Theme.text.secondary } }));
            for (let type of this.typeList) {
                const hstack = (this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.5rem", class: `${type.type === this.currentType.type ? 'type-item is-actived' : 'type-item'}`, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: '0.375rem' }, onClick: (source) => this.onTypeSelected(source, type) },
                    this.$render("i-icon", { name: "check", width: 14, height: 14, fill: Theme.text.primary, opacity: 0, class: "check-icon" }),
                    this.$render("i-button", { width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { width: '1px', style: 'none', color: Theme.divider, radius: '0.375rem' }, icon: type.icon, caption: type.caption, boxShadow: 'none', background: { color: 'transparent' } })));
                this.typeStack.appendChild(hstack);
                this.typeMapper.set(type.type, hstack);
            }
            this.typeButton.caption = this.currentType.caption;
            this.typeButton.icon = await components_3.Icon.create({ ...this.currentType.icon });
        }
        async onTypeSelected(source, data) {
            this.typeModal.visible = false;
            this.updateCurrentType(data);
            this.renderUI();
        }
        async updateCurrentType(type) {
            const oldType = this.typeMapper.get(this.currentType.type);
            if (oldType)
                oldType.classList.remove('is-actived');
            this.currentType = { ...type };
            const currentType = this.typeMapper.get(this.currentType.type);
            if (currentType)
                currentType.classList.add('is-actived');
            this.typeButton.caption = this.currentType.caption;
            this.typeButton.icon = await components_3.Icon.create({ ...this.currentType.icon });
        }
        onShowType(target, event) {
            event.preventDefault();
            this.typeModal.visible = !this.typeModal.visible;
        }
        async renderUI() {
            if (this.currentType.type === interface_1.UploadType.UNSPLASH) {
                this.searchInput.value = this.data.keyword || '';
                await this.onFetchPhotos();
                this.unsplashPnl.visible = true;
                this.normalPnl.visible = false;
            }
            else {
                this.unsplashPnl.visible = false;
                this.normalPnl.visible = true;
                this.onToggleImage(!!this.data.url);
            }
            this.updateImg();
            this.pnlUpload.visible = this._data.canUpload === true;
            this.typeModal.refresh();
        }
        updateImg() {
            if (this.currentType.type === interface_1.UploadType.UPLOAD) {
                if (this.data.url) {
                    const url = this.getImgSrc();
                    this.imgEl.url = url;
                }
                else {
                    this.imgUploader.clear();
                    this.imgLinkInput.value = '';
                    this.goButton.enabled = false;
                }
            }
        }
        getImgSrc() {
            let url = '';
            if (this.data.cid) {
                const ipfsGatewayUrl = (0, store_1.getIPFSGatewayUrl)();
                url = ipfsGatewayUrl + this.data.cid;
            }
            else if (this.data.url?.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_1.getIPFSGatewayUrl)();
                url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                url = this.data.url || 'https://placehold.co/600x400?text=No+Image';
            }
            return url;
        }
        async renderGrid(photoList) {
            const placeholders = this.imageGrid.querySelectorAll('.image-placeholder');
            for (let placeholder of placeholders)
                placeholder.remove();
            if (!photoList?.length)
                return;
            for (let photo of photoList) {
                this.imageGrid.appendChild(this.$render("i-panel", { border: { radius: '0.25rem' }, height: 100, background: { image: photo.urls.thumb }, onClick: (source) => this.onPhotoSelected(source, photo), class: `${this._data?.photoId && photo.id === this._data.photoId ? 'image-item img-actived' : 'image-item'}` },
                    this.$render("i-vstack", { border: { radius: '0.25rem' }, position: 'absolute', width: "100%", height: "100%", left: "0px", bottom: "0px", zIndex: 90, background: { color: 'rgba(0, 0, 0, 0.5)' }, horizontalAlignment: "center", verticalAlignment: "center", class: "img-fade" },
                        this.$render("i-icon", { name: "check", fill: "#fff", width: "14px", height: "14px" })),
                    this.$render("i-vstack", { position: 'absolute', width: "100%", height: "100%", left: "0px", bottom: "0px", zIndex: 99, verticalAlignment: "end", class: "image-content" },
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "0.25rem", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, background: { color: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)' }, class: "overflow" },
                            this.$render("i-label", { link: { href: `https://unsplash.com/@${photo.user.username}` } },
                                this.$render("i-icon", { name: 'external-link-alt', width: 12, height: 12, fill: '#fff' })),
                            this.$render("i-label", { caption: photo.user.name, font: { color: '#fff', size: '0.75rem' }, class: "overflow" })))));
            }
        }
        onPhotoSelected(source, photo) {
            if (this.selectedPhoto)
                this.selectedPhoto.classList.remove('img-actived');
            this.url = photo.urls.regular;
            this.data.altText = photo.alt_description;
            this.data.photoId = photo.id;
            source.classList.add('img-actived');
            this.selectedPhoto = source;
        }
        async onLoadMore() {
            ++this.currentPage;
            this.renderPlaceholders();
            const newData = await (0, store_1.getUnsplashPhotos)({ page: this.currentPage });
            this.renderGrid([...newData]);
        }
        onSearchPhoto() {
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.onFetchPhotos(), 1000);
        }
        async onFetchPhotos(keyword) {
            this.data.keyword = keyword || this.searchInput.value;
            this.imageGrid.clearInnerHTML();
            this.renderPlaceholders();
            const response = await (0, store_1.filterUnsplashPhotos)({ query: this.data.keyword });
            this.imageGrid.clearInnerHTML();
            this.photoList = response?.results || [];
            this.renderGrid([...this.photoList]);
        }
        renderPlaceholders() {
            for (let i = 0; i < 18; i++) {
                this.imageGrid.appendChild(this.$render("i-panel", { class: "image-placeholder", height: "100px", border: { radius: '0.25rem' } }));
            }
        }
        async onSurpriseClicked() {
            this.onFetchPhotos((0, store_1.getRandomKeyword)());
        }
        // For uploader
        onToggleImage(value) {
            this.pnlEditor.visible = !value;
            this.pnlImage.visible = value;
        }
        onGoClicked() {
            this.url = this.imgLinkInput.value;
            this.data.photoId = '';
            this.onToggleImage(true);
        }
        async onChangedImage(control, files) {
            let newUrl = '';
            if (files && files[0]) {
                newUrl = (await this.imgUploader.toBase64(files[0]));
                this.data.photoId = '';
                this.onToggleImage(true);
            }
            this.url = newUrl;
        }
        onReplaceImage() {
            this.imgUploader.clear();
            this.url = '';
            this.onToggleImage(false);
        }
        onChangedLink() {
            this.goButton.enabled = this.imgLinkInput.value;
        }
        disconnecedCallback() {
            super.disconnectedCallback();
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
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
            return (this.$render("i-panel", null,
                this.$render("i-vstack", null,
                    this.$render("i-panel", { margin: { bottom: '1.5rem' }, class: "type-pnl", stack: { grow: '1' } },
                        this.$render("i-button", { id: "typeButton", height: 40, width: "100%", border: { width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem' }, background: { color: 'transparent' }, rightIcon: { name: 'angle-down', width: 16, height: 16, fill: Theme.text.primary, margin: { left: 'auto' } }, onClick: this.onShowType, padding: { left: 12, right: 12 }, class: "shadow-btn" }),
                        this.$render("i-modal", { id: "typeModal", showBackdrop: false, width: '100%', minWidth: 200, popupPlacement: "bottomLeft", visible: false },
                            this.$render("i-vstack", { id: "typeStack", gap: "0.5rem", padding: { left: '1rem', right: '1rem' } }))),
                    this.$render("i-panel", null,
                        this.$render("i-panel", { id: "unsplashPnl", visible: false },
                            this.$render("i-hstack", { gap: 12, verticalAlignment: 'center', justifyContent: "space-between", height: 40, width: "100%", padding: { left: 12, right: 12 }, border: { width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem' } },
                                this.$render("i-icon", { name: 'search', width: 16, height: 16, fill: Theme.text.primary }),
                                this.$render("i-input", { id: "searchInput", placeholder: 'Find an image', border: { style: 'none' }, height: "100%", width: "100%", onKeyUp: this.onSearchPhoto.bind(this) }),
                                this.$render("i-button", { icon: { name: 'surprise', width: 16, height: 16, fill: Theme.colors.primary.main }, border: { radius: '0.375rem', style: 'none', width: '1px', color: Theme.divider }, font: { weight: 600 }, background: { color: 'transparent' }, tooltip: { content: 'Surprise me' }, onClick: this.onSurpriseClicked.bind(this), class: "hover-btn" })),
                            this.$render("i-grid-layout", { id: "imageGrid", margin: { top: '1rem' }, templateColumns: ['repeat(auto-fill, minmax(min(122px, 100%), 1fr))'], grid: { horizontalAlignment: 'center' }, gap: { row: '0.5rem', column: '0.5rem' } }),
                            this.$render("i-hstack", { horizontalAlignment: "center", margin: { top: '1rem' } },
                                this.$render("i-button", { id: "loadMoreButton", height: 40, width: "45%", border: { width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem' }, font: { color: Theme.text.primary }, caption: 'Load more', background: { color: 'transparent' }, class: "shadow-btn", onClick: this.onLoadMore.bind(this) })),
                            this.$render("i-hstack", { horizontalAlignment: 'center', gap: "4px", padding: { top: 30, bottom: 10 } },
                                this.$render("i-label", { caption: 'Photos from' }),
                                this.$render("i-label", { caption: 'Unsplash', link: { href: 'https://unsplash.com/' } }))),
                        this.$render("i-panel", { id: "normalPnl", visible: false },
                            this.$render("i-vstack", { id: "pnlEditor", gap: "1rem" },
                                this.$render("i-vstack", { gap: "1rem" },
                                    this.$render("i-label", { caption: 'URL', font: { size: '1.25rem', weight: 'bold' } }),
                                    this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", horizontalAlignment: "space-between" },
                                        this.$render("i-input", { id: 'imgLinkInput', width: '100%', height: 40, border: { radius: '0.375rem' }, placeholder: 'Paste on enter image URL', onChanged: this.onChangedLink.bind(this) }),
                                        this.$render("i-button", { id: "goButton", border: { radius: '0.375rem', style: 'none', width: '1px', color: Theme.divider }, font: { weight: 600 }, background: { color: 'transparent' }, height: "40px", caption: 'Go', enabled: false, padding: { left: '0.5rem', right: '0.5rem' }, onClick: this.onGoClicked.bind(this), class: "hover-btn" }))),
                                this.$render("i-vstack", { id: "pnlUpload", gap: "1rem", visible: false },
                                    this.$render("i-label", { caption: 'Upload', font: { size: '1.25rem', weight: 'bold' } }),
                                    this.$render("i-upload", { id: 'imgUploader', multiple: false, height: '100%', caption: 'Drag a file or click to upload', minWidth: "auto", draggable: true, onChanged: this.onChangedImage }))),
                            this.$render("i-vstack", { id: 'pnlImage', gap: "1rem", visible: false },
                                this.$render("i-image", { id: 'imgEl', url: 'https://placehold.co/600x400?text=No+Image', maxHeight: "100%", maxWidth: "100%", class: "custom-img" }),
                                this.$render("i-button", { id: "replaceButton", height: 40, width: "100%", border: { width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem' }, font: { color: Theme.text.primary }, caption: 'Replace Image', background: { color: 'transparent' }, class: "shadow-btn", onClick: this.onReplaceImage.bind(this) })))))));
        }
    };
    ScomImageConfig = __decorate([
        components_3.customModule,
        (0, components_3.customElements)('i-scom-image-config')
    ], ScomImageConfig);
    exports.default = ScomImageConfig;
});
define("@scom/scom-image/crop/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    const maskStyle = `linear-gradient(rgb(0, 0, 0) 0px, rgb(0, 0, 0) 0px) 50% 100% / 100% 100% no-repeat, linear-gradient(rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 0px)`;
    components_4.Styles.cssRule('i-scom-image-crop', {
        $nest: {
            '.custom-img img': {
                objectFit: 'fill',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                maxWidth: 'none',
                maxHeight: 'none'
            },
            '.is-circle': {
                cursor: 'move',
                borderRadius: '50%',
                border: `2px solid ${Theme.colors.primary.main}`,
                $nest: {
                    ".angle": {
                        borderRadius: '50%',
                        background: Theme.colors.primary.main,
                        border: '2px solid #fff',
                        marginTop: -8
                    },
                    ".angle-center": {
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid #fff',
                        display: 'block',
                        cursor: 'pointer'
                    }
                }
            },
            ".angle-center": {
                display: 'none'
            },
            ".angle": {
                zIndex: 2,
                position: 'absolute',
                width: '16px',
                height: '16px',
                background: 'none 0px center',
                border: `6px solid ${Theme.colors.primary.main}`,
                borderRadius: 0
            },
            ".angle-nw": {
                left: 0,
                top: 0,
                borderRight: 0,
                borderBottom: 0,
                marginTop: -2,
                marginLeft: -2,
                cursor: 'nw-resize'
            },
            ".angle-n": {
                borderRight: 0,
                borderBottom: 0,
                borderLeft: 0,
                marginTop: -2,
                cursor: 'n-resize',
                left: 'calc(50% - 8px)',
                top: 0
            },
            ".angle-ne": {
                transform: "rotate(360deg)",
                right: 0,
                top: 0,
                borderBottom: 0,
                borderLeft: 0,
                marginTop: -2,
                marginRight: -2,
                cursor: 'ne-resize'
            },
            ".angle-e": {
                borderBottom: 0,
                borderLeft: 0,
                borderTop: 0,
                marginRight: -2,
                cursor: 'e-resize',
                top: 'calc(50% - 8px)',
                right: 0
            },
            ".angle-se": {
                transform: "rotate(0deg)",
                right: 0,
                bottom: 0,
                borderLeft: 0,
                borderTop: 0,
                marginRight: -2,
                marginBottom: -2,
                cursor: 'se-resize'
            },
            ".angle-s": {
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                cursor: 's-resize',
                left: 'calc(50% - 8px)',
                bottom: 0,
                marginBottom: -2
            },
            ".angle-sw": {
                transform: "rotate(360deg)",
                bottom: 0,
                left: 0,
                borderTop: 0,
                borderRight: 0,
                marginBottom: -2,
                marginLeft: -2,
                cursor: 'sw-resize',
            },
            ".angle-w": {
                borderTop: 0,
                borderRight: 0,
                borderBottom: 0,
                marginLeft: -2,
                cursor: 'w-resize',
                top: 'calc(50% - 8px)',
                left: 0
            },
            ".custom-mask": {
                mask: maskStyle,
                '-webkit-mask': maskStyle
            },
            '#pnlCropMask': {
                aspectRatio: '1 / 1',
                minWidth: 50,
                minHeight: 50
            }
        }
    });
});
define("@scom/scom-image/crop/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-image/interface.ts", "@scom/scom-image/store.ts", "@scom/scom-image/crop/index.css.ts"], function (require, exports, components_5, interface_2, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_5.Styles.Theme.ThemeVars;
    const MIN_WIDTH = 50;
    const DEFAULT_ASPECT_RATIO = '1:1';
    const cropTypeOptions = [
        {
            value: interface_2.CropType.PREEFORM,
            label: 'Freeform'
        },
        {
            value: interface_2.CropType.CIRCLE,
            label: 'Circle'
        }
    ];
    let ScomImageCrop = class ScomImageCrop extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = { url: '' };
            this.isResizing = false;
            this._cropType = interface_2.CropType.PREEFORM;
            this._isLockedRatio = false;
            this.isShown = true;
            this._mouseMoveHandler = this.handleMouseMove.bind(this);
            this._mouseUpHandler = this.handleMouseUp.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        init() {
            super.init();
            const cid = this.getAttribute('cid', true);
            const url = this.getAttribute('url', true);
            const cropData = this.getAttribute('cropData', true);
            this.data = { cid, url, cropData };
        }
        _handleMouseDown(event, stopPropagation) {
            const target = event.target;
            const resizer = target.closest('.angle');
            const mask = target.closest('#pnlCropMask');
            this._origWidth = this.pnlCropMask.offsetWidth;
            this._origHeight = this.pnlCropMask.offsetHeight;
            this._origLeft = this.pnlCropMask.offsetLeft;
            this._origTop = this.pnlCropMask.offsetTop;
            this._mouseDownPos = { x: event.clientX, y: event.clientY };
            this.isResizing = !!resizer && !resizer.classList.contains('angle-center');
            if (resizer) {
                this.currentResizer = resizer;
                this.currentResizer.classList.add('highlight');
            }
            if (mask || resizer) {
                document.addEventListener('mousemove', this._mouseMoveHandler);
                document.addEventListener('mouseup', this._mouseUpHandler);
            }
            return super._handleMouseDown(event);
        }
        handleMouseMove(event) {
            event.preventDefault();
            event.stopPropagation();
            let offsetX = event.clientX - this._mouseDownPos.x;
            let offsetY = event.clientY - this._mouseDownPos.y;
            if (this.isResizing)
                this.onResize(offsetX, offsetY);
            else
                this.onMove(offsetX, offsetY);
        }
        onResize(offsetX, offsetY) {
            const dock = this.currentResizer.tag;
            let newWidth = 0;
            let newHeight = 0;
            const containerWidth = this.pnlCropWrap.offsetWidth;
            const containerHeight = this.pnlCropWrap.offsetHeight;
            const maxWidthRight = containerWidth - this._origLeft;
            const maxWidthLeft = this._origLeft + this._origWidth;
            const maxHeightTop = this._origTop + this._origHeight;
            const maxHeightBottom = containerHeight - this._origTop;
            this.resetCurrentPos();
            switch (dock) {
                case 'left':
                    newWidth = this._origWidth - offsetX;
                    this.updateDimension({ maxWidth: maxWidthLeft, maxHeight: maxHeightBottom }, newWidth);
                    this.updatePosition(this._origLeft + offsetX);
                    break;
                case 'top':
                    newHeight = this._origHeight - offsetY;
                    if (this.isCircleType) {
                        this.updateDimension({}, undefined, newHeight);
                        this.updatePosition(this._origLeft + offsetY / 2, this._origTop + offsetY / 2);
                    }
                    else {
                        // TODO: check
                        this.updateDimension({ maxHeight: maxHeightTop }, undefined, newHeight);
                        this.updatePosition(undefined, this._origTop + offsetY);
                    }
                    break;
                case 'right':
                    newWidth = this._origWidth + offsetX;
                    this.updateDimension({ maxWidth: maxWidthRight, maxHeight: maxHeightBottom }, newWidth);
                    break;
                case 'bottom':
                    newHeight = this._origHeight + offsetY;
                    this.updateDimension({ maxHeight: maxHeightBottom }, undefined, newHeight);
                    break;
                case 'topLeft':
                    newWidth = this._origWidth - offsetX;
                    newHeight = this._origHeight - offsetY;
                    this.updateDimension({ maxWidth: maxWidthLeft, maxHeight: maxHeightTop }, newWidth, newHeight);
                    this.updatePosition(this._origLeft + offsetX, this._origTop + offsetY);
                    break;
                case 'topRight':
                    newWidth = this._origWidth + offsetX;
                    newHeight = this._origHeight - offsetY;
                    this.updateDimension({ maxWidth: maxWidthRight, maxHeight: this.isFixedRatio ? maxHeightBottom : maxHeightTop }, newWidth, newHeight);
                    this.updatePosition(undefined, this._origTop + offsetY);
                    break;
                case 'bottomLeft':
                    newWidth = this._origWidth - offsetX;
                    newHeight = this._origHeight + offsetY;
                    this.updateDimension({ maxWidth: maxWidthLeft, maxHeight: maxHeightBottom }, newWidth, newHeight);
                    this.updatePosition(this._origLeft + offsetX);
                    break;
                case 'bottomRight':
                    newWidth = this._origWidth + offsetX;
                    newHeight = this._origHeight + offsetY;
                    this.updateDimension({ maxWidth: maxWidthRight, maxHeight: maxHeightBottom }, newWidth, newHeight);
                    break;
            }
            this.pnlResizeWrap.refresh();
            this.updateMaskImage();
        }
        updatePosition(left, top) {
            this.resetCurrentPos();
            const currentWidth = this.pnlCropMask.offsetWidth;
            const isFullCircle = this.isCircleType && this.pnlCropMask.offsetWidth === this.pnlCropWrap.offsetHeight;
            if (currentWidth === MIN_WIDTH || isFullCircle) {
                return;
            }
            if (left !== undefined) {
                if (this._isLockedRatio && !this.isCircleType) {
                    this.pnlCropMask.style.left = 'auto';
                    const rightPos = this.pnlCropWrap.offsetWidth - (this._origLeft + this._origWidth);
                    this.pnlCropMask.style.right = `${rightPos}px`;
                }
                else {
                    const validLeft = left < 0
                        ? 0
                        : left > this._origLeft + this._origWidth
                            ? (this._origLeft + this._origWidth - MIN_WIDTH)
                            : left;
                    this.pnlCropMask.style.left = `${validLeft}px`;
                }
            }
            if (top !== undefined) {
                if (this._isLockedRatio && !this.isCircleType) {
                    this.pnlCropMask.style.top = 'auto';
                    const bottomPos = this.pnlCropWrap.offsetHeight - (this._origTop + this._origHeight);
                    this.pnlCropMask.style.bottom = `${bottomPos}px`;
                }
                else {
                    const validTop = top < 0
                        ? 0
                        : top > this._origTop + this._origHeight
                            ? (this._origTop + this._origHeight - MIN_WIDTH)
                            : top;
                    this.pnlCropMask.style.top = `${validTop}px`;
                    this.pnlCropMask.style.bottom = '';
                }
            }
        }
        resetCurrentPos() {
            this.pnlCropMask.style.left = `${this.pnlCropMask.offsetLeft}px`;
            this.pnlCropMask.style.right = '';
            this.pnlCropMask.style.top = `${this.pnlCropMask.offsetTop}px`;
            this.pnlCropMask.style.bottom = '';
        }
        updateDimension(maxValues, newWidth, newHeight) {
            const containerWidth = this.pnlCropWrap.offsetWidth;
            const containerHeight = this.pnlCropWrap.offsetHeight;
            let { maxWidth = containerWidth, maxHeight = containerHeight } = maxValues;
            if (this.isFixedRatio) {
                const [widthRatio, heightRatio] = this.aspectRatio.split(':').map(val => Number(val.trim()));
                if (widthRatio > heightRatio) {
                    const newMaxHeight = (maxWidth * heightRatio) / widthRatio;
                    if (newMaxHeight > maxHeight) {
                        maxWidth = (maxHeight * widthRatio) / heightRatio;
                    }
                    else {
                        maxHeight = newMaxHeight;
                    }
                }
                else if (heightRatio > widthRatio) {
                    const newMaxWidth = (maxHeight * widthRatio) / heightRatio;
                    if (newMaxWidth > maxWidth) {
                        maxHeight = (maxWidth * heightRatio) / widthRatio;
                    }
                    else {
                        maxWidth = newMaxWidth;
                    }
                }
                else {
                    const minWal = Math.min(maxWidth, maxHeight);
                    maxWidth = maxHeight = minWal;
                }
            }
            else {
                this.pnlCropMask.style.maxHeight = maxHeight + 'px';
                this.pnlCropMask.style.maxWidth = maxWidth + 'px';
            }
            if (newWidth !== undefined) {
                const validWidth = newWidth > maxWidth ? maxWidth : newWidth;
                this.pnlCropMask.style.width = Math.max(MIN_WIDTH, validWidth) + 'px';
            }
            if (newHeight !== undefined) {
                const validHeight = newHeight > maxHeight ? maxHeight : newHeight;
                const height = Math.max(MIN_WIDTH, validHeight);
                this.pnlCropMask.style.height = height + 'px';
                if (this.isCircleType) {
                    this.pnlCropMask.style.width = height + 'px';
                }
            }
            if (this._isLockedRatio) {
                this.pnlCropMask.style.height = 'auto';
                this.pnlCropMask.style.aspectRatio = this.aspectRatio.replace(':', '/');
            }
            this.ratioInput.value = this.aspectRatio;
        }
        onMove(offsetX, offsetY) {
            if (this.pnlCropMask.offsetWidth === this.offsetWidth &&
                this.pnlCropMask.offsetHeight === this.offsetHeight)
                return;
            const { left, top } = this.validatePosition(offsetX, offsetY, this.pnlCropMask.offsetWidth, this.pnlCropMask.offsetHeight);
            this.pnlCropMask.style.left = `${left}px`;
            this.pnlCropMask.style.top = `${top}px`;
            this.updateMaskImage();
        }
        validatePosition(dx, dy, width, height) {
            let newLeft = 0;
            let newTop = 0;
            let left = this._origLeft + dx;
            let top = this._origTop + dy;
            const containerWidth = this.pnlCropWrap.offsetWidth;
            const containerHeight = this.pnlCropWrap.offsetHeight;
            newLeft =
                left < 0
                    ? 0
                    : left > containerWidth - width
                        ? containerWidth - width
                        : left;
            newTop =
                top < 0
                    ? 0
                    : top > containerHeight - height
                        ? containerHeight - height
                        : top;
            return { left: newLeft, top: newTop };
        }
        updateMaskImage(cropData) {
            let { left, top, width, height, type } = cropData || this.getPercentValues();
            let maskStyle = '';
            if (type === interface_2.CropType.CIRCLE) {
                const x = left + width / 2;
                height = (this.pnlCropMask.offsetHeight / this.pnlCropWrap.offsetHeight) * 100;
                const y = top + height / 2;
                maskStyle = `radial-gradient(${width}% ${height}% at ${x}% ${y}%, black 50%, rgba(0, 0, 0, 0.4) 50%) no-repeat`;
            }
            else {
                const xSpaces = 100 - width;
                const x = xSpaces > 0 ? (left / xSpaces) * 100 : 0;
                const ySpaces = 100 - height;
                const y = ySpaces > 0 ? (top / ySpaces) * 100 : 0;
                const maskPosition = `${x}% ${y}%`;
                const maskSize = `${width}% ${height}%`;
                maskStyle = `linear-gradient(rgb(0, 0, 0) 0px, rgb(0, 0, 0) 0px) ${maskPosition} / ${maskSize} no-repeat, linear-gradient(rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 0px)`;
            }
            this.pnlCropWrap.style.mask = maskStyle;
            this.pnlCropWrap.style.webkitMask = maskStyle;
        }
        getPercentValues() {
            const currentParentWidth = this.pnlCropWrap.offsetWidth;
            const currentParentHeight = this.pnlCropWrap.offsetHeight;
            const currentLeft = this.pnlCropMask.offsetLeft;
            const currentTop = this.pnlCropMask.offsetTop;
            const currentWidth = this.pnlCropMask.offsetWidth;
            const currentHeight = this.pnlCropMask.offsetHeight;
            return {
                width: (currentWidth / currentParentWidth) * 100,
                height: (currentHeight / currentParentHeight) * 100,
                left: (currentLeft / currentParentWidth) * 100,
                top: (currentTop / currentParentHeight) * 100,
                aspectRatio: this.aspectRatio,
                type: this._cropType,
                locked: this._isLockedRatio
            };
        }
        handleMouseUp(event) {
            event.preventDefault();
            this.isResizing = false;
            this._mouseDownPos = null;
            this.currentResizer = null;
            document.removeEventListener('mousemove', this._mouseMoveHandler);
            document.removeEventListener('mouseup', this._mouseUpHandler);
        }
        get url() {
            return this.data.url ?? '';
        }
        set url(value) {
            this.data.url = value;
            if (!value) {
                this.img.url = 'https://placehold.co/600x400?text=No+Image';
                return;
            }
            if (this.data.url?.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
                this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.img.url = this.data.url;
            }
        }
        get cropData() {
            return this.data.cropData;
        }
        set cropData(value) {
            this.data.cropData = value;
            this._cropType = value.type ?? interface_2.CropType.PREEFORM;
            this.renderCropUI();
        }
        get isCircleType() {
            return this._cropType === interface_2.CropType.CIRCLE;
        }
        get isFixedRatio() {
            return this._isLockedRatio || this.isCircleType;
        }
        get aspectRatio() {
            const currentWidth = this.pnlCropMask.offsetWidth;
            const currentHeight = this.pnlCropMask.offsetHeight;
            let aspectRatio = DEFAULT_ASPECT_RATIO;
            if (!this.isCircleType) {
                aspectRatio = this._isLockedRatio ? this.ratioInput.value : `${(currentWidth / currentHeight).toFixed(2)}:1`;
            }
            return aspectRatio;
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
            this._cropType = value?.cropData?.type ?? interface_2.CropType.PREEFORM;
            this.renderUI();
        }
        renderUI() {
            const url = this.getImgSrc();
            this.img.url = url;
            this.renderCropUI();
        }
        renderCropUI() {
            const cropData = this.data.cropData || null;
            if (cropData) {
                let { width, height, left, top, type, aspectRatio } = cropData;
                this.pnlCropMask.style.width = `${width}%`;
                this.pnlCropMask.style.height = this.isCircleType ? 'auto' : `${height}%`;
                this.pnlCropMask.style.aspectRatio = aspectRatio;
                this.pnlResizeWrap.refresh();
                this.pnlCropMask.style.left = `${left}%`;
                this.pnlCropMask.style.top = `${top}%`;
                this.updateMaskImage({ width, height, left, top, type: type || interface_2.CropType.PREEFORM, aspectRatio });
            }
            else {
                this.resetMask();
                this.updateMaskImage();
            }
            this.updateFormUI();
        }
        resetMask() {
            this.pnlCropMask.style.width = `50%`;
            this.pnlCropMask.style.height = `auto`;
            this.pnlCropMask.style.aspectRatio = `1/1`;
            this.pnlCropMask.style.left = '25%';
            this.pnlResizeWrap.refresh();
            this.pnlCropMask.style.top = `calc(50% - ${this.pnlCropMask.offsetHeight / 2}px)`;
        }
        updateFormUI() {
            const { aspectRatio = DEFAULT_ASPECT_RATIO, type = interface_2.CropType.PREEFORM, locked = false } = this.data.cropData || {};
            const findedType = cropTypeOptions.find(item => item.value === type);
            this.typeCombobox.selectedItem = findedType;
            this.renderTypeUI(aspectRatio);
            this._isLockedRatio = locked;
            this.lockedCheck.checked = locked;
        }
        getImgSrc() {
            let url = '';
            if (this.data.cid) {
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
                url = ipfsGatewayUrl + this.data.cid;
            }
            else if (this.data.url?.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
                url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                url = this.data.url || 'https://placehold.co/600x400?text=No+Image';
            }
            return url;
        }
        onCrop() {
            this.cropData = JSON.parse(JSON.stringify(this.getPercentValues()));
        }
        onTypeChanged() {
            this._cropType = (this.typeCombobox.selectedItem).value;
            this.renderTypeUI();
            this.resetMask();
            this.updateMaskImage();
        }
        renderTypeUI(aspectRatio) {
            if (this.isCircleType) {
                this.pnlCropMask.classList.add('is-circle');
            }
            else {
                this.pnlCropMask.classList.remove('is-circle');
            }
            this.isShown = !this.isCircleType;
            this.ratioInput.value = aspectRatio || DEFAULT_ASPECT_RATIO;
            this.ratioInput.readOnly = this.isCircleType;
        }
        onInputChanged(source) {
            if (this.timer)
                clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                const value = source.value ?? '';
                if (/(\d+)\s?\:(\d+)\s?/g.test(value)) {
                    const [_var, string = '', height = ''] = /(\d+)\s?\:(\d+)\s?/g.exec(value);
                    let newWidthRatio = Math.min(Number(string || 1), 100);
                    let newHeightRatio = Math.min(Number(height || 1), 100);
                    this.pnlCropMask.style.top = 'auto';
                    this.pnlCropMask.style.height = 'auto';
                    this.pnlCropMask.style.aspectRatio = `${newWidthRatio}/${newHeightRatio}`;
                    this.ratioInput.value = `${newWidthRatio}:${newHeightRatio}`;
                    this.pnlResizeWrap.refresh();
                    this.updateMaskImage();
                }
            }, 500);
        }
        onLockChanged(source) {
            const isChecked = source.checked;
            this._isLockedRatio = isChecked;
            this.ratioInput.readOnly = isChecked;
            this.updateMaskImage();
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-panel", { margin: { bottom: '1rem', top: '1rem' } },
                    this.$render("i-grid-layout", { columnsPerRow: 3, gap: { column: '1rem', row: '1rem' }, horizontalAlignment: "stretch" },
                        this.$render("i-combo-box", { id: "typeCombobox", height: 40, items: cropTypeOptions, selectedItem: cropTypeOptions[0], onChanged: this.onTypeChanged }),
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "0.5rem" },
                            this.$render("i-label", { caption: "Aspect ratio " }),
                            this.$render("i-input", { id: "ratioInput", placeholder: DEFAULT_ASPECT_RATIO, stack: { grow: '1', basis: '0%', shrink: '1' }, border: { width: '1px', style: 'solid', color: Theme.divider }, onChanged: this.onInputChanged, height: 40 })),
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "0.5rem" },
                            this.$render("i-checkbox", { id: "lockedCheck", caption: 'Lock aspect ratio', onChanged: this.onLockChanged })))),
                this.$render("i-vstack", { position: "relative", width: '100%', height: '100%' },
                    this.$render("i-vstack", { id: "pnlResizeWrap", width: '100%' },
                        this.$render("i-panel", { id: 'pnlCropMask', width: '50%', height: "auto", maxWidth: '100%', maxHeight: '100%', position: 'absolute', zIndex: 1 },
                            this.$render("i-panel", { class: 'angle angle-nw', tag: 'topLeft', visible: this.isShown }),
                            this.$render("i-panel", { class: 'angle angle-ne', tag: 'topRight', visible: this.isShown }),
                            this.$render("i-panel", { class: 'angle angle-sw', tag: 'bottomLeft', visible: this.isShown }),
                            this.$render("i-panel", { class: 'angle angle-se', tag: 'bottomRight', visible: this.isShown }),
                            this.$render("i-panel", { class: 'angle angle-e', tag: 'right', visible: this.isShown }),
                            this.$render("i-panel", { class: 'angle angle-s', tag: 'bottom', visible: this.isShown }),
                            this.$render("i-panel", { class: 'angle angle-w', tag: 'left', visible: this.isShown }),
                            this.$render("i-panel", { class: 'angle angle-n', tag: 'top' }),
                            this.$render("i-panel", { class: 'angle angle-center' }))),
                    this.$render("i-panel", { id: 'pnlCropWrap', overflow: 'hidden', class: 'custom-mask' },
                        this.$render("i-image", { id: 'img', url: 'https://placehold.co/600x400?text=No+Image', maxWidth: '100%', display: "flex", class: 'custom-img' })))));
        }
    };
    __decorate([
        (0, components_5.observable)()
    ], ScomImageCrop.prototype, "isShown", void 0);
    ScomImageCrop = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-image-crop')
    ], ScomImageCrop);
    exports.default = ScomImageCrop;
});
define("@scom/scom-image", ["require", "exports", "@ijstech/components", "@scom/scom-image/interface.ts", "@scom/scom-image/store.ts", "@scom/scom-image/data.json.ts", "@scom/scom-image/config/index.tsx", "@scom/scom-image/crop/index.tsx", "@scom/scom-image/index.css.ts"], function (require, exports, components_6, interface_3, store_3, data_json_1, index_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_6.Styles.Theme.ThemeVars;
    let ScomImage = class ScomImage extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                cid: '',
                url: '',
                altText: '',
                backgroundColor: '',
                link: ''
            };
            this.isInitedLink = false;
            this.tag = {};
            if (data_json_1.default)
                (0, store_3.setDataFromSCConfig)(data_json_1.default);
        }
        init() {
            super.init();
            this.setTag({ width: '100%', height: 'auto' });
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                let cid = this.getAttribute('cid', true);
                const ipfsGatewayUrl = (0, store_3.getIPFSGatewayUrl)();
                this.url = this.getAttribute('url', true) || (cid ? ipfsGatewayUrl + cid : "");
                this.altText = this.getAttribute('altText', true);
                const cropData = this.getAttribute('cropData', true);
                if (cropData)
                    this.cropData = cropData;
                this.data.photoId = this.options?.photoId || '';
                this.data.keyword = this.options?.keyword || '';
            }
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get url() {
            return this.data.url ?? '';
        }
        set url(value) {
            this.data.url = value;
            if (!this.img)
                return;
            if (!value) {
                this.img.url = 'https://placehold.co/600x400?text=No+Image';
                return;
            }
            if (this.data.url?.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_3.getIPFSGatewayUrl)();
                this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.img.url = this.data.url;
            }
        }
        get altText() {
            return this.data.altText ?? '';
        }
        set altText(value) {
            this.data.altText = value;
            if (!this.img)
                return;
            const imgElm = this.img.querySelector('img');
            imgElm && imgElm.setAttribute('alt', this.data.altText || '');
        }
        get link() {
            return this.data.link ?? '';
        }
        set link(value) {
            this.data.link = value;
        }
        get cropData() {
            return this.data.cropData;
        }
        set cropData(value) {
            this.data.cropData = value;
            this.updateCropUI();
        }
        getConfigurators() {
            const self = this;
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        return this._getActions('Builders');
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Editor',
                    target: 'Editor',
                    getActions: () => {
                        return this._getActions('Editor');
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        _getActions(target) {
            const self = this;
            const parentToolbar = self.closest('ide-toolbar');
            const editAction = {
                name: 'Edit',
                icon: 'edit',
                command: (builder, userInputData) => {
                    let oldData = { url: '' };
                    return {
                        execute: () => {
                            oldData = JSON.parse(JSON.stringify(this.data));
                            if (builder?.setData)
                                builder.setData(userInputData);
                            this.setData(userInputData);
                        },
                        undo: () => {
                            if (builder?.setData)
                                builder.setData(oldData);
                            this.setData(oldData);
                        },
                        redo: () => { }
                    };
                },
                customUI: {
                    render: (data, onConfirm) => {
                        const vstack = new components_6.VStack(null, { gap: '1rem' });
                        const config = new index_1.default(null, { ...this.data, canUpload: target !== 'Editor' });
                        const hstack = new components_6.HStack(null, {
                            verticalAlignment: 'center',
                            horizontalAlignment: 'end'
                        });
                        const button = new components_6.Button(null, {
                            caption: 'Confirm',
                            width: '100%',
                            height: 40,
                            font: { color: Theme.colors.primary.contrastText }
                        });
                        hstack.append(button);
                        vstack.append(config);
                        vstack.append(hstack);
                        button.onClick = async () => {
                            if (onConfirm)
                                onConfirm(true, { ...this.data, ...config.data });
                        };
                        return vstack;
                    }
                }
            };
            if (target === 'Editor')
                return [editAction];
            return [
                {
                    name: 'Crop',
                    icon: 'crop',
                    command: (builder, userInputData) => {
                        let oldData = { url: '' };
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this.data));
                                if (builder?.setData)
                                    builder.setData(userInputData);
                                this.setData(userInputData);
                            },
                            undo: () => {
                                if (builder?.setData)
                                    builder.setData(oldData);
                                this.setData(oldData);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_6.VStack(null, { gap: '1rem' });
                            const config = new index_2.default(null, { ...this.data });
                            const hstack = new components_6.HStack(null, {
                                verticalAlignment: 'center',
                                horizontalAlignment: 'end'
                            });
                            const button = new components_6.Button(null, {
                                caption: 'Confirm',
                                width: '100%',
                                height: 40,
                                font: { color: Theme.colors.primary.contrastText }
                            });
                            hstack.append(button);
                            vstack.append(config);
                            vstack.append(hstack);
                            if (parentToolbar)
                                parentToolbar.classList.add('is-editing');
                            button.onClick = async () => {
                                if (onConfirm) {
                                    config.onCrop();
                                    onConfirm(true, { ...this.data, ...config.data });
                                    self.updateCropUI();
                                    if (parentToolbar)
                                        parentToolbar.classList.remove('is-editing');
                                }
                            };
                            return vstack;
                        }
                    }
                },
                editAction,
                {
                    name: 'Widget Settings',
                    icon: 'edit',
                    ...this.getWidgetSchemas()
                }
            ];
        }
        getWidgetSchemas() {
            const propertiesSchema = {
                type: 'object',
                properties: {
                    pt: {
                        title: 'Top',
                        type: 'number'
                    },
                    pb: {
                        title: 'Bottom',
                        type: 'number'
                    },
                    pl: {
                        title: 'Left',
                        type: 'number'
                    },
                    pr: {
                        title: 'Right',
                        type: 'number'
                    },
                    align: {
                        type: 'string',
                        title: 'Alignment',
                        enum: [
                            'left',
                            'center',
                            'right'
                        ]
                    },
                    maxWidth: {
                        type: 'number'
                    },
                    link: {
                        title: 'URL',
                        type: 'string'
                    }
                }
            };
            const themesSchema = {
                type: 'VerticalLayout',
                elements: [
                    {
                        type: 'HorizontalLayout',
                        elements: [
                            {
                                type: 'Group',
                                label: 'Padding (px)',
                                elements: [
                                    {
                                        type: 'VerticalLayout',
                                        elements: [
                                            {
                                                type: 'HorizontalLayout',
                                                elements: [
                                                    {
                                                        type: 'Control',
                                                        scope: '#/properties/pt',
                                                    },
                                                    {
                                                        type: 'Control',
                                                        scope: '#/properties/pb',
                                                    },
                                                    {
                                                        type: 'Control',
                                                        scope: '#/properties/pl',
                                                    },
                                                    {
                                                        type: 'Control',
                                                        scope: '#/properties/pr',
                                                    },
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'HorizontalLayout',
                        elements: [
                            {
                                type: 'Control',
                                label: 'Max Width',
                                scope: '#/properties/maxWidth',
                            }
                        ]
                    },
                    {
                        type: 'HorizontalLayout',
                        elements: [
                            {
                                type: 'Control',
                                label: 'Alignment',
                                scope: '#/properties/align',
                            }
                        ]
                    },
                    {
                        type: 'HorizontalLayout',
                        elements: [
                            {
                                type: 'Control',
                                label: 'URL',
                                scope: '#/properties/link',
                            }
                        ]
                    }
                ]
            };
            return {
                userInputDataSchema: propertiesSchema,
                userInputUISchema: themesSchema
            };
        }
        getData() {
            return this.data;
        }
        setData(value) {
            this.data = value;
            this.updateImg();
            this.updateCropUI();
            if (this.pnlImage)
                this.pnlImage.background.color = value.backgroundColor || '';
        }
        updateImg() {
            if (!this.img)
                return;
            if (this.data.cid) {
                const ipfsGatewayUrl = (0, store_3.getIPFSGatewayUrl)();
                this.img.url = ipfsGatewayUrl + this.data.cid;
            }
            else if (this.data.url?.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_3.getIPFSGatewayUrl)();
                this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.img.url = this.data.url || 'https://placehold.co/600x400?text=No+Image';
            }
            if (this.tag.width || this.tag.height) {
                this.img.display = 'block';
                this.tag.width && (this.img.width = this.tag.width);
                this.tag.width && (this.img.height = this.tag.height);
            }
            const imgElm = this.img.querySelector('img');
            imgElm && imgElm.setAttribute('alt', this.data.altText || '');
        }
        updateCropUI() {
            if (!this.img)
                return;
            const cropData = this.data.cropData;
            const imgTag = this.img.querySelector('img');
            if (!imgTag)
                return;
            if (cropData) {
                const { left, top, width, height, aspectRatio, type = interface_3.CropType.PREEFORM } = cropData;
                this.pnlImage.classList.add('cropped-pnl');
                const parentWidth = this.pnlImage.offsetWidth;
                const right = left + width;
                const bottom = top + height;
                const scale = parentWidth / (width / 100 * parentWidth);
                if (type === interface_3.CropType.CIRCLE) {
                    imgTag.style.transform = `scale(${scale}) translate(-${left}%, -${top}%)`;
                    const x = left + width / 2;
                    const y = top + height / 2;
                    const radius = `${(width / 100 * parentWidth) / 2}px`;
                    imgTag.style.clipPath = `circle(${radius} at ${x}% ${y}%)`;
                    this.pnlImage && (this.pnlImage.style.aspectRatio = `1 / 1`);
                }
                else {
                    imgTag.style.transform = `scale(${scale}) translate(-${left}%, -${top}%)`;
                    imgTag.style.clipPath = `polygon(${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%)`;
                    if (this.pnlImage && typeof (aspectRatio) == 'string')
                        this.pnlImage.style.aspectRatio = `${aspectRatio.replace(':', '/')}`;
                    else
                        this.pnlImage.style.aspectRatio = `${aspectRatio}/1`;
                }
            }
            else {
                this.pnlImage.classList.remove('cropped-pnl');
                imgTag.style.clipPath = '';
                imgTag.style.transform = '';
                this.pnlImgWrap && (this.pnlImgWrap.style.aspectRatio = ``);
            }
        }
        async connectedCallback() {
            super.connectedCallback();
            if (!this.isConnected)
                return;
            const link = this.data.link || this.getAttribute('link', true);
            if (link !== undefined && !this.isInitedLink) {
                this.isInitedLink = true;
                this.link = link;
            }
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.tag = value;
            const { width, height, maxWidth, align, link } = this.tag;
            if (this.pnlImage) {
                this.pnlImage.style.removeProperty('aspectRatio');
                if (maxWidth !== undefined) {
                    this.pnlImage.maxWidth = maxWidth;
                }
                else {
                    this.pnlImage.maxWidth = '100%';
                }
                if (align !== undefined) {
                    let customMargin = {};
                    if (align === 'left')
                        customMargin = { right: 'auto' };
                    else if (align === 'right')
                        customMargin = { left: 'auto' };
                    else
                        customMargin = { right: 'auto', left: 'auto' };
                    this.pnlImage.margin = customMargin;
                }
                else {
                    this.pnlImage.style.removeProperty('margin');
                }
            }
            if (this.img) {
                this.img.display = "block";
                this.img.width = width;
                this.img.height = height;
                this.updateCropUI();
            }
            if (link) {
                this.classList.add('pointer');
            }
            else {
                this.classList.remove('pointer');
            }
        }
        onImageClick() {
            if (!this.tag.link)
                return;
            window.open(this.tag.link, '_blank');
        }
        render() {
            return (this.$render("i-panel", { id: 'pnlImgWrap', height: "100%" },
                this.$render("i-vstack", { id: 'pnlImage', class: "img-wrapper" },
                    this.$render("i-image", { id: 'img', 
                        // url={'https://placehold.co/600x400?text=No+Image'}
                        class: "custom-img", onClick: this.onImageClick.bind(this) }))));
        }
    };
    ScomImage = __decorate([
        components_6.customModule,
        (0, components_6.customElements)('i-scom-image')
    ], ScomImage);
    exports.default = ScomImage;
});
