const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
var s_path = require("path");

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket(process.env.STORAGE_BUCKET);

const UploadFile = (filepath) => {
  return new Promise((res, rej) => {
    try {
      const blob = bucket.file(filepath);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        rej({ message: err.message });
      });

      blobStream.on("finish", async (data) => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );

        try {
          await bucket.file(filepath).makePublic();
        } catch {
          return rej({
            message: `Uploaded the file successfully: ${filepath}, but public access is denied!`,
            url: publicUrl,
          });
        }

        res({
          message: "Uploaded the file successfully: " + filepath,
          url: publicUrl,
        });
      });

      blobStream.end(filepath.buffer);
    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        rej({
          message: "File size cannot be larger than 2MB!",
        });
      }

      rej({
        message: `Could not upload the file: ${filepath}. ${err}`,
      });
    }
  });
};

const UploadBuffer = async (Buffer) => {
  return new Promise((res, rej) => {
    try {
      const file = bucket.file("tester.jpg");

      file.save(Buffer, (err) => {
        if (!err) {
        } else {
          return rej({
            message: `Error ${err}`,
          });
        }
      });
      const blobStream = file.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        rej({ message: err.message });
      });

      blobStream.on("finish", async (data) => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );

        try {
          await bucket.file(file).makePublic();
        } catch {
          return rej({
            message: `Uploaded the file successfully: ${file}, but public access is denied!`,
            url: publicUrl,
          });
        }

        res({
          message: "Uploaded the file successfully: " + file,
          url: publicUrl,
        });
      });
    } catch (err) {

      if (err.code == "LIMIT_FILE_SIZE") {
        rej({
          message: "File size cannot be larger than 2MB!",
        });
      }

      rej({
        message: `Could not upload the file: ${file}. ${err}`,
      });
    }
  });
};

const UPLOAD = (base, path) => {
  return new Promise((res, rej) => {
    var destFilename = base;
    var bucketName = bucket.name;
    var srcFilename = `${path}`;

    const options = {
      destination: destFilename,
    };
    storage
      .bucket(bucketName)
      .upload(
        `${s_path.resolve("./public")}${base}${srcFilename}`,
        {},
        async (err, file) => {
          if (!err) {
            try {
              await bucket.file(srcFilename).makePublic();
              res(
                `https://storage.googleapis.com/${bucket.name}/${srcFilename}`
              );
            } catch (error) {
              rej(error);
            }
          } else rej(err);
        }
      );
  });
};

module.exports = { UploadFile, UploadBuffer, UPLOAD };
