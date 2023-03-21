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
    exports.getIPFSGatewayUrl = exports.setIPFSGatewayUrl = exports.setDataFromSCConfig = exports.state = void 0;
    ///<amd-module name='@scom/scom-image/store.ts'/> 
    exports.state = {
        ipfsGatewayUrl: ""
    };
    const setDataFromSCConfig = (options) => {
        if (options.ipfsGatewayUrl) {
            exports.setIPFSGatewayUrl(options.ipfsGatewayUrl);
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
});
define("@scom/scom-image/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_1.Styles.Theme.ThemeVars;
    components_1.Styles.cssRule('#pnlImage', {
        $nest: {
            '.custom-img img': {
                objectFit: 'cover',
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
define("@scom/scom-image/scconfig.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-image/scconfig.json.ts'/> 
    exports.default = {
        "name": "@pageblock-image/main",
        "version": "0.1.0",
        "env": "",
        "moduleDir": "src",
        "main": "@pageblock-image/main",
        "modules": {
            "@pageblock-image/main": {
                "path": "main"
            },
            "@pageblock-image/global": {
                "path": "global"
            },
            "@pageblock-image/command": {
                "path": "command"
            },
            "@pageblock-image/store": {
                "path": "store"
            }
        },
        "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/"
    };
});
define("@scom/scom-image", ["require", "exports", "@ijstech/components", "@scom/scom-image/store.ts", "@scom/scom-image/scconfig.json.ts", "@scom/scom-image/index.css.ts"], function (require, exports, components_2, store_1, scconfig_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    };
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
    };
    const cropSchema = {
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
    };
    let ScomImage = class ScomImage extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                url: '',
                altText: '',
                backgroundColor: '',
                link: ''
            };
            this.oldData = {
                url: '',
                altText: '',
                backgroundColor: '',
                link: ''
            };
            this.originalUrl = '';
            this.isReset = false;
            this._oldURl = '';
            this.isInitedLink = false;
            if (scconfig_json_1.default)
                store_1.setDataFromSCConfig(scconfig_json_1.default);
        }
        init() {
            super.init();
            this.setTag({ width: '100%', height: 'auto' });
            this.url = this.getAttribute('url', true);
            this.altText = this.getAttribute('altText', true);
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
            this.data.url = value || '';
            if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = store_1.getIPFSGatewayUrl();
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
            this.setLink();
        }
        getConfigSchema() {
            return configSchema;
        }
        getData() {
            return this.data;
        }
        async updateImg() {
            var _a;
            this.uploader.visible = false;
            this.linkStack.visible = false;
            this.imgLink.visible = true;
            if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = store_1.getIPFSGatewayUrl();
                this.img.url = this.data.url.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.img.url = this.data.url;
            }
            if (this.tag.width || this.tag.height) {
                this.img.display = 'block';
                this.tag.width && (this.img.width = this.tag.width);
                this.tag.width && (this.img.height = this.tag.height);
            }
            const imgElm = this.img.querySelector('img');
            imgElm && imgElm.setAttribute('alt', this.data.altText || '');
        }
        async setData(value) {
            if (!this.checkValidation(value))
                return;
            this.oldData = this.data;
            this.data = value;
            if (!this.originalUrl)
                this.originalUrl = this.data.url;
            const uploader = document.getElementById('uploader');
            const imageElm = uploader === null || uploader === void 0 ? void 0 : uploader.getElementsByTagName('img')[0];
            if (imageElm)
                imageElm.src = value.url;
            else
                this.edtLink.value = value.url;
            this.updateImg();
            this.pnlImage.background.color = value.backgroundColor || '';
        }
        async setLink() {
            if (this.data.link)
                this.imgLink.link = await components_2.Link.create({ href: this.data.link, target: '_blank' });
            else
                this.imgLink.link = await components_2.Link.create({ target: '_self' });
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
        getActions() {
            const actions = [
                {
                    name: 'Crop (Enter)',
                    icon: 'crop-alt',
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                if (!userInputData)
                                    return;
                                if (!this.isReset)
                                    this.oldCropData = this.newCropData;
                                this.newCropData = userInputData;
                                this.onCrop(this.newCropData);
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                                this.isReset = false;
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                if (!this.oldCropData) {
                                    this.img.url = this.data.url = this.originalUrl;
                                    this.isReset = true;
                                }
                                else {
                                    this.onCrop(this.oldCropData);
                                    this.isReset = false;
                                }
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: cropSchema
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
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(userInputData);
                                this.setData(userInputData);
                            },
                            undo: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.oldData);
                                this.setData(this.oldData);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: settingSchema
                }
            ];
            return actions;
        }
        checkValidation(value) {
            return !!value.url;
        }
        onCrop(data) {
            const { x: newX, y: newY, width: newWidth, height: newHeight } = data;
            let img_uploader = this.uploader.getElementsByTagName('img')[0];
            // originalImage in form of img
            const originalImage = document.createElement('img');
            originalImage.src = (img_uploader === null || img_uploader === void 0 ? void 0 : img_uploader.src) || this.data.url;
            // create a new empty canvas
            let canvas = document.createElement('canvas');
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            const ctx = canvas.getContext('2d');
            var ptrn = ctx.createPattern(originalImage, 'no-repeat');
            ctx.fillStyle = ptrn;
            // converted the originalImage to canvas
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // set the canvas size to the new width and height
            canvas.width = newWidth;
            canvas.height = newHeight;
            // draw the image
            ctx.drawImage(originalImage, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
            this.img.url = canvas.toDataURL();
            this.data.url = canvas.toDataURL();
        }
        async onChangedImage(control, files) {
            let newUrl = '';
            this._oldURl = this.data.url;
            if (files && files[0]) {
                newUrl = (await this.uploader.toBase64(files[0]));
                this.originalUrl = newUrl;
            }
            this.setData(Object.assign(Object.assign({}, this.data), { url: newUrl }));
            const builder = this.parent.closest('ide-toolbar');
            if (builder)
                builder.setData(Object.assign(Object.assign({}, this.data), { url: newUrl }));
        }
        onRemovedImage(control, file) {
            this.data.url = this.edtLink.value || '';
            this._oldURl = this.edtLink.value || '';
        }
        onChangedLink(source) {
            const newUrl = source.value;
            this.originalUrl = newUrl;
            this.setData(Object.assign(Object.assign({}, this.data), { url: newUrl }));
            const builder = this.parent.closest('ide-toolbar');
            if (builder)
                builder.setData(Object.assign(Object.assign({}, this.data), { url: newUrl }));
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-vstack", { id: 'pnlImage' },
                    this.$render("i-upload", { id: 'uploader', multiple: false, height: '100%', visible: false, onChanged: this.onChangedImage, onRemoved: this.onRemovedImage }),
                    this.$render("i-label", { id: "imgLink", display: "block", maxHeight: "100%", maxWidth: "100%" },
                        this.$render("i-image", { id: 'img', maxHeight: "100%", maxWidth: "100%", linkTo: this.imgLink, class: "custom-img" })),
                    this.$render("i-panel", { id: 'linkStack', visible: false },
                        this.$render("i-label", { caption: 'URL' }),
                        this.$render("i-input", { id: 'edtLink', width: '100%', onChanged: this.onChangedLink.bind(this) })))));
        }
    };
    ScomImage = __decorate([
        components_2.customModule,
        components_2.customElements('i-scom-image')
    ], ScomImage);
    exports.default = ScomImage;
});
