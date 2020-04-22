exports.loadAndPredict = async function(image, canvas) {
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 4,
  });
  const segmentation = await net.segmentPersonParts(image, {
    flipHorizontal: false,
    internalResolution: "medium",
    segmentationThreshold: 0.7,
    maxDetections: 1,
  });
  const coloredPartImage = bodyPix.toColoredPartMask(segmentation);
  const opacity = 0.7;
  const flipHorizontal = false;
  const maskBlurAmount = 0;
  bodyPix.drawMask(canvas, image, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
  return segmentation;
};
exports.measureSize = function(segmentation, ctx, location_const) {
  var image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  var width = segmentation.width;

  if (
    segmentation.allPoses[0].keypoints[5].score < 0.5 ||
    segmentation.allPoses[0].keypoints[6].score < 0.5 ||
    segmentation.allPoses[0].keypoints[11].score < 0.5 ||
    segmentation.allPoses[0].keypoints[12].score < 0.5
  ) {
    return 0;
  }
  var neck_x = (segmentation.allPoses[0].keypoints[5].position.x + segmentation.allPoses[0].keypoints[6].position.x) / 2;
  var neck_y = (segmentation.allPoses[0].keypoints[5].position.y + segmentation.allPoses[0].keypoints[6].position.y) / 2;

  var pubis_x = (segmentation.allPoses[0].keypoints[11].position.x + segmentation.allPoses[0].keypoints[12].position.x) / 2;
  var pubis_y = (segmentation.allPoses[0].keypoints[11].position.y + segmentation.allPoses[0].keypoints[12].position.y) / 2;

  ctx.moveTo(neck_x, neck_y);
  ctx.lineTo(pubis_x, pubis_y);
  ctx.stroke();

  if (location_const == 1) {
    var check_y = pubis_y;
  } else {
    var check_y = (neck_y + pubis_y) * location_const;
  }

  var check_x = (check_y - neck_y) / ((pubis_y - neck_y) / (pubis_x / neck_x)) + neck_x;

  var angle = Math.atan((neck_y - pubis_y) / (neck_x - pubis_x));

  var distance = 1;
  var otherdistance = 1;

  while (true) {
    var nextx = parseInt(Math.cos(angle + 1.5707963267948966) * distance + check_x) * 4;
    var nexty = parseInt(Math.sin(angle + 1.5707963267948966) * distance + check_y) * 4 * width;

    var nextox = parseInt(Math.cos(angle - 1.5707963267948966) * otherdistance + check_x) * 4;
    var nextoy = parseInt(Math.sin(angle - 1.5707963267948966) * otherdistance + check_y) * 4 * width;

    var point = nextx + nexty;
    var opoint = nextox + nextoy;
    if (segmentation.data[point / 4] != -1) {
      image.data[point] = 255;
      distance += 1;
    } else if (segmentation.data[opoint / 4] != -1) {
      image.data[opoint] = 255;
      otherdistance += 1;
    } else {
      ctx.beginPath();
      ctx.arc(nextx / 4, nexty / 4 / width, 10, 0, (Math.PI / 180) * 360, false);
      ctx.fillStyle = "rgb(0, 255, 255)"; //채울 색상
      ctx.fill(); //채우기

      ctx.beginPath();
      ctx.arc(nextox / 4, nextoy / 4 / width, 10, 0, (Math.PI / 180) * 360, false);
      ctx.fillStyle = "rgb(0, 255, 255)"; //채울 색상
      ctx.fill(); //채우기
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "rgb(0, 255, 0)";
      ctx.lineWidth = 4;
      ctx.moveTo(nextx / 4, nexty / 4 / width);
      ctx.lineTo(nextox / 4, nextoy / 4 / width);
      ctx.stroke();

      break;
    }
  }

  return distance + otherdistance;
};
