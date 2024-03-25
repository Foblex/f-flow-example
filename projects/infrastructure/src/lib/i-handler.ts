export interface IHandler<TRequest, TResponse> {

  handle(request: TRequest): TResponse;
}
