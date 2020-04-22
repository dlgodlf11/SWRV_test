exports.getOrientation = function(buffer) {
  var view = new DataView(buffer);
  if (view.getUint16(0, false) !== 0xffd8) return -2;
  var length = view.byteLength,
    offset = 2;
  while (offset < length) {
    var marker = view.getUint16(offset, false);
    offset += 2;
    if (marker === 0xffe1) {
      if (view.getUint32((offset += 2), false) !== 0x45786966) return -1;
      var little = view.getUint16((offset += 6), false) === 0x4949;
      offset += view.getUint32(offset + 4, little);
      var tags = view.getUint16(offset, little);
      offset += 2;
      for (var i = 0; i < tags; i++) {
        if (view.getUint16(offset + i * 12, little) === 0x0112) return view.getUint16(offset + i * 12 + 8, little);
      }
    } else if ((marker & 0xff00) !== 0xff00) {
      break;
    } else {
      offset += view.getUint16(offset, false);
    }
  }
  return -1;
};
exports.rotateimge = function(img, orientation) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  var width = img.width;
  var height = img.height;

  switch (orientation) {
    case 2:
      // horizontal flip
      canvas.width = width;
      canvas.height = height;
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      // 180° rotate left
      canvas.width = width;
      canvas.height = height;
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      // vertical flip
      canvas.width = width;
      canvas.height = height;
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
      // vertical flip + 90 rotate right
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      // 90° rotate right
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);

      break;
    case 7:
      // horizontal flip + 90 rotate right
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
      // 90° rotate left
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;

    default:
      canvas.width = width;
      canvas.height = height;
      break;
  }
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg");
};
