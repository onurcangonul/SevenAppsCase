import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

cssInterop(VideoView, { className: 'style' });
cssInterop(Image, { className: 'style' });
cssInterop(KeyboardAwareScrollView, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});
