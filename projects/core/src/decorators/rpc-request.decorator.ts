import 'reflect-metadata';

export const NAMESPACE_METADATA = 'namespace';
export const METHOD_METADATA = 'method';

export function RpcRequest(namespace: string, method: string): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(NAMESPACE_METADATA, namespace, target.prototype);
    Reflect.defineMetadata(METHOD_METADATA, method, target.prototype);
  };
}
