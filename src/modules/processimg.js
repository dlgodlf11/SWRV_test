import imagetools from "./ImageTools";
import stripExifdata from "image-file-to-base64-exif";
import estimator from "./bodyPix";
function process(file, canvas, callback) {
  var orientation = null;
  var nonexifimg = new Image();
  var inputimg = new Image();
  var hipsize = 0;
  var waistsize = 0;
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);

  reader.onload = (e) => {
    orientation = imagetools.getOrientation(e.target.result);
    stripExifdata(file, 650, 650, 1).then(function(base64) {
      nonexifimg.src = base64;
    });
  };
  nonexifimg.onload = () => {
    inputimg.src = imagetools.rotateimge(nonexifimg, orientation);
  };
  inputimg.onload = () => {
    estimator.loadAndPredict(inputimg, canvas).then(async (segmentation) => {
      try {
        hipsize = await estimator.measureSize(segmentation, canvas.getContext("2d"), 1);
        waistsize = await estimator.measureSize(segmentation, canvas.getContext("2d"), 0.56);
        callback({ hipsize, waistsize });
      } catch (err) {
        callback("인식불가");
      }
    });
  };
}
export default process;
