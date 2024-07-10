import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { firebaseModule } from "./firebase.js";
import EventEmitter from "events";
import { errorHandler } from "../../components/Toast/index.jsx";
import { getCompressImage, prefixTimeStampAndUUID } from "../utils.js";

export const storage = getStorage(firebaseModule.app);
const storageMode = import.meta.env.MODE[0];

const storageFB = {
  storageRef: ref(storage),
  getRef: (str, secureFolder) => {
    const secureFolderPath = secureFolder ? "s/" : "";
    return ref(storage, `${storageMode}/${secureFolderPath}${str}`);
  },
  get avatarsRef() {
    return this.getRef("avatars");
  },
  get imagesRef() {
    return this.getRef("images");
  },
  get secureImagesRef() {
    return this.getRef("s/images");
  },
  getDownloadURL: async (imgRef) => {
    if (!imgRef) {
      return "";
    }

    const downloadURL = await getDownloadURL(imgRef);
    return downloadURL;
  },
  getImageRef: function (path = "", name, secureFolder = false) {
    return this.getRef(`images/${path ? `${path}/` : ""}${name}`, secureFolder);
  },
  // can be Uint8Array/file
  uploadBytes: async ({ storageRef, file, metadata }) => {
    const res = await uploadBytes(storageRef, file, metadata);
    return res;
  },
  // can be Uint8Array/file
  uploadImageFile: async function ({
    path = "",
    name,
    generateUniqueName = true,
    file,
    metadata = null,
    secureFolder = false,
    compress = true,
    maxWidth,
    maxHeight,
  }) {
    if (!file) {
      errorHandler("no image file");
      return;
    }
    let imgFileUpload = file;
    let imageName = name;
    if (generateUniqueName) {
      imageName = prefixTimeStampAndUUID(imageName, 4);
    }

    const imgRef = this.getImageRef(path, imageName, secureFolder);
    if (compress) {
      imgFileUpload = await getCompressImage({
        file,
        maxWidth,
        maxHeight,
      });
    }
    const res = await uploadBytes(imgRef, imgFileUpload, metadata);
    const downloadURL = await getDownloadURL(res.ref);
    res.downloadURL = downloadURL;

    return res;
  },
  // ref https://firebase.google.com/docs/storage/web/upload-files?authuser=0
  // can be Base64/Base64url/Data URL string
  uploadString: async (storageRef, str) => {
    const res = await uploadString(storageRef, str);
    return res;
  },
  // ref https://firebase.google.com/docs/storage/web/upload-files?authuser=0
  // can be Base64/Base64url/Data URL string
  uploadBytesResumable: ({ storageRef, file, metadata }) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    const storageEventEmitter = new EventEmitter();

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case "paused":
            storageEventEmitter.emit("paused", progress);
            // console.log('Upload is paused');
            break;
          case "running":
            storageEventEmitter.emit("running", progress);
            // console.log('Upload is running');
            break;
        }
        storageEventEmitter.emit("running", progress);
      },
      (error) => {
        errorHandler(`error on uploading - ${error.message}`);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            storageEventEmitter.emit("error", "unauthorized");
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            storageEventEmitter.emit("error", "canceled");
            // User canceled the upload
            break;

          case "storage/unknown":
            storageEventEmitter.emit("error", "unknown");
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          storageEventEmitter.emit("done", downloadURL);
          // console.log('File available at', downloadURL);
        });
      }
    );
    return { uploadTask, storageEventEmitter };
  },
};
export default storageFB;
