export interface ICommand {
  execute(): void;
  undo(): void;
  redo(): void;
}

interface IJSONSchema { // TODO: move to use in components
  type: 'integer' | 'number' | 'boolean' | 'string' | 'object';
  format?: 'date' | 'time' | 'date-time';
  enum?: string[];
  oneOf?: { const: string, title: string }[];
  required?: string[];
  properties?: {
    [key: string]: IJSONSchema
  };
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  default?: string | number;
  description?: string;
}

export interface IPageBlockAction {
	name: string;
	icon: string;
	command: (builder: any, userInputData: any) => ICommand;
	userInputDataSchema: IJSONSchema;
}

export interface PageBlock {
  // Properties
  getActions: () => IPageBlockAction[];
  getData: () => any;
  setData: (data: any) => Promise<void>;
  getTag: () => any;
  setTag: (tag: any) => Promise<void>

  // defaultEdit?: boolean;
  // tag?: any;
  // validate?: () => boolean;
  // Page Events
  // readonly onEdit: () => Promise<void>;
  // readonly onConfirm: () => Promise<void>;
  // readonly onDiscard: () => Promise<void>;
  // // onClear: () => void;

  // // Page Block Events
  // edit: () => Promise<void>;
  // confirm: () => Promise<void>;
  // discard: () => Promise<void>;
  // config: () => Promise<void>;
}

export interface IImage {
	url: string;
	altText: string;
  backgroundColor: string;
  height: number | string;
  width: number | string;
	link: string;
}
