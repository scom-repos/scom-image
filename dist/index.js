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
    exports.filterUnsplashPhotos = exports.getUnsplashPhotos = exports.getUnsplashApiKey = exports.setUnsplashApiKey = exports.getIPFSGatewayUrl = exports.setIPFSGatewayUrl = exports.setDataFromSCConfig = exports.state = void 0;
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
    const Theme = components_1.Styles.Theme.ThemeVars;
    components_1.Styles.cssRule('#pnlImage', {
        $nest: {
            '.custom-img img': {
                objectFit: 'fill',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                maxWidth: 'none',
                maxHeight: 'none'
            },
            '#imgLink span': {
                display: 'block'
            },
            '#edtLink input': {
                border: `1px solid ${Theme.divider}`
            },
            ".angle": {
                zIndex: '200',
                position: 'absolute',
                width: '30px',
                height: '30px',
                background: 'black',
                clipPath: "polygon(0 0, 0 100%, 20% 100%, 20% 20%, 100% 20%, 100% 0)"
            },
            ".transform": {
                transformOrigin: "left top"
            },
            ".angle-nw:hover": {
                cursor: 'nw-resize',
                background: 'blue'
            },
            ".angle-ne:hover": {
                cursor: 'ne-resize',
                background: 'blue'
            },
            ".angle-sw:hover": {
                cursor: 'sw-resize',
                background: 'blue'
            },
            ".angle-se:hover": {
                cursor: 'se-resize',
                background: 'blue'
            },
            ".angle-ne": {
                transform: "rotate(90deg)"
            },
            ".angle-se": {
                transform: "rotate(180deg)"
            },
            ".angle-sw": {
                transform: "rotate(270deg)"
            },
            ".canvas": {
                zIndex: '180',
                position: 'absolute',
                top: '0px',
                left: '0px'
            },
            ".canvas-line": {
                zIndex: '190',
                position: 'absolute',
                top: '0px',
                left: '0px'
            }
        }
    });
});
define("@scom/scom-image/config/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
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
            }
        }
    });
});
define("@scom/scom-image/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_3.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-image/config/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UploadType = void 0;
    ///<amd-module name='@scom/scom-image/config/interface.ts'/> 
    var UploadType;
    (function (UploadType) {
        UploadType["UPLOAD"] = "upload";
        UploadType["UNPLASH"] = "unsplash";
    })(UploadType = exports.UploadType || (exports.UploadType = {}));
});
define("@scom/scom-image/config/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-image/assets.ts", "@scom/scom-image/config/interface.ts", "@scom/scom-image/store.ts", "@scom/scom-image/config/index.css.ts"], function (require, exports, components_4, assets_1, interface_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomImageConfig = class ScomImageConfig extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.typeList = [
                {
                    type: interface_1.UploadType.UPLOAD,
                    caption: 'Image upload or URL',
                    icon: { name: 'image', width: 16, height: 16, fill: Theme.colors.primary.main }
                },
                {
                    type: interface_1.UploadType.UNPLASH,
                    caption: 'Unplash images',
                    icon: { image: { url: assets_1.default.fullPath('img/unsplash.svg'), width: 16, height: 16 } }
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
        get altText() {
            var _a;
            return (_a = this._data.altText) !== null && _a !== void 0 ? _a : '';
        }
        set altText(value) {
            this._data.altText = value;
        }
        get link() {
            var _a;
            return (_a = this._data.link) !== null && _a !== void 0 ? _a : '';
        }
        set link(value) {
            this._data.link = value;
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
            this.typeButton.icon = await components_4.Icon.create(Object.assign({}, this.currentType.icon));
        }
        async onTypeSelected(source, data) {
            this.typeModal.visible = false;
            const oldType = this.typeMapper.get(this.currentType.type);
            if (oldType)
                oldType.classList.remove('is-actived');
            this.currentType = Object.assign({}, data);
            source.classList.add('is-actived');
            this.typeButton.caption = this.currentType.caption;
            this.typeButton.icon = await components_4.Icon.create(Object.assign({}, this.currentType.icon));
            this.renderUI();
        }
        onShowType() {
            this.typeModal.visible = !this.typeModal.visible;
        }
        renderUI() {
            if (this.currentType.type === interface_1.UploadType.UNPLASH) {
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
            this.altText = photo.alt_description;
            this.data.photoId = photo.id;
            source.classList.add('img-actived');
            this.selectedPhoto = source;
        }
        async onLoadMore() {
            ++this.currentPage;
            const newData = await (0, store_1.getUnsplashPhotos)({ page: this.currentPage });
            this.renderGrid([...newData]);
        }
        onSearchPhoto() {
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.onFetchPhotos(), 1000);
        }
        async onFetchPhotos() {
            this.data.keyword = this.searchInput.value || '';
            const response = await (0, store_1.filterUnsplashPhotos)({ query: this.data.keyword });
            this.imageGrid.clearInnerHTML();
            this.photoList = (response === null || response === void 0 ? void 0 : response.results) || [];
            this.renderGrid([...this.photoList]);
        }
        async onSurpriseClicked() {
            const response = await (0, store_1.getUnsplashPhotos)();
            this.imageGrid.clearInnerHTML();
            this.photoList = response || [];
            this.renderGrid([...this.photoList]);
        }
        // For uploader
        onToggleImage(value) {
            this.pnlEditor.visible = !value;
            this.pnlImage.visible = value;
        }
        onGoClicked() {
            this.url = this.imgLinkInput.value;
            this.onToggleImage(true);
        }
        async onChangedImage(control, files) {
            let newUrl = '';
            if (files && files[0]) {
                newUrl = (await this.imgUploader.toBase64(files[0]));
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
                            this.$render("i-grid-layout", { id: "imageGrid", margin: { top: '1rem' }, templateColumns: ['repeat(3, minmax(0px, 122px))'], grid: { horizontalAlignment: 'center' }, gap: { row: '0.5rem', column: '0.5rem' } }),
                            this.$render("i-hstack", { horizontalAlignment: "center", margin: { top: '1rem' } },
                                this.$render("i-button", { id: "loadMoreButton", height: 40, width: "45%", border: { width: '1px', style: 'solid', color: Theme.divider, radius: '0.375rem' }, font: { color: Theme.text.primary }, caption: 'Load more', background: { color: 'transparent' }, class: "shadow-btn", onClick: this.onLoadMore.bind(this) })),
                            this.$render("i-hstack", { horizontalAlignment: 'center', gap: "4px", padding: { top: 30, bottom: 10 } },
                                this.$render("i-label", { caption: 'Photo from' }),
                                this.$render("i-label", { caption: 'Unplash', link: { href: 'https://unsplash.com/' } }))),
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
        components_4.customModule,
        (0, components_4.customElements)('i-scom-image-config')
    ], ScomImageConfig);
    exports.default = ScomImageConfig;
});
define("@scom/scom-image", ["require", "exports", "@ijstech/components", "@scom/scom-image/store.ts", "@scom/scom-image/data.json.ts", "@scom/scom-image/config/index.tsx", "@scom/scom-image/index.css.ts"], function (require, exports, components_5, store_2, data_json_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomImage = class ScomImage extends components_5.Module {
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
            if (data_json_1.default)
                (0, store_2.setDataFromSCConfig)(data_json_1.default);
        }
        init() {
            super.init();
            this.setTag({ width: '100%', height: 'auto' });
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                let cid = this.getAttribute('cid', true);
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
                this.url = this.getAttribute('url', true) || cid ? ipfsGatewayUrl + cid : "";
                this.altText = this.getAttribute('altText', true);
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
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
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
            const actions = [
                {
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        let oldData = { url: '' };
                        return {
                            execute: () => {
                                oldData = Object.assign({}, this.data);
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
                            const vstack = new components_5.VStack(null, { gap: '1rem' });
                            const config = new index_1.default(null, Object.assign({}, data));
                            const hstack = new components_5.HStack(null, {
                                verticalAlignment: 'center',
                                horizontalAlignment: 'end'
                            });
                            const button = new components_5.Button(null, {
                                caption: 'Confirm',
                                width: '100%',
                                font: { color: Theme.colors.primary.contrastText }
                            });
                            hstack.append(button);
                            vstack.append(config);
                            vstack.append(hstack);
                            button.onClick = async () => {
                                if (onConfirm)
                                    onConfirm(true, Object.assign({}, config.data));
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
            this.pnlImage.background.color = value.backgroundColor || '';
        }
        updateImg() {
            var _a;
            if (this.data.cid) {
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
                this.img.url = ipfsGatewayUrl + this.data.cid;
            }
            else if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_2.getIPFSGatewayUrl)();
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
            }
        }
        onImageClick() {
            if (!this.data.link)
                return;
            window.open(this.data.link, '_blank');
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-vstack", { id: 'pnlImage' },
                    this.$render("i-image", { id: 'img', url: 'https://placehold.co/600x400?text=No+Image', maxHeight: "100%", maxWidth: "100%", class: "custom-img", onClick: this.onImageClick.bind(this) }))));
        }
    };
    ScomImage = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-image')
    ], ScomImage);
    exports.default = ScomImage;
});
