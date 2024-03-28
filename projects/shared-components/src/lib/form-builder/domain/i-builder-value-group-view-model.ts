import { IBuilderValueControlViewModel } from './i-builder-value-control-view-model';
import { IFormBuilderValueGroup } from './external-value';

export interface IBuilderValueGroupViewModel extends IFormBuilderValueGroup {

  controls: IBuilderValueControlViewModel[];
}
