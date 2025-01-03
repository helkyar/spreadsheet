export const safeEval = (expression: string, isSafe: boolean) => {
  try {
    if (!isSafe && isPolluted(expression)) return '##Error: security concerns'
    return eval(expression)
  } catch (error) {
    return `##Error: ${error}`
  }
}
export function isPolluted(expression: string) {
  const securityConcerns = [
    'func',
    'function',
    '=>',
    '=',
    'Function',
    'fetch',
    'XMLHttpRequest',
    'javascript',
    'void',
    'eval',
    'setTimeout',
    'setInterval',
    'setImmediate',
    'clearTimeout',
    'clearInterval',
    'clearImmediate',
    'process',
    'global',
    'require',
    'module',
    'import',
    'export',
    'window',
    'document',
    'localStorage',
    'sessionStorage',
    'cookie',
    'indexedDB',
    'webkitIndexedDB',
    'mozIndexedDB',
    'msIndexedDB',
    'openDatabase',
    'alert',
    'prompt',
    'confirm',
    'console',
    'debugger',
    'postMessage',
    'onmessage',
    'onerror',
    'onload',
    'onunload',
    'onbeforeunload',
    'onpopstate',
    'onstorage',
    'onfocus',
    'onblur',
    'onresize',
    'onmove',
    'onopen',
    'onclose',
    'onquit',
    'onabort',
    'oncancel',
    'oncanplay',
    'onchange',
    'onclick',
    'oncontextmenu',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'ondurationchange',
    'onemptied',
    'onended',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onmousedown',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onmousewheel',
    'onpause',
    'onplay',
    'onplaying',
    'onprogress',
    'onratechange',
    'onreset',
    'onscroll',
    'onseeked',
    'onseeking',
    'onselect',
    'onshow',
    'onstalled',
    'onsubmit',
    'onsuspend',
    'ontimeupdate',
    'onvolumechange',
    'onwaiting',
    'onwheel',
    'oncopy',
    'oncut',
    'onpaste',
    'onbeforecopy',
    'onbeforecut',
    'onbeforepaste',
    'onsearch',
    'onfullscreenchange',
    'onfullscreenerror',
    'onwebkitfullscreenchange',
    'onwebkitfullscreenerror',
    'onhashchange',
    'onpageshow',
    'onpagehide',
    'Event',
  ]
  for (const securityConcern of securityConcerns) {
    if (expression.includes(securityConcern)) return true
  }
}
