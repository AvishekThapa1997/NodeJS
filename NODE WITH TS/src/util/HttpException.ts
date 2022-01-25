class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number = 500, message: string = "Something Went Wrong") {
    super(message);
    (this.status = status), (this.message = message);
  }
}
export default HttpException;
