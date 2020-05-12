function upperCaseFirstLetter(string: string) {
  if (typeof string !== 'string') {
    return string;
  }
  string = string.replace(/^./, (match) => match.toUpperCase());
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

export function isUrl(value: string) {
  const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

  const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
  const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;
  if (typeof value !== 'string') {
    return false;
  }

  let match = value.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  let everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
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

export const HEADER_CONFIG_MAP: KV = {
  navigationBarTitleText: 'title', // 导航栏标题文字内容
  navigationBarTextStyle: 'headerTintColor', // 导航栏标题颜色，仅支持 black/white
  navigationBarBackgroundColor: 'backgroundColor', // 导航栏背景颜色
  enablePullDownRefresh: 'enablePullDownRefresh', // 是否全局开启下拉刷新，暂时放这里吧
  navigationStyle: 'navigationStyle', // 导航栏样式，仅支持以下值：default 默认样式 custom 自定义导航栏，只保留右上角胶囊按钮
  disableScroll: 'disableScroll', // 设置为 true 则页面整体不能上下滚动；只在页面配置中有效，无法在 app.json 中设置该项
  backgroundColor: 'backgroundColor', // 容器背景颜色
  stackNavigatorOptions: 'stackNavigatorOptions', // 支持直接透传createStackNavigator方法的配置
  rn: 'rn', // react native 的独立属性
};

export function getNavigationOption(config: KV) {
  let navigationOption: KV = {};
  if (typeof config !== 'object') {
    return navigationOption;
  }
  Object.keys(config).forEach((key) => {
    if (HEADER_CONFIG_MAP[key]) {
      navigationOption[HEADER_CONFIG_MAP[key]] = config[key];
    }
  });
  return navigationOption;
}
