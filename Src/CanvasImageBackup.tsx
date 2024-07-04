/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {
  Button,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import data from '../data.json';

let ImageWidth = 200;
let ImageHeight = 200;

let FrameWidth = ImageWidth * 1.15;
let FrameHeight = ImageHeight * 1.15;

// const {width, height} = Dimensions.get('screen');

// Get device screen dimensions
// const {width, height} = Dimensions.get('window');

// // Define image sizes and spacing
// const imageSize = 200; // Example image size
// const spacing = 30; // Example spacing between images

// Calculate maximum total x and y coordinates
// const maxImagesPerRow = Math.floor((width - spacing) / (imageSize + spacing)); // Maximum number of images per row

// const maxImagesPerColumn = Math.floor(
//   (height - spacing) / (imageSize + spacing),
// ); // Maximum number of images per column

// const maxX = maxImagesPerRow * (imageSize + spacing) - spacing; // Maximum total x coordinate
// const maxY = maxImagesPerColumn * (imageSize + spacing) - spacing; // Maximum total y coordinate

// console.log('Max X Coordinate:', maxX);
// console.log('Max Y Coordinate:', maxY);

// const resolveFrameSource = requirePath => {
//   Alert.alert(
//     'Local Frame Path',
//     String(Image.resolveAssetSource(requirePath).uri),
//   );
//   console.log('LOCAL:::', Image.resolveAssetSource(requirePath));
//   console.log('LOCAL URI:::', Image.resolveAssetSource(requirePath).uri);
//   return Image.resolveAssetSource(requirePath).uri;
// };

// const updatedData = {
//   ...data,
//   images: data.images.map(imageData => ({
//     ...imageData,
//     Frame: resolveFrameSource(require('../Assets/frame_2.png')),
//   })),
// };

const CanvasImageBackup = () => {
  const canvasRef = useRef(null);
  const {height, width} = useWindowDimensions();

  // const [ScreenHeightAndWidth, setScreenHeightAndWidth] = useState({
  //   width: width,
  //   height: height,
  // });

  // useEffect(() => {
  //   const changeScreenSize = Dimensions.addEventListener('change', value => {
  //     console.log('Changed Screen Size:', value);
  //   });

  //   return changeScreenSize.remove();
  // }, []);

  useEffect(() => {
    console.log('canvasRef.current', canvasRef.current);
    drawCanvas(canvasRef.current);
  }, [canvasRef, width, height, data]);

  const drawCanvas = (canvas: any) => {
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    // const ScreenWidthAndHeight = Dimensions.get('screen');
    // const Width = ScreenWidthAndHeight.width;
    // const Height = ScreenWidthAndHeight.height;

    // Set the canvas dimensions based on the frame size
    canvas.width = width;
    canvas.height = height;
    // canvas.width = data.frame.width + 400;
    // canvas.height = data.frame.height + 400;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // const images = [...data.images];
    // images.reverse();

    const images = [...data.images];
    images.reverse();

    console.log('images', images);
    // Draw images and frames together as one group
    images.forEach((imageData: any) => {
      const image = new CanvasImage(canvas);
      image.src = imageData.src;

      const frameImage = new CanvasImage(canvas);
      frameImage.src = imageData.Frame;

      image.addEventListener('load', () => {
        // frameImage.addEventListener('load', () => {
        context.save(); // Save the current context state

        // Translate and rotate to position the image
        context.translate(
          imageData.x + ImageWidth / 2.15,
          imageData.y + ImageHeight / 2.405,
        );
        context.rotate((imageData.rotation * Math.PI) / 180);

        // Draw the image
        context.drawImage(
          image,
          -ImageWidth / 2.2,
          -ImageHeight / 2.41,
          ImageWidth,
          ImageHeight,
        );

        // Draw the frame relative to the image
        context.translate(-ImageWidth / 2, -ImageHeight / 2);
        context.drawImage(frameImage, 0, 0, FrameWidth, FrameHeight);

        context.restore(); // Restore the context to its original state
        // });
      });
    });
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require('../Assets/Background.png')}
      style={{
        flex: 1,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
      }}>
      <View style={styles.canvasContainer}>
        <Canvas ref={canvasRef} style={styles.canvas} />
      </View>
      <Button
        title="Draw Again"
        onPress={() => {
          if (canvasRef.current) {
            drawCanvas(canvasRef.current);
          }
        }}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default CanvasImageBackup;
