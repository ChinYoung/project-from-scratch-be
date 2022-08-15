export class HttpException extends Error implements IHttpException{
  message: string
  code: number
  data?: any
  constructor(code:number, message:string, data?:any) {
    super(message)
    this.code = code
    this.data = data
    Object.setPrototypeOf(this, HttpException.prototype)
  }
}

interface IHttpException {
  code: number,
  message: string,
  data?: any
}