export interface ParamResult {
  res: boolean;
  msg?: string;
}

export type SuccessFun = () => void;
export type FailFun = (error: Error) => void;
export type CompleteFun = () => void;

function upperCaseFirstLetter(string: string) {
  if (typeof string !== 'string') {
    return string;
  }
  string = string.replace(/^./, match => match.toUpperCase());
  return string;
}

function getParameterError({
  name = '',
  para,
  correct,
  wrong,
}: {
  name?: string;
  para?: any;
  correct: string;
  wrong: any;
}) {
  const parameter = para ? `parameter.${para}` : 'parameter';
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong);
  return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`;
}

export function shouldBeObject(target: any): ParamResult {
  if (target && typeof target === 'object') {
    return { res: true };
  }
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target,
    }),
  };
}

export function isFunction(f: any) {
  return typeof f === 'function';
}

export function successHandler(success?: SuccessFun, complete?: CompleteFun): Promise<boolean> {
  success && isFunction(success) && success();
  complete && isFunction(complete) && complete();
  return Promise.resolve(true);
}

export function errorHandler(error: Error, fail?: FailFun, complete?: CompleteFun) {
  fail && isFunction(fail) && fail(error);
  complete && isFunction(complete) && complete();
  return Promise.reject(error);
}

export default {
  shouldBeObject,
  isFunction,
  successHandler,
  errorHandler,
};
