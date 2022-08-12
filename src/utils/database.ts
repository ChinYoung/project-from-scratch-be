import {Sequelize, Options} from "sequelize"
import config from "config";
import { createClient, RedisFunctions, RedisModules, RedisScripts, RedisClientType } from "redis";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

@singleton
class Conn {
  id: number;
  current: Sequelize;
  constructor() {
    const dbConfig:Options = config.get('database-config')
    this.id = tzDayjs().valueOf()
    this.current = new Sequelize(dbConfig)
  }
}

@singleton
class RedisProxy {
  id: number
  current: RedisClientType<RedisModules, RedisFunctions, RedisScripts>
  ready: boolean
  constructor () {
    this.id = tzDayjs().valueOf()
    const client = createClient({
      password: 'libraredis'
    })
    client.on('error', (error:Error) => {
      console.log('redis error:', error.message)
      console.log(error.stack)
    })
    this.current = client
  }

  async init() {
    if (this.ready) {
      return
    }
    console.log('init');
    await this.current.connect()
    this.ready = true
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

dayjs.extend(utc)
dayjs.extend(timezone)
const tzDayjs = (time: string | number | void) => time ? dayjs(time) : dayjs()

export const DB = Conn
export const Redis = RedisProxy
