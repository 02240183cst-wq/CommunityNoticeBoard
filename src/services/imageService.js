import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Alert } from 'react-native';

const compress = async (uri, width) => {
  const ctx = ImageManipulator.manipulate(uri);
  ctx.resize({ width });
  const image = await ctx.renderAsync();
  const result = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.5,
    base64: true,
  });
  return `data:image/jpeg;base64,${result.base64}`;
};

export const pickImage = async ({ camera = false, square = false, width = 800 } = {}) => {
  try {
    if (camera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Please allow camera access in your phone settings.');
        return null;
      }
    }
    const options = {
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: square,
      aspect: square ? [1, 1] : undefined,
    };
    const res = camera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    if (res.canceled) return null;
    return await compress(res.assets[0].uri, width);
  } catch (e) {
    Alert.alert('Error', 'Could not load the image. Please try again.');
    return null;
  }
};