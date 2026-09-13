import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (req , file , cb )=> {
    if(file.mimetype === "application/pdf"){
        cb(null , true);

    }else {
        cb(new Error ("Only PDF files are allowed") , false);

    }

}
const upload = multer({
    storage,
    limits:{
        fileSize : 2*1024*1024 , //2MB
    },
    fileFilter
});
export default upload;