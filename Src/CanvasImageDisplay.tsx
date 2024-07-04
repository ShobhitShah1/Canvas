/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';

let imageDataMore = {
  images: [
    {
      src: 'https://picsum.photos/id/29/200/300',
      tlx: 0.05,
      tly: 0.05,
      trx: 0.45,
      try: 0.05,
      blx: 0.05,
      bly: 0.45,
      brx: 0.45,
      bry: 0.45,
      Frame: 'https://picsum.photos/id/29/200/300',
    },
    {
      src: 'https://picsum.photos/id/26/200/300',
      tlx: 0.55,
      tly: 0.05,
      trx: 0.95,
      try: 0.05,
      blx: 0.55,
      bly: 0.45,
      brx: 0.95,
      bry: 0.45,
      Frame: 'https://picsum.photos/id/29/200/300',
    },
    {
      src: 'https://picsum.photos/id/585/200/300',
      tlx: 0.05,
      tly: 0.55,
      trx: 0.45,
      try: 0.55,
      blx: 0.05,
      bly: 0.95,
      brx: 0.45,
      bry: 0.95,
      Frame: 'https://picsum.photos/id/29/200/300',
    },
    {
      src: 'https://picsum.photos/id/58/200/300',
      tlx: 0.55,
      tly: 0.55,
      trx: 0.95,
      try: 0.55,
      blx: 0.55,
      bly: 0.95,
      brx: 0.95,
      bry: 0.95,
      Frame: 'https://picsum.photos/id/29/200/300',
    },
  ],
};

let imageData = {
  images: [
    {
      src: 'https://picsum.photos/id/10/200/300',
      tlx: 0.0024267701176206445,
      tly: 0.03005172605713048,
      trx: 0.6131099806578448,
      try: 0.03005172605713048,
      blx: 0.0024267701176206445,
      bly: 0.37340439299561495,
      brx: 0.6131099806578448,
      bry: 0.37340439299561495,
      Frame: 'https://picsum.photos/id/29/200/300',
    },
  ],
};

const CanvasImageDisplay = () => {
  const canvasRef = useRef<Canvas>(null);
  const {height, width} = useWindowDimensions();
  const [Data, setData] = useState({
    index: 0,
    imageData,
  });

  const updateCoordinates = useCallback(() => {
    if (Data.index === 0) {
      setData({
        index: 1,
        imageData: imageDataMore,
      });
    } else {
      setData({
        index: 1,
        imageData,
      });
    }
  }, [Data, Data.index]);

  // Draw the canvas on component mount
  const drawCanvas = useCallback(
    (canvas: Canvas | null) => {
      try {
        if (!canvas) {
          console.error('Canvas is not defined');
          return;
        }

        const context = canvas.getContext('2d');

        // Canvas width & height. IT WILL CHANGE WHEN DEVICE ROTATE (ADDED FOR TEST)
        canvas.width = width;
        canvas.height = height;

        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas TO REDRAW

        context.strokeStyle = 'black';
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(0, height / 2);
        context.lineTo(width, height / 2);
        context.stroke();

        context.beginPath();
        context.moveTo(width / 2, 0);
        context.lineTo(width / 2, height);
        context.stroke();

        context.fillStyle = 'black';
        context.font = '13px Monospace';
        context.fillText(
          `(WIDTH: ${width.toFixed(5)}, HEIGHT: ${height.toFixed(5)})`,
          width - 300,
          height - 20,
        );

        const images = [...Data.imageData.images];
        images.reverse(); // Reverse the order TO GET FIRST IMAGE ON TOP

        images.forEach(eachImageData => {
          const image = new CanvasImage(canvas);
          image.src = eachImageData.src;

          //* Check if there's a frame image URL
          const frameImage = new CanvasImage(canvas);
          frameImage.src = eachImageData.Frame;

          image.addEventListener('load', () => {
            // frameImage.addEventListener('load', () => {
            context.save();

            //* Convert normalized coordinates to actual pixel values
            const ltx = eachImageData.tlx * width;
            const lty = eachImageData.tly * height;
            const lbx = eachImageData.blx * width;
            const lby = eachImageData.bly * height;
            const rtx = eachImageData.trx * width;
            const rty = eachImageData.try * height;
            // const rbx = eachImageData.brx * width;
            // const rby = eachImageData.bry * height;

            //* width and height of the image
            const imgWidth = Math.sqrt((rtx - ltx) ** 2 + (rty - lty) ** 2);
            const imgHeight = Math.sqrt((lbx - ltx) ** 2 + (lby - lty) ** 2);

            //* Find the angle of rotation
            const angle = Math.atan2(rty - lty, rtx - ltx);

            //* Check is coordinates are within canvas bounds
            // const clamp = (value, min, max) =>
            //   Math.max(min, Math.min(max, value));
            // const clampLtx = clamp(ltx, 0, canvas.width - imgWidth);
            // const clampLty = clamp(lty, 0, canvas.height - imgHeight);
            // const clampLbx = clamp(lbx, 0, canvas.width - imgWidth);
            // const clampLby = clamp(lby, 0, canvas.height - imgHeight);
            // const clampRtx = clamp(rtx, 0, canvas.width - imgWidth);
            // const clampRty = clamp(rty, 0, canvas.height - imgHeight);
            // const clampRbx = clamp(rbx, 0, canvas.width - imgWidth);
            // const clampRby = clamp(rby, 0, canvas.height - imgHeight);

            // Draw the image with calculated width, height, and rotation angle
            // context.translate(clampLtx, clampLty); // Translate to the top-left corner of the image
            context.translate(ltx, lty); // Translate to the top-left corner of the image
            context.rotate(angle); // Rotate the context by the calculated angle
            context.drawImage(image, 0, 0, imgWidth, imgHeight); // Draw the image

            // Reset transformation matrix
            context.setTransform(1, 0, 0, 1, 0, 0);

            // Draw the frame using the same transformation
            //  context.translate(clampLtx, clampLty); // Translate to the top-left corner of the frame
            // context.translate(ltx, lty); // Translate to the top-left corner of the frame
            // context.rotate(angle); // Rotate the context by the calculated angle
            // context.drawImage(frameImage, 0, 0, imgWidth, imgHeight); // Draw the frame

            context.restore(); // Restore the saved drawing state
            // });
          });
        });
      } catch (error: any) {
        console.error('CanvasImageDisplay.tsx:', error);
        Alert.alert(
          'Error',
          `An error occurred while drawing the canvas ${String(
            error?.message || error,
          )}`,
        );
      }
    },
    [Data.imageData, Data, canvasRef],
  );

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas(canvasRef.current);
    }
  }, [canvasRef, width, height, drawCanvas, Data, Data.imageData]);

  return (
    <React.Fragment>
      <ImageBackground
        resizeMode="cover"
        source={require('../Assets/Background.png')}
        style={{
          flex: 1,
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
        }}>
        {/* Choose random json */}
        <StatusBar translucent hidden />

        <Pressable
          onPress={() => {
            imageData = imageData;
            if (canvasRef.current) {
              drawCanvas(canvasRef.current);
            }
          }}
          onLongPress={() => updateCoordinates()}
          style={styles.canvasContainer}>
          <Canvas ref={canvasRef} style={[styles.canvas, {width, height}]} />
        </Pressable>
      </ImageBackground>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    backgroundColor: 'transparent',
  },
});

export default CanvasImageDisplay;
