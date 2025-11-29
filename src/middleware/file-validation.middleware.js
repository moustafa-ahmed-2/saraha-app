
// import fs from "node:fs"
// import {fileTypeFromBuffer} from "file-type"

// export const fileValidationMiddleware = (allowedTypes=["image/jpeg", "image/png"])=>{

// return async (req,res,next) => {

//   async (req, res, next) => {
//   try {
//     // get the file path
//     const filePath = req.file.path;
//     // read the file and return buffer
//     const buffer = fs.readFileSync(filePath);
//     // get the file type
//     const type = await fileTypeFromBuffer(buffer);
//     // validate
//     // const allowedTypes = ["image/jpeg", "image/png"];
//     if (!type || !allowedTypes.includes(type.mime))
//       return next(new Error("Invalid file type"));

//     return next();
//   } catch (error) {
//     return next(new Error("Internal server error"));
//   }
// }



// }


// }







import fs from "node:fs";
import { fileTypeFromBuffer } from "file-type";

export const fileValidationMiddleware = (allowedTypes = ["image/jpeg", "image/png"]) => {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return next(new Error("No file uploaded"));
      }

      const filePath = req.file.path;

      // read the file buffer
      const buffer = fs.readFileSync(filePath);

      // detect file type
      const type = await fileTypeFromBuffer(buffer);

      // validate file type
      if (!type || !allowedTypes.includes(type.mime)) {
        return next(new Error("Invalid file type"));
      }

      // pass control to next middleware
      next();

    } catch (error) {
      next(new Error("Internal server error"));
    }
  };
};
