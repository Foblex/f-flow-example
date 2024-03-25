import { IMap } from '@infrastructure';
import { ENodeType } from '@domain';

export interface INodeStaticMapItem {

  name: string;

  icon: string;

  color: string;

  isExpandable: boolean;
}

export const NODE_STATIC_MAP: IMap<INodeStaticMapItem> = {

  [ ENodeType.IncomingCall ]: {
    name: 'Incoming call',
    icon: 'add_call',
    color: '#39b372',
    isExpandable: false,
  },
  [ ENodeType.UserInput ]: {
    name: 'IVR',
    icon: 'call_log',
    color: '#2676ff',
    isExpandable: true,
  },
  [ ENodeType.PlayText ]: {
    name: 'Play text',
    icon: 'wifi_calling_3',
    color: '#AF94FF',
    isExpandable: true,
  },
  [ ENodeType.ToOperator ]: {
    name: 'To operator',
    icon: 'wifi_calling_3',
    color: '#ffb62a',
    isExpandable: false,
  },
  [ ENodeType.Disconnect ]: {
    name: 'Disconnect',
    icon: 'phone_disabled',
    color: '#ff859b',
    isExpandable: false,
  },
};
