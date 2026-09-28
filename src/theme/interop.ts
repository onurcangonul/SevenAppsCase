import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';

cssInterop(VideoView, { className: 'style' });
cssInterop(Image, { className: 'style' });
