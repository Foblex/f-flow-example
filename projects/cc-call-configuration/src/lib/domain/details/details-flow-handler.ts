import { DetailsFlowRequest } from './details-flow-request';
import { IHandler } from '@foblex/core';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { IFlowModel } from '@domain';
import { IFlowViewModel } from '../i-flow-view-model';
import { MapToFlowViewModelHandler } from '../to-view-model/map-to-flow-view-model-handler';
import { MapToFlowViewModelRequest } from '../to-view-model/map-to-flow-view-model-request';

@Injectable({
  providedIn: 'root'
})
export class DetailsFlowHandler implements IHandler<DetailsFlowRequest, IFlowViewModel> {

  constructor(
    private store: Store
  ) {
  }

  public handle(request: DetailsFlowRequest): IFlowViewModel {
    const flow = this.getFlow(request.key);

    const result = new MapToFlowViewModelHandler().handle(
      new MapToFlowViewModelRequest(flow)
    );

    return result;
  }

  private getFlow(key: string): IFlowModel {
    const entities: IFlowModel[] = this.store.selectSnapshot(x => x.flows.flows);

    const result = entities.find((x) => x.key === key);
    if (!result) {
      throw new Error(`Flow with key ${ key } not found`);
    }
    return result;
  }
}
