class AppError extends Error {
    constructor (message , sttausCode){
        super(message);
        this.sttausCode = sttausCode;
        this.status=`${statusCode}`.startsWith("4")
        ? "fall"
        :"error";
        Error.captureStackTrace(this,this.constructor);

    }
}
export default AppError;