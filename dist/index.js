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
define("@scom/scom-image/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-image/data.json.ts'/> 
    exports.default = {
        ipfsGatewayUrl: "https://ipfs.scom.dev/ipfs/",
        unsplashApiKey: 'ylMtikqlCAZdDIxGz-SV15TOfqzf03epdOoE_5hBBUo'
    };
});
define("@scom/scom-image/model.ts", ["require", "exports", "@scom/scom-image/data.json.ts", "@scom/scom-image/store.ts"], function (require, exports, data_json_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor(module, options) {
            this._data = { url: '' };
            this.options = {
                updateImg: () => { },
                updateImgByTag: () => { }
            };
            this.module = module;
            this.options = options;
            if (data_json_1.default) {
                (0, store_1.setDataFromSCConfig)(data_json_1.default);
            }
        }
        get url() {
            return this._data.url ?? '';
        }
        set url(value) {
            this._data.url = value;
        }
        get altText() {
            return this._data.altText ?? '';
        }
        set altText(value) {
            this._data.altText = value;
        }
        get link() {
            return this._data.link ?? '';
        }
        set link(value) {
            this._data.link = value;
        }
        get cropData() {
            return this._data.cropData;
        }
        set cropData(value) {
            this._data.cropData = value;
        }
        get photoId() {
            return this._data.photoId ?? '';
        }
        set photoId(value) {
            this._data.photoId = value;
        }
        get keyword() {
            return this._data.keyword ?? '';
        }
        set keyword(value) {
            this._data.keyword = value;
        }
        get backgroundColor() {
            return this._data.backgroundColor ?? '';
        }
        get fallbackUrl() {
            return this._data.fallbackUrl ?? '';
        }
        set fallbackUrl(value) {
            this._data.fallbackUrl = value;
        }
        getConfigurators(formAction) {
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        return this._getActions('Builders', formAction);
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
                        return this._getActions('Editor', formAction);
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        _getActions(target, formAction) {
            const editAction = {
                name: 'Edit',
                icon: 'edit',
                command: (builder, userInputData) => {
                    let oldData = { url: '' };
                    return {
                        execute: () => {
                            oldData = JSON.parse(JSON.stringify(this._data));
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
                userInputDataSchema: {
                    type: 'object',
                    properties: {
                        url: {
                            required: true,
                            title: 'URL',
                            type: 'string'
                        }
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
                                oldData = JSON.parse(JSON.stringify(this._data));
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
                    customUI: formAction
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
        async setData(value) {
            this._data = value;
            this.options.updateImg();
        }
        getData() {
            return this._data;
        }
        getTag() {
            return this.module.tag;
        }
        setTag(value) {
            this.module.tag = value;
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.module.tag[prop] = newValue[prop];
                }
            }
            this.updateTheme();
            this.options.updateImgByTag();
        }
        updateTag(type, value) {
            this.module.tag[type] = this.module.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.module.tag[type][prop] = value[prop];
            }
        }
        updateStyle(name, value) {
            if (value) {
                this.module.style.setProperty(name, value);
            }
            else {
                this.module.style.removeProperty(name);
            }
        }
        updateTheme() {
            const themeVar = document.body.style.getPropertyValue('--theme') || 'light';
            this.updateStyle('--text-primary', this.module.tag[themeVar]?.fontColor);
            this.updateStyle('--background-main', this.module.tag[themeVar]?.backgroundColor);
        }
        getUrlImage(checkCid) {
            let url = 'https://placehold.co/600x400?text=No+Image';
            if (checkCid && this._data.cid) {
                const ipfsGatewayUrl = (0, store_1.getIPFSGatewayUrl)();
                url = ipfsGatewayUrl + this._data.cid;
            }
            else if (this._data.url?.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, store_1.getIPFSGatewayUrl)();
                url = this._data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                url = this._data.url || 'https://placehold.co/600x400?text=No+Image';
            }
            return url;
        }
    }
    exports.Model = Model;
});
define("@scom/scom-image/crop/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    const maskStyle = `linear-gradient(rgb(0, 0, 0) 0px, rgb(0, 0, 0) 0px) 50% 100% / 100% 100% no-repeat, linear-gradient(rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 0px)`;
    components_2.Styles.cssRule('i-scom-image-crop', {
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
define("@scom/scom-image/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-image/translations.json.ts'/> 
    exports.default = {
        "en": {
            "confirm": "Confirm",
            "insert_an_image": "Insert an image",
            "aspect_ratio": "Aspect ratio",
            "lock_aspect_ratio": "Lock aspect ratio",
            "image_upload_or_url": "Image upload or URL",
            "unsplash_images": "Unsplash images",
            "image": "Image",
            "find_an_image": "Find an image",
            "surprise_me": "Surprise me",
            "load_more": "Load more",
            "photos_from": "Photos from",
            "unsplash": "Unsplash",
            "paste_on_enter_image_url": "Paste on enter image URL",
            "go": "Go",
            "upload": "Upload",
            "drag_a_file_or_click_to_upload": "Drag a file or click to upload",
            "replace_image": "Replace Image",
        },
        "zh-hant": {
            "confirm": "確認",
            "insert_an_image": "插入圖片",
            "aspect_ratio": "寬高比",
            "lock_aspect_ratio": "鎖定寬高比",
            "image_upload_or_url": "圖片上傳或網址",
            "unsplash_images": "Unsplash 圖片",
            "image": "圖片",
            "find_an_image": "尋找圖片",
            "surprise_me": "給我驚喜",
            "load_more": "載入更多",
            "photos_from": "來自",
            "unsplash": "Unsplash",
            "paste_on_enter_image_url": "貼上圖片網址",
            "go": "前往",
            "upload": "上傳",
            "drag_a_file_or_click_to_upload": "拖曳檔案或點擊上傳",
            "replace_image": "替換圖片",
        },
        "vi": {
            "confirm": "Xác nhận",
            "insert_an_image": "Chèn hình ảnh",
            "aspect_ratio": "Tỷ lệ khung hình",
            "lock_aspect_ratio": "Khóa tỷ lệ khung hình",
            "image_upload_or_url": "Tải lên hình ảnh hoặc URL",
            "unsplash_images": "Hình ảnh Unsplash",
            "image": "Hình ảnh",
            "find_an_image": "Tìm hình ảnh",
            "surprise_me": "Làm tôi ngạc nhiên",
            "load_more": "Tải thêm",
            "photos_from": "Hình ảnh từ",
            "unsplash": "Unsplash",
            "paste_on_enter_image_url": "Dán URL hình ảnh",
            "go": "Đi",
            "upload": "Tải lên",
            "drag_a_file_or_click_to_upload": "Kéo tệp hoặc nhấp để tải lên",
            "replace_image": "Thay thế hình ảnh",
        }
    };
});
define("@scom/scom-image/crop/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-image/interface.ts", "@scom/scom-image/store.ts", "@scom/scom-image/translations.json.ts", "@scom/scom-image/crop/index.css.ts"], function (require, exports, components_3, interface_1, store_2, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    const MIN_WIDTH = 50;
    const DEFAULT_ASPECT_RATIO = '1:1';
    const cropTypeOptions = [
        {
            value: interface_1.CropType.PREEFORM,
            label: 'Freeform'
        },
        {
            value: interface_1.CropType.CIRCLE,
            label: 'Circle'
        }
    ];
    let ScomImageCrop = class ScomImageCrop extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = { url: '' };
            this.isResizing = false;
            this._cropType = interface_1.CropType.PREEFORM;
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
            this.i18n.init({ ...translations_json_1.default });
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
            if (type === interface_1.CropType.CIRCLE) {
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
            this._cropType = value.type ?? interface_1.CropType.PREEFORM;
            this.renderCropUI();
        }
        get isCircleType() {
            return this._cropType === interface_1.CropType.CIRCLE;
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
            this._cropType = value?.cropData?.type ?? interface_1.CropType.PREEFORM;
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
                this.updateMaskImage({ width, height, left, top, type: type || interface_1.CropType.PREEFORM, aspectRatio });
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
            const { aspectRatio = DEFAULT_ASPECT_RATIO, type = interface_1.CropType.PREEFORM, locked = false } = this.data.cropData || {};
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
                            this.$render("i-label", { caption: "$aspect_ratio" }),
                            this.$render("i-input", { id: "ratioInput", placeholder: DEFAULT_ASPECT_RATIO, stack: { grow: '1', basis: '0%', shrink: '1' }, border: { width: '1px', style: 'solid', color: Theme.divider }, onChanged: this.onInputChanged, height: 40 })),
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "0.5rem" },
                            this.$render("i-checkbox", { id: "lockedCheck", caption: "$lock_aspect_ratio", onChanged: this.onLockChanged })))),
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
        (0, components_3.observable)()
    ], ScomImageCrop.prototype, "isShown", void 0);
    ScomImageCrop = __decorate([
        components_3.customModule,
        (0, components_3.customElements)('i-scom-image-crop')
    ], ScomImageCrop);
    exports.default = ScomImageCrop;
});
define("@scom/scom-image", ["require", "exports", "@ijstech/components", "@scom/scom-image/interface.ts", "@scom/scom-image/store.ts", "@scom/scom-image/model.ts", "@scom/scom-image/crop/index.tsx", "@scom/scom-image/translations.json.ts", "@scom/scom-image/index.css.ts"], function (require, exports, components_4, interface_2, store_3, model_1, index_1, translations_json_2) {
    "use strict";
    var ScomImage_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomImage = ScomImage_1 = class ScomImage extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isInitedLink = false;
            this.tag = {};
            this.initModel();
        }
        addBlock(blocknote, executeFn, callbackFn) {
            const blockType = 'imageWidget';
            function getData(element) {
                if (element?.nodeName === 'IMG') {
                    return {
                        url: element.getAttribute('src'),
                        altText: element.getAttribute('alt')
                    };
                }
                return false;
            }
            const ImageBlock = blocknote.createBlockSpec({
                type: blockType,
                propSchema: {
                    ...blocknote.defaultProps,
                    url: { default: '' },
                    cid: { default: '' },
                    link: { default: '' },
                    altText: { default: '', },
                    keyword: { default: '' },
                    photoId: { default: '' },
                    width: { default: 512 },
                    height: { default: 'auto' }
                },
                content: "none"
            }, {
                render: (block) => {
                    const wrapper = new components_4.Panel();
                    const { url, cid, link, altText, keyword, photoId, backgroundColor } = JSON.parse(JSON.stringify(block.props));
                    const customElm = new ScomImage_1(wrapper, { url, cid, link, altText, keyword, photoId, backgroundColor });
                    if (callbackFn)
                        callbackFn(customElm, block);
                    wrapper.appendChild(customElm);
                    return {
                        dom: wrapper
                    };
                },
                parseFn: () => {
                    return [
                        {
                            tag: `div[data-content-type=${blockType}]`,
                            contentElement: "[data-editable]"
                        },
                        {
                            tag: "p",
                            getAttrs: (element) => {
                                if (typeof element === "string")
                                    return false;
                                const child = element.firstChild;
                                if (!child)
                                    return false;
                                return getData(child);
                            },
                            priority: 400,
                            node: blockType
                        },
                        {
                            tag: "img",
                            getAttrs: (element) => {
                                if (typeof element === "string")
                                    return false;
                                return getData(element);
                            },
                            priority: 401,
                            node: blockType
                        }
                    ];
                },
                toExternalHTML: (block, editor) => {
                    const imageTag = document.createElement("img");
                    const src = block.props.url || "";
                    const alt = block.props.altText || "";
                    imageTag.setAttribute("src", src);
                    imageTag.setAttribute("alt", alt);
                    const wrapper = document.createElement("p");
                    wrapper.appendChild(imageTag);
                    return {
                        dom: wrapper
                    };
                },
                pasteRules: [
                    {
                        find: /https:\/\/\S+\.(jpg|jpeg|png|gif|webp|svg)/g,
                        handler(props) {
                            const { state, chain, range } = props;
                            const textContent = state.doc.resolve(range.from).nodeAfter?.textContent;
                            chain().BNUpdateBlock(state.selection.from, {
                                type: blockType,
                                props: {
                                    url: textContent
                                },
                            }).setTextSelection(range.from + 1);
                        }
                    },
                ]
            });
            const ImageSlashItem = {
                name: "Image Widget",
                execute: (editor) => {
                    const block = { type: blockType, props: { url: "" } };
                    if (typeof executeFn === 'function')
                        executeFn(editor, block);
                },
                aliases: ["image", "media"],
                group: "Media",
                icon: { name: 'image' },
                hint: this.i18n.get('$insert_an_image'),
            };
            const moduleData = {
                name: '@scom/scom-image',
                localPath: 'scom-image'
            };
            return { block: ImageBlock, slashItem: ImageSlashItem, moduleData };
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get url() {
            return this.model.url;
        }
        set url(value) {
            this.model.url = value;
            this.updateImgByUrl();
        }
        get fallbackUrl() {
            return this.model.fallbackUrl;
        }
        set fallbackUrl(value) {
            this.model.fallbackUrl = value;
            if (!this.img)
                return;
            this.img.fallbackUrl = value;
        }
        get altText() {
            return this.model.altText;
        }
        set altText(value) {
            this.model.altText = value;
            this.updateAltText();
        }
        get link() {
            return this.model.link;
        }
        set link(value) {
            this.model.link = value;
        }
        get cropData() {
            return this.model.cropData;
        }
        set cropData(value) {
            this.model.cropData = value;
            this.updateCropUI();
        }
        get data() {
            return this.model.getData();
        }
        set data(value) {
            this.model.setData(value);
        }
        customUI() {
            const self = this;
            const parentToolbar = this.closest('ide-toolbar');
            return {
                render: (data, onConfirm) => {
                    const vstack = new components_4.VStack(null, { gap: '1rem' });
                    const config = new index_1.default(null, { ...this.model.getData() });
                    const hstack = new components_4.HStack(null, {
                        verticalAlignment: 'center',
                        horizontalAlignment: 'end'
                    });
                    const button = new components_4.Button(null, {
                        caption: this.i18n.get('$confirm'),
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
                            onConfirm(true, { ...this.model.getData(), ...config.data });
                            self.updateCropUI();
                            if (parentToolbar)
                                parentToolbar.classList.remove('is-editing');
                        }
                    };
                    return vstack;
                }
            };
        }
        getConfigurators() {
            this.initModel();
            return this.model.getConfigurators(this.customUI());
        }
        getData() {
            return this.model.getData();
        }
        setData(value) {
            this.model.setData(value);
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.model.setTag(value);
        }
        updateImg() {
            if (!this.img)
                return;
            this.img.url = this.model.getUrlImage(true);
            this.img.fallbackUrl = this.model.fallbackUrl;
            const { width, height } = this.tag;
            if (width || height) {
                this.img.display = 'block';
                if (width) {
                    this.img.width = this.tag.width;
                }
                if (height) {
                    this.img.height = this.tag.height;
                }
            }
            if (this.pnlImage) {
                this.pnlImage.background.color = this.model.backgroundColor;
            }
            this.updateAltText();
            this.updateCropUI();
        }
        updateImgByUrl() {
            if (!this.img)
                return;
            this.img.url = this.model.getUrlImage();
        }
        updateAltText() {
            if (!this.img)
                return;
            const imgElm = this.img.querySelector('img');
            if (imgElm) {
                imgElm.setAttribute('alt', this.model.altText);
            }
        }
        updateImageByTag() {
            const { width, height, maxWidth, align, link, margin, padding, border } = this.tag;
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
                if (margin) {
                    this.pnlImage.margin = margin;
                }
                if (padding) {
                    this.pnlImage.padding = padding;
                }
            }
            if (this.img) {
                this.img.display = "block";
                this.img.width = width;
                this.img.height = height;
                if (border)
                    this.img.border = border;
                this.updateCropUI();
            }
            if (link) {
                this.classList.add('pointer');
            }
            else {
                this.classList.remove('pointer');
            }
        }
        updateCropUI() {
            if (!this.img)
                return;
            const cropData = this.cropData;
            const imgTag = this.img.querySelector('img');
            if (!imgTag)
                return;
            if (cropData) {
                const { left, top, width, height, aspectRatio, type = interface_2.CropType.PREEFORM } = cropData;
                this.pnlImage.classList.add('cropped-pnl');
                const parentWidth = this.pnlImage.offsetWidth;
                const right = left + width;
                const bottom = top + height;
                const scale = parentWidth / (width / 100 * parentWidth);
                if (type === interface_2.CropType.CIRCLE) {
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
            const link = this.link || this.getAttribute('link', true);
            if (link !== undefined && !this.isInitedLink) {
                this.isInitedLink = true;
                this.link = link;
            }
        }
        onImageClick() {
            if (!this.tag.link)
                return;
            window.open(this.tag.link, '_blank');
        }
        initModel() {
            if (!this.model) {
                this.model = new model_1.Model(this, {
                    updateImg: this.updateImg.bind(this),
                    updateImgByTag: this.updateImageByTag.bind(this)
                });
            }
        }
        init() {
            this.i18n.init({ ...translations_json_2.default });
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
                this.model.photoId = this.options?.photoId || '';
                this.model.keyword = this.options?.keyword || '';
                const tag = this.getAttribute('tag', true);
                if (tag)
                    this.setTag(tag);
            }
        }
        render() {
            return (this.$render("i-panel", { id: 'pnlImgWrap', height: "100%" },
                this.$render("i-vstack", { id: 'pnlImage', class: "img-wrapper" },
                    this.$render("i-image", { id: 'img', class: "custom-img", fallbackUrl: "https://placehold.co/600x400?text=No+Image", onClick: this.onImageClick.bind(this) }))));
        }
    };
    ScomImage = ScomImage_1 = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-image', {
            icon: 'stop',
            props: {
                cid: { type: 'string', default: '' },
                url: { type: 'string', default: '' },
                altText: { type: 'string', default: '' },
                link: { type: 'string', default: '' },
                cropData: { type: 'object', default: {} },
                data: { type: 'object' }
            },
            className: 'ScomImage',
            events: {},
            dataSchema: {
                type: 'object',
                properties: {
                    url: {
                        type: 'string'
                    },
                    cid: {
                        type: 'string',
                        required: false
                    },
                    link: {
                        type: 'string',
                        required: false
                    },
                    altText: {
                        type: 'string',
                        required: false
                    },
                    cropData: {
                        type: 'object',
                        required: false
                    }
                }
            }
        })
    ], ScomImage);
    exports.default = ScomImage;
});
