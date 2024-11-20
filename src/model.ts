import { IDataSchema, IUISchema, Module } from '@ijstech/components';
import configData from './data.json';
import { ICropData, IImage } from './interface';
import { getIPFSGatewayUrl, setDataFromSCConfig } from './store';

interface IModelOptions {
  updateImg: () => void;
  updateImgByTag: () => void;
}

export class Model {
  private module: Module;
  private _data: IImage = { url: '' };
  private options: IModelOptions = {
    updateImg: () => { },
    updateImgByTag: () => { }
  };

  constructor(module: Module, options: IModelOptions) {
    this.module = module;
    this.options = options;
    if (configData) {
      setDataFromSCConfig(configData);
    }
  }

  get url() {
    return this._data.url ?? '';
  }
  set url(value: string) {
    this._data.url = value;
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

  get cropData() {
    return this._data.cropData;
  }
  set cropData(value: ICropData) {
    this._data.cropData = value;
  }

  get photoId() {
    return this._data.photoId ?? '';
  }
  set photoId(value: string) {
    this._data.photoId = value;
  }

  get keyword() {
    return this._data.keyword ?? '';
  }
  set keyword(value: string) {
    this._data.keyword = value;
  }

  get backgroundColor() {
    return this._data.backgroundColor ?? '';
  }

  getConfigurators(formAction: any) {
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
          return this._getActions('Editor', formAction)
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private _getActions(target: string, formAction: any) {
    const editAction = {
      name: 'Edit',
      icon: 'edit',
      command: (builder: any, userInputData: any) => {
        let oldData: IImage = { url: '' };
        return {
          execute: () => {
            oldData = JSON.parse(JSON.stringify(this._data));
            if (builder?.setData) builder.setData(userInputData);
            this.setData(userInputData);
          },
          undo: () => {
            if (builder?.setData) builder.setData(oldData);
            this.setData(oldData);
          },
          redo: () => { }
        }
      },
      userInputDataSchema: {
        type: 'object',
        properties: {
          url: {
            required: true,
            type: 'string'
          }
        }
      }
    };
    if (target === 'Editor') return [editAction];
    return [
      {
        name: 'Crop',
        icon: 'crop',
        command: (builder: any, userInputData: any) => {
          let oldData: IImage = { url: '' };
          return {
            execute: () => {
              oldData = JSON.parse(JSON.stringify(this._data));
              if (builder?.setData) builder.setData(userInputData);
              this.setData(userInputData);
            },
            undo: () => {
              if (builder?.setData) builder.setData(oldData);
              this.setData(oldData);
            },
            redo: () => { }
          }
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

  private getWidgetSchemas() {
    const propertiesSchema: IDataSchema = {
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
    const themesSchema: IUISchema = {
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
    }
  }

  async setData(value: IImage) {
    this._data = value;
    this.options.updateImg();
  }

  getData() {
    return this._data;
  }

  getTag() {
    return this.module.tag;
  }

  setTag(value: any) {
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

  private updateTag(type: 'light' | 'dark', value: any) {
    this.module.tag[type] = this.module.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.module.tag[type][prop] = value[prop];
    }
  }

  private updateStyle(name: string, value: any) {
    if (value) {
      this.module.style.setProperty(name, value);
    } else {
      this.module.style.removeProperty(name);
    }
  }

  private updateTheme() {
    const themeVar = document.body.style.getPropertyValue('--theme') || 'light';
    this.updateStyle('--text-primary', this.module.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.module.tag[themeVar]?.backgroundColor);
  }

  getUrlImage(checkCid?: boolean) {
    let url = 'https://placehold.co/600x400?text=No+Image';
    if (checkCid && this._data.cid) {
      const ipfsGatewayUrl = getIPFSGatewayUrl();
      url = ipfsGatewayUrl + this._data.cid;
    } else if (this._data.url?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl();
      url = this._data.url.replace('ipfs://', ipfsGatewayUrl);
    } else {
      url = this._data.url || 'https://placehold.co/600x400?text=No+Image';
    }
    return url;
  }
}
