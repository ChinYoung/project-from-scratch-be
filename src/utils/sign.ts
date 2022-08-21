import config from "config";
import {createHash} from "crypto";

export function generateSig(input:Object, secret: string):string {
  const str = formatObject(input)
  const md5 = createHash('md5')
  md5.update(`${str}${secret}`)
  return encodeURIComponent(md5.digest('base64'))
}

function formatObject(input:Object):string {
  const params = Object.entries(input)
  const str = params
    .filter(([key, value]) => value != undefined && key !== 'sig')
    .map(function([key, value]) {
      if (Array.isArray(value)) {
        return `${key}=${formatArray(value)}`
      }
      if (typeof value === 'object') {
        return `${key}=${formatObject(value)}`
      }
      return `${key}=${value}`
    })
    .join('&')
  return `{${str}}`
}

function formatArray(input: any[]):string {
  const str = input
    .map(function(item) {
      if (Array.isArray(item)) {
        return formatArray(item)
      }
      if (typeof item === 'object') {
        return formatObject(item)
      }
      return item
    })
    .join(',')
  return `[${str}]`
}
