import {Sequelize, Options} from "sequelize"
import config from "config";

@singleton
class Conn {
  id: number;
  current: Sequelize;
  constructor() {
    const dbConfig:Options = config.get('database-config')
    this.id = Math.random()
    this.current = new Sequelize(dbConfig)

  }
}
const SINGLE_KEY = Symbol()
type Single<T extends new (args: any[]) => any> = T & {
  [SINGLE_KEY]: T extends new (args: any[]) => infer I ? I: never
}

function singleton<T extends new (...args:any[]) => any>(Cls: T) {
  const wrapped = new Proxy(Cls, {
    construct(target: Single<T>, args, newTarget) {
      if (target.prototype !== newTarget.prototype) {
        return Reflect.construct(target, args, newTarget)
      }
      if (!target[SINGLE_KEY]) {
        target[SINGLE_KEY] = Reflect.construct(target, args, newTarget)
      }
      return target[SINGLE_KEY]
    }
  })
  return wrapped
}

export const DB = Conn
