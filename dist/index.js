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
define("@scom/scom-image/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-image/data.json.ts'/> 
    exports.default = {
        ipfsGatewayUrl: "https://ipfs.scom.dev/ipfs/",
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
define("@scom/scom-image", ["require", "exports", "@ijstech/components", "@scom/scom-image/store.ts", "@scom/scom-image/data.json.ts", "@scom/scom-image/index.css.ts"], function (require, exports, components_2, store_1, data_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let ScomImage = class ScomImage extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                cid: '',
                url: '',
                altText: '',
                backgroundColor: '',
                link: ''
            };
            this.originalUrl = '';
            this.isInitedLink = false;
            if (data_json_1.default)
                store_1.setDataFromSCConfig(data_json_1.default);
        }
        init() {
            super.init();
            this.setTag({ width: '100%', height: 'auto' });
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                let cid = this.getAttribute('cid', true);
                const ipfsGatewayUrl = store_1.getIPFSGatewayUrl();
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
                    userInputDataSchema: settingSchema
                }
            ];
            return actions;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            if (!this.originalUrl)
                this.originalUrl = this.data.url;
            this.updateImg();
            this.pnlImage.background.color = value.backgroundColor || '';
        }
        updateImg() {
            var _a;
            if (this.data.cid) {
                const ipfsGatewayUrl = store_1.getIPFSGatewayUrl();
                this.img.url = ipfsGatewayUrl + this.data.cid;
            }
            else if ((_a = this.data.url) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = store_1.getIPFSGatewayUrl();
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
        components_2.customModule,
        components_2.customElements('i-scom-image')
    ], ScomImage);
    exports.default = ScomImage;
});
