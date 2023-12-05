// TODO: Build out error handling
export class ErrorBase<T extends string> extends Error {
  name: T;
  message: string;
  cause: any;
  
  constructor(name: T, message: string, cause?: any) {
    super(message);
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}
