import {Injectable} from "@angular/core";
import {Mutator} from "@foblex/mutator";
import {IFlowState} from "./models/i-flow-state";

@Injectable({
  providedIn: 'root'
})
export class FlowState extends Mutator<IFlowState> {
}
