import {NodeType} from "../enums/node-type";

export const NODE_PARAMS_MAP = {

  [NodeType.IncomingCall]: {
    name: 'Incoming call',
    icon: 'add_call',
    color: 'var(--node-color-incoming)',
    isExpandable: false,
  },
  [NodeType.UserInput]: {
    name: 'IVR',
    icon: 'call_log',
    color: 'var(--node-color-userinput)',
    isExpandable: true,
  },
  [NodeType.PlayText]: {
    name: 'Play text',
    icon: 'wifi_calling_3',
    color: 'var(--node-color-playtext)',
    isExpandable: true,
  },
  [NodeType.ToOperator]: {
    name: 'To operator',
    icon: 'wifi_calling_3',
    color: 'var(--node-color-operator)',
    isExpandable: false,
  },
  [NodeType.Disconnect]: {
    name: 'Disconnect',
    icon: 'phone_disabled',
    color: 'var(--node-color-disconnect)',
    isExpandable: false,
  },
};
