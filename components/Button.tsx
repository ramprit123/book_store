import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';

type ButtonProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, loading, disabled, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      disabled={loading || disabled}
      {...touchableProps}
      className={`${styles.button} ${loading || disabled ? 'opacity-50' : ''} ${touchableProps.className}`}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

const styles = {
  button: 'items-center bg-primary rounded-[28px] shadow-sm p-3.5 w-full',
  buttonText: 'text-white text-lg font-semibold text-center',
};
