import UplaodedFile from "../models/upload/UploadedFile";
import UploadModel from "../models/upload/UploadModel";

export default interface IUploader {
    upload(model: UploadModel): Promise<UplaodedFile>;
}