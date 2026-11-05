import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getCurrentPlace = async () => {
  try {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Location permission denied',
        'You can still type the location manually.'
      );
      return null;
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = pos.coords;

    let text = '';
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results.length > 0) {
        const p = results[0];
        text = [p.name, p.street, p.district, p.city]
          .filter((v, i, arr) => v && arr.indexOf(v) === i)
          .join(', ');
      }
    } catch (e) {}

    if (!text) text = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    return { text, latitude, longitude };
  } catch (e) {
    Alert.alert(
      'Location unavailable',
      'Could not get your location. Make sure GPS is on, or type it manually.'
    );
    return null;
  }
};