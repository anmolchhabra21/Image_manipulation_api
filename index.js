const express = require("express");
const path = require("path");
const sharp = require("sharp");
const app = express();

// custom logger (Alt: morgan)
// app.use((req, res, next) => {
//   console.log(req.ip, req.method, req.path, req.headers["user-agent"]);
//   next();
// });

app.use(express.json());

app.use("/api/", async (req, res, next) => {
  try {
    let { url, width, height, q, crop, bg, format, bw } = req.query;
    console.log("Q ", req.query);

    if (width) {
      width = parseInt(width);
      if (width > 10000) {
        return res.status(400).json({ 
          message: "Invalid width parameter. width must be <=10000",
        });
      }
    }

    if(!url){
      return res.status(400).json({
        message: "Please enter the url",
      })
    }

    function isValidUrl(str) {
      const pattern = new RegExp(
        '^([a-zA-Z]+:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
      );
      return pattern.test(str);
    }

    if(!isValidUrl(url)){
      return res.status(400).json({
        message: "This is not a valid URL",
      });
    }

    if(url){
      const response = await fetch(url);
      if(response.status!==200){
        return res.status(400).json({
          message: "The URL is Invalid",
        });
      }
    }

    if (height) {
      height = parseInt(height);
      if (height > 10000) {
        return res.status(400).json({
          message: "Invalid height parameter. height must be <=10000",
        });
      }
    }

    if (q) {
      q = parseInt(q);
      if (q > 100) {
        return res.status(400).json({
          message: "Invalid quality parameter. quality must be <=10000",
        });
      }
    }

    if (format) {
      if (
        format !== "webp" &&
        format !== "gif" &&
        format !== "png" &&
        format !== "jpeg" &&
        format !== "jp2" &&
        format !== "tiff" &&
        format !== "heif" &&
        format !== "raw"
      ) {
        return res.status(400).json({
          message:
            "Invalid Format. This is not among the standard list of format currenly used in sharpjs",
        });
      }
    }

    if (bw === "") bw += "1";

    res.setHeader("content-type", "image/jpg");
    
    async function processImage() {
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();  
        const imageBuffer = Buffer.from(buffer);
        // console.log(imageBuffer);

        // Perform resizing or any other image processing operations using SharpJS
        const resizedImageBuffer = await sharp(imageBuffer)
          .resize(width ? width : null, height ? height : null, {
            fit: crop? crop:null,
            background: bg ? "#" + bg : null,
          })
          .toFormat(format? format: "jpeg", {quality: q?parseInt(q):60, })
          .withMetadata()
          .greyscale(bw && bw.length >= 1 ? true : false)
          .toBuffer();

        // Use the resized image buffer as needed
        console.log(
          "Image processing completed successfully!",
          resizedImageBuffer
        );
        return resizedImageBuffer;
      } catch (error) {
        // Handle any errors during the image fetching process or the resizing process
        console.error("Error processing image:", error);
      }
    }

    res.send(await processImage());
  } catch (error) {
    console.log(error);
    res.setHeader("content-type", "application/json");
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, success: false });
  }
});

app.get("/", async (req, res, next) => {
  res.sendFile(path.join(__dirname, "./docs.html"));
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
