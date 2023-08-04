var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-image/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        const queries = params ? new URLSearchParams(Object.assign({}, params)).toString() : '';
        try {
            const response = await fetch(`https://api.unsplash.com/photos?${queries}`);
            return await response.json();
        }
        catch (_a) {
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
        const queries = params ? new URLSearchParams(Object.assign({}, params)).toString() : '';
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?${queries}`);
            return await response.json();
        }
        catch (_a) {
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
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
            this.updateCurrentType(this.data.photoId ? this.typeList[1] : this.typeList[0]);
            this.renderUI();
        }
        get url() {
            var _a;
            return (_a = this._data.url) !== null && _a !== void 0 ? _a : '';
        }
        set url(value) {
            this._data.url = value !== null && value !== void 0 ? value : '';
            this.updateImg();
        }
        async renderType() {
            this.typeMapper = new Map();
            this.typeStack.clearInnerHTML();
            this.typeStack.appendChild(this.$render("i-label", { caption: 'Image', font: { weight: 600, color: Theme.text.secondary } }));
            for (let type of this.typeList) {
                const hstack = (this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.5rem", class: `${type.type === this.currentType.type ? 'type-item is-actived' : 'type-item'}`, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: '0.375rem' }, onClick: (source) => this.onTypeSelected(source, type) },
                    this.$render("i-icon", { name: "check", width: 14, height: 14, fill: Theme.text.primary, opacity: 0, class: "check-icon" }),
                    this.$render("i-button", { width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { width: '1px', style: 'none', color: Theme.divider, radius: '0.375rem' }, icon: type.icon, caption: type.caption, background: { color: 'transparent' } })));
                this.typeStack.appendChild(hstack);
                this.typeMapper.set(type.type, hstack);
            }
            this.typeButton.caption = this.currentType.caption;
            this.typeButton.icon = await components_3.Icon.create(Object.assign({}, this.currentType.icon));
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
            this.currentType = Object.assign({}, type);
            const currentType = this.typeMapper.get(this.currentType.type);
            if (currentType)
                currentType.classList.add('is-actived');
            this.typeButton.caption = this.currentType.caption;
            this.typeButton.icon = await components_3.Icon.create(Object.assign({}, this.currentType.icon));
        }
        onShowType() {
            this.typeModal.visible = !this.typeModal.visible;
        }
        renderUI() {
            if (this.currentType.type === interface_1.UploadType.UNSPLASH) {
                this.searchInput.value = this.data.keyword || '';
                this.onFetchPhotos();
                this.unsplashPnl.visible = true;
                this.normalPnl.visible = false;
            }
            else {
                this.unsplashPnl.visible = false;
                this.normalPnl.visible = true;
                this.onToggleImage(!!this.data.url);
            }
            this.updateImg();
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
            var _a;
            let url = '';
            if (this.data.cid) {
                const ipfsGatewayUrl = (0, store_1.getIPFSGatewayUrl)();
                url = ipfsGatewayUrl + this.data.cid;
            }
            else if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_1.getIPFSGatewayUrl)();
                url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                url = this.data.url || 'https://placehold.co/600x400?text=No+Image';
            }
            return url;
        }
        async renderGrid(photoList) {
            var _a;
            const placeholders = this.imageGrid.querySelectorAll('.image-placeholder');
            for (let placeholder of placeholders)
                placeholder.remove();
            if (!(photoList === null || photoList === void 0 ? void 0 : photoList.length))
                return;
            for (let photo of photoList) {
                this.imageGrid.appendChild(this.$render("i-panel", { border: { radius: '0.25rem' }, height: 100, background: { image: photo.urls.thumb }, onClick: (source) => this.onPhotoSelected(source, photo), class: `${((_a = this._data) === null || _a === void 0 ? void 0 : _a.photoId) && photo.id === this._data.photoId ? 'image-item img-actived' : 'image-item'}` },
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
            this.photoList = (response === null || response === void 0 ? void 0 : response.results) || [];
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
        disconnectCallback() {
            super.disconnectCallback();
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
        }
        init() {
            super.init();
            this.renderType();
            const cid = this.getAttribute('cid', true);
            const url = this.getAttribute('url', true);
            const keyword = this.getAttribute('keyword', true);
            const photoId = this.getAttribute('photoId', true);
            this.data = { cid, url, keyword, photoId };
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-vstack", null,
                    this.$render("i-panel", { margin: { bottom: '1.5rem' }, class: "type-pnl" },
                        this.$render("i-button", { id: "typeButton", height: 40, width: "100%", border: { width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem' }, background: { color: 'transparent' }, rightIcon: { name: 'angle-down', width: 16, height: 16, fill: Theme.text.primary, margin: { left: 'auto' } }, onClick: this.onShowType.bind(this), class: "shadow-btn" }),
                        this.$render("i-modal", { id: "typeModal", showBackdrop: false, width: '200px', popupPlacement: "bottomLeft" },
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
                                        this.$render("i-button", { id: "goButton", border: { radius: '0.375rem', style: 'none', width: '1px', color: Theme.divider }, font: { weight: 600 }, background: { color: 'transparent' }, height: "40px", caption: 'Go', enabled: false, onClick: this.onGoClicked.bind(this), class: "hover-btn" }))),
                                this.$render("i-vstack", { gap: "1rem" },
                                    this.$render("i-label", { caption: 'Upload', font: { size: '1.25rem', weight: 'bold' } }),
                                    this.$render("i-upload", { id: 'imgUploader', multiple: false, height: '100%', caption: 'Drag a file or click to upload', minWidth: "auto", onChanged: this.onChangedImage }))),
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
            ".angle": {
                zIndex: 2,
                position: 'absolute',
                width: '16px',
                height: '16px',
                background: 'none 0px center !important',
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
                marginLeft: -14,
                cursor: 'ne-resize'
            },
            ".angle-e": {
                borderBottom: 0,
                borderLeft: 0,
                borderTop: 0,
                marginLeft: -14,
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
                marginLeft: -14,
                marginTop: -14,
                cursor: 'se-resize'
            },
            ".angle-s": {
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                marginTop: -14,
                cursor: 's-resize',
                left: 'calc(50% - 8px)',
                bottom: 0
            },
            ".angle-sw": {
                transform: "rotate(360deg)",
                bottom: 0,
                left: 0,
                borderTop: 0,
                borderRight: 0,
                marginTop: -14,
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
            }
        }
    });
});
define("@scom/scom-image/crop/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-image/store.ts", "@scom/scom-image/crop/index.css.ts"], function (require, exports, components_5, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const MIN_WIDTH = 10;
    let ScomImageCrop = class ScomImageCrop extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = { url: '' };
            this.isResizing = false;
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
            this.isResizing = !!resizer;
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
            switch (dock) {
                case 'left':
                    newWidth = this._origWidth - offsetX;
                    this.updateDimension({ maxWidth: maxWidthLeft }, newWidth);
                    this.updatePosition(this._origLeft + offsetX);
                    break;
                case 'top':
                    newHeight = this._origHeight - offsetY;
                    this.updateDimension({ maxHeight: maxHeightTop }, undefined, newHeight);
                    this.updatePosition(undefined, this._origTop + offsetY);
                    break;
                case 'right':
                    newWidth = this._origWidth + offsetX;
                    this.updateDimension({ maxWidth: maxWidthRight }, newWidth);
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
                    this.updateDimension({ maxWidth: maxWidthRight, maxHeight: maxHeightTop }, newWidth, newHeight);
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
            this.pnlCropWrap.refresh();
            this.updateMaskImage();
        }
        updatePosition(left, top) {
            if (left !== undefined) {
                const validLeft = left < 0
                    ? 0
                    : left > this._origLeft + this._origWidth
                        ? (this._origLeft + this._origWidth - 15)
                        : left;
                this.pnlCropMask.style.left = validLeft + 'px';
            }
            if (top !== undefined) {
                const validTop = top < 0
                    ? 0
                    : top > this._origTop + this._origHeight
                        ? (this._origTop + this._origHeight - 15)
                        : top;
                this.pnlCropMask.style.top = validTop + 'px';
            }
        }
        updateDimension(maxValues, newWidth, newHeight) {
            const containerWidth = this.pnlCropWrap.offsetWidth;
            const containerHeight = this.pnlCropWrap.offsetHeight;
            const { maxWidth = containerWidth, maxHeight = containerHeight } = maxValues;
            if (newWidth !== undefined) {
                const validWidth = newWidth > maxWidth ? maxWidth : newWidth;
                this.pnlCropMask.style.width = Math.max(MIN_WIDTH, validWidth) + 'px';
            }
            if (newHeight !== undefined) {
                const validHeight = newHeight > maxHeight ? maxHeight : newHeight;
                this.pnlCropMask.style.height = Math.max(MIN_WIDTH, validHeight) + 'px';
            }
        }
        onMove(offsetX, offsetY) {
            if (this.pnlCropMask.offsetWidth === this.offsetWidth &&
                this.pnlCropMask.offsetHeight === this.offsetHeight)
                return;
            const { left, top } = this.validatePosition(offsetX, offsetY, this.pnlCropMask.offsetWidth, this.pnlCropMask.offsetHeight);
            this.pnlCropMask.style.left = `${left}px`;
            this.pnlCropMask.style.top = `${top}px`;
            this.pnlCropWrap.refresh();
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
            const { left, top, width, height } = cropData || this.getPercentValues();
            // const containerWidth = this.pnlCropWrap.offsetWidth
            // const containerHeight = this.pnlCropWrap.offsetHeight
            // const leftVal = (left * containerWidth) / 100
            // const topVal = (top * containerHeight) / 100
            const xSpaces = 100 - width;
            const x = xSpaces > 0 ? (left / xSpaces) * 100 : 0;
            const ySpaces = 100 - height;
            const y = ySpaces > 0 ? (top / ySpaces) * 100 : 0;
            const maskPosition = `${x}% ${y}%`;
            const maskSize = `${width}% ${height}%`;
            const maskStyle = `linear-gradient(rgb(0, 0, 0) 0px, rgb(0, 0, 0) 0px) ${maskPosition} / ${maskSize} no-repeat, linear-gradient(rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 0px)`;
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
                aspectRatio: currentWidth / currentHeight
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
            var _a;
            return (_a = this.data.url) !== null && _a !== void 0 ? _a : '';
        }
        set url(value) {
            var _a;
            this.data.url = value;
            if (!value) {
                this.img.url = 'https://placehold.co/600x400?text=No+Image';
                return;
            }
            if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
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
            this.renderCropUI();
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
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
                const { width, height, left, top } = cropData;
                this.pnlCropMask.style.width = `${width}%`;
                this.pnlCropMask.style.height = `${height}%`;
                this.pnlCropMask.style.left = `${left}%`;
                this.pnlCropMask.style.top = `${top}%`;
                this.pnlCropWrap.refresh();
                this.updateMaskImage({ width, height, left, top });
            }
            else {
                this.pnlCropMask.style.width = `100%`;
                this.pnlCropMask.style.height = `100%`;
                this.pnlCropMask.style.left = `0px`;
                this.pnlCropMask.style.top = `0px`;
            }
        }
        getImgSrc() {
            var _a;
            let url = '';
            if (this.data.cid) {
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
                url = ipfsGatewayUrl + this.data.cid;
            }
            else if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
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
        render() {
            return (this.$render("i-panel", { id: 'pnlCropWrap', overflow: 'hidden', class: 'custom-mask' },
                this.$render("i-panel", { id: 'pnlCropMask', width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', position: 'absolute', zIndex: 1 },
                    this.$render("i-panel", { class: 'angle angle-nw', tag: 'topLeft' }),
                    this.$render("i-panel", { class: 'angle angle-ne', tag: 'topRight' }),
                    this.$render("i-panel", { class: 'angle angle-sw', tag: 'bottomLeft' }),
                    this.$render("i-panel", { class: 'angle angle-se', tag: 'bottomRight' }),
                    this.$render("i-panel", { class: 'angle angle-e', tag: 'right' }),
                    this.$render("i-panel", { class: 'angle angle-s', tag: 'bottom' }),
                    this.$render("i-panel", { class: 'angle angle-w', tag: 'left' }),
                    this.$render("i-panel", { class: 'angle angle-n', tag: 'top' })),
                this.$render("i-image", { id: 'img', url: 'https://placehold.co/600x400?text=No+Image', maxHeight: '100%', maxWidth: '100%', class: 'custom-img' })));
        }
    };
    ScomImageCrop = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-image-crop')
    ], ScomImageCrop);
    exports.default = ScomImageCrop;
});
define("@scom/scom-image", ["require", "exports", "@ijstech/components", "@scom/scom-image/store.ts", "@scom/scom-image/data.json.ts", "@scom/scom-image/config/index.tsx", "@scom/scom-image/crop/index.tsx", "@scom/scom-image/index.css.ts"], function (require, exports, components_6, store_3, data_json_1, index_1, index_2) {
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
                this.url = this.getAttribute('url', true) || cid ? ipfsGatewayUrl + cid : "";
                this.altText = this.getAttribute('altText', true);
                const cropData = this.getAttribute('cropData', true);
                if (cropData)
                    this.cropData = cropData;
            }
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get url() {
            var _a;
            return (_a = this.data.url) !== null && _a !== void 0 ? _a : '';
        }
        set url(value) {
            var _a;
            this.data.url = value;
            if (!value) {
                this.img.url = 'https://placehold.co/600x400?text=No+Image';
                return;
            }
            if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_3.getIPFSGatewayUrl)();
                this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.img.url = this.data.url;
            }
        }
        get altText() {
            var _a;
            return (_a = this.data.altText) !== null && _a !== void 0 ? _a : '';
        }
        set altText(value) {
            this.data.altText = value;
            const imgElm = this.img.querySelector('img');
            imgElm && imgElm.setAttribute('alt', this.data.altText || '');
        }
        get link() {
            var _a;
            return (_a = this.data.link) !== null && _a !== void 0 ? _a : '';
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
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        return this._getActions(this.getPropertiesSchema(), this.getThemeSchema());
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        // const defaultData = configData.defaultBuilderData;
                        // await this.setData({...defaultData, ...data});
                        await this.setData(Object.assign({}, data));
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
            ];
        }
        getPropertiesSchema() {
            const propertiesSchema = {
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
        getThemeSchema(readOnly) {
            const themeSchema = {
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
            };
            return themeSchema;
        }
        _getActions(settingSchema, themeSchema) {
            const self = this;
            const parentToolbar = self.closest('ide-toolbar');
            const actions = [
                {
                    name: 'Crop',
                    icon: 'crop',
                    command: (builder, userInputData) => {
                        let oldData = { url: '' };
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this.data));
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(userInputData);
                                this.setData(userInputData);
                            },
                            undo: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(oldData);
                                this.setData(oldData);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_6.VStack(null, { gap: '1rem' });
                            const config = new index_2.default(null, Object.assign({}, this.data));
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
                                    onConfirm(true, Object.assign(Object.assign({}, this.data), config.data));
                                    self.updateCropUI();
                                    if (parentToolbar)
                                        parentToolbar.classList.remove('is-editing');
                                }
                            };
                            return vstack;
                        }
                    }
                },
                {
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        let oldData = { url: '' };
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this.data));
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(userInputData);
                                this.setData(userInputData);
                            },
                            undo: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(oldData);
                                this.setData(oldData);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_6.VStack(null, { gap: '1rem' });
                            const config = new index_1.default(null, Object.assign({}, this.data));
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
                                    onConfirm(true, Object.assign(Object.assign({}, this.data), config.data));
                            };
                            return vstack;
                        }
                    }
                }
            ];
            return actions;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            this.updateImg();
            this.updateCropUI();
            this.pnlImage.background.color = value.backgroundColor || '';
        }
        updateImg() {
            var _a;
            if (this.data.cid) {
                const ipfsGatewayUrl = (0, store_3.getIPFSGatewayUrl)();
                this.img.url = ipfsGatewayUrl + this.data.cid;
            }
            else if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
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
            const cropData = this.data.cropData;
            const imgTag = this.img.querySelector('img');
            if (!imgTag)
                return;
            if (cropData) {
                const { left, top, width, height, aspectRatio } = cropData;
                this.pnlImage.classList.add('cropped-pnl');
                const parentWidth = this.pnlImage.offsetWidth;
                const right = left + width;
                const bottom = top + height;
                const scale = parentWidth / (width / 100 * parentWidth);
                imgTag.style.transform = `scale(${scale}) translate(-${left}%, -${top}%)`;
                imgTag.style.clipPath = `polygon(${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%)`;
                // this.pnlImage.style.maxHeight = `${this.pnlImage.offsetWidth / aspectRatio}px`
                if (this.pnlImgWrap)
                    this.pnlImgWrap.style.aspectRatio = `${aspectRatio} / 1`;
            }
            else {
                this.pnlImage.classList.remove('cropped-pnl');
                imgTag.style.clipPath = '';
                imgTag.style.transform = '';
                // this.pnlImage.style.maxHeight = 'auto'
                if (this.pnlImgWrap)
                    this.pnlImgWrap.style.aspectRatio = ``;
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
            if (this.img) {
                this.img.display = "block";
                this.img.width = this.tag.width;
                this.img.height = this.tag.height;
                this.updateCropUI();
            }
        }
        onImageClick() {
            if (!this.data.link)
                return;
            window.open(this.data.link, '_blank');
        }
        render() {
            return (this.$render("i-panel", { id: 'pnlImgWrap' },
                this.$render("i-vstack", { id: 'pnlImage', class: "img-wrapper" },
                    this.$render("i-image", { id: 'img', url: 'https://placehold.co/600x400?text=No+Image', maxHeight: "100%", maxWidth: "100%", class: "custom-img", onClick: this.onImageClick.bind(this) }))));
        }
    };
    ScomImage = __decorate([
        components_6.customModule,
        (0, components_6.customElements)('i-scom-image')
    ], ScomImage);
    exports.default = ScomImage;
});
