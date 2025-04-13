import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import { StyleSheet } from 'react-native';

interface ImageProps extends Omit<ExpoImageProps, 'style'> {
      width?: number;
      height?: number;
      className?: string;
}

const Image = ({ width, height, className, ...props }: ImageProps) => {
      return (
            <ExpoImage
                  style={[styles.image, { width, height }]}
                  className={className}
                  {...props}
            />
      );
};

const styles = StyleSheet.create({
      image: {

      },
});

export default Image;