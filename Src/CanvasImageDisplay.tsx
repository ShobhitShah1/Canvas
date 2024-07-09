/* eslint-disable react-hooks/exhaustive-deps */
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

const exampleImageUri =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb';

const backgroundImage = require('../assets/4.png');

let imageData = {
  images: [
    // {
    //   src: exampleImageUri,
    //   tlx: 0.0024267701176206445,
    //   tly: 0.03005172605713048,
    //   trx: 0.6131099806578448,
    //   try: 0.03005172605713048,
    //   blx: 0.0024267701176206445,
    //   bly: 0.37340439299561495,
    //   brx: 0.6131099806578448,
    //   bry: 0.37340439299561495,
    //   Frame: 'https://picsum.photos/id/29/200/300',
    // },
    // {
    //   src: exampleImageUri,
    //   tlx: 0.4047449989112625,
    //   tly: 0.42860657114743117,
    //   trx: 0.8109912471356466,
    //   try: 0.42860657114743117,
    //   blx: 0.4047449989112625,
    //   bly: 0.6816342118021133,
    //   brx: 0.8109912471356466,
    //   bry: 0.6816342118021133,
    //   Frame: 'https://picsum.photos/id/29/200/300',
    // },
    // {
    //   src: exampleImageUri,
    //   tlx: 0.97914359018054,
    //   tly: 1.005996952024384,
    //   trx: 1.3853898384049244,
    //   try: 1.005996952024384,
    //   blx: 0.97914359018054,
    //   bly: 1.2590245926790662,
    //   brx: 1.3853898384049244,
    //   bry: 1.2590245926790662,
    //   Frame: 'https://picsum.photos/id/29/200/300',
    // },
    // {
    //   src: exampleImageUri,
    //   tlx: 0.9670254764406818,
    //   tly: 0.016379868961048524,
    //   trx: 1.373271724665066,
    //   try: 0.016379868961048524,
    //   blx: 0.9670254764406818,
    //   bly: 0.2694075096157307,
    //   brx: 1.373271724665066,
    //   bry: 0.2694075096157307,
    //   Frame: 'https://picsum.photos/id/29/200/300',
    // },
    // {
    //   src: exampleImageUri,
    //   tlx: 0.10421577816277956,
    //   tly: 0.42451160390716897,
    //   trx: 0.5104620263871638,
    //   try: 0.42451160390716897,
    //   blx: 0.10421577816277956,
    //   bly: 0.677539244561851,
    //   brx: 0.5104620263871638,
    //   bry: 0.677539244561851,
    //   Frame: 'https://picsum.photos/id/29/200/300',
    // },
    // {
    //   src: exampleImageUri,
    //   tlx: 0.3438941538980693,
    //   tly: 0.5691479846622779,
    //   trx: 0.5727471531448625,
    //   try: 0.3899299268493941,
    //   blx: 0.6970053431011004,
    //   bly: 0.7116874781573173,
    //   brx: 0.9258583423478935,
    //   bry: 0.5324694203444336,
    //   Frame: 'https://picsum.photos/id/29/200/300',
    // },
    {
      src: exampleImageUri,
      tlx: 0.6228710462287099,
      tly: 0.3794669642642857,
      trx: 1.245742092457421,
      try: 0.3794669642642857,
      blx: 0.6228710462287099,
      bly: 0.7250384284137196,
      brx: 1.245742092457421,
      bry: 0.7250384284137196,
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
    setData({
      index: 1,
      imageData,
    });
  }, [Data, Data.index]);

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

        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas TO ReDRAW

        context.fillStyle = 'black';
        context.font = '13px Monospace';
        context.fillText(
          `(WIDTH: ${width.toFixed(5)}, HEIGHT: ${height.toFixed(5)})`,
          width - 300,
          height - 40,
        );

        const images = [...Data.imageData.images];
        // images.reverse(); // Reverse the order TO GET FIRST IMAGE ON TOP

        images.forEach(eachImageData => {
          const image = new CanvasImage(canvas);
          image.src = eachImageData.src;

          //* Check if there's a frame image URL
          const frameImage = new CanvasImage(canvas);
          frameImage.src = eachImageData.Frame;

          image.addEventListener('load', () => {
            // frameImage.addEventListener('load', () => {
            context.save();

            console.log('```````Start```````');

            //* Convert normalized coordinates to actual pixel values
            const ltx = eachImageData.tlx * width;
            const lty = eachImageData.tly * height;
            const lbx = eachImageData.blx * width;
            const lby = eachImageData.bly * height;
            const rtx = eachImageData.trx * width;
            const rty = eachImageData.try * height;
            const rbx = eachImageData.brx * width;
            const rby = eachImageData.bry * height;

            console.log(ltx, lty, lbx, lby, rtx, rty, rbx, rby);

            //* width and height of the image
            const imgWidth = Math.sqrt((rtx - ltx) ** 2 + (rty - lty) ** 2);
            const imgHeight = Math.sqrt((lbx - ltx) ** 2 + (lby - lty) ** 2);

            //* Find the angle of rotation
            const angle = Math.atan2(rty - lty, rtx - ltx);

            //* Check is coordinates are within canvas bounds
            const clamp = (value: number, min: number, max: number) =>
              Math.max(min, Math.min(max, value));
            const clampLtx = clamp(ltx, 0, canvas.width - imgWidth);
            const clampLty = clamp(lty, 0, canvas.height - imgHeight);
            const clampLbx = clamp(lbx, 0, canvas.width - imgWidth);
            const clampLby = clamp(lby, 0, canvas.height - imgHeight);
            const clampRtx = clamp(rtx, 0, canvas.width - imgWidth);
            const clampRty = clamp(rty, 0, canvas.height - imgHeight);
            const clampRbx = clamp(rbx, 0, canvas.width - imgWidth);
            const clampRby = clamp(rby, 0, canvas.height - imgHeight);

            console.log(
              clampLtx,
              clampLty,
              clampLbx,
              clampLby,
              clampRtx,
              clampRty,
              clampRbx,
              clampRby,
            );

            console.log('```````End```````');

            const clampImgWidth = Math.sqrt(
              (clampRtx - clampLtx) ** 2 + (clampRty - clampLty) ** 2,
            );
            const clampImgHeight = Math.sqrt(
              (clampLbx - clampLtx) ** 2 + (clampLby - clampLty) ** 2,
            );

            console.log(clampImgWidth, clampImgHeight);

            // Visualize the bounding box and coordinates
            context.lineWidth = 5;
            context.strokeStyle = 'red';
            context.strokeRect(clampLtx, clampLty, imgWidth - 5, imgHeight - 5);

            context.fillStyle = 'red';
            context.font = '12px Monospace';
            context.fillText(':Start:', clampLtx, clampLty - 5);

            context.translate(clampLtx, clampLty); // Translate to the top-left corner of the image
            context.rotate(angle); // Rotate the context by the calculated angle
            context.drawImage(image, 0, 0, imgWidth - 5, imgHeight - 5); // Draw the image

            // Reset transformation matrix
            context.setTransform(1, 0, 0, 1, 0, 0);

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
      <StatusBar translucent hidden />
      <ImageBackground
        resizeMode="contain"
        source={backgroundImage}
        style={styles.imageBackground}>
        <Pressable
          onPress={() => {
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
  canvasContainer: {flex: 1},
  canvas: {backgroundColor: 'transparent'},
  imageBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});

export default CanvasImageDisplay;
