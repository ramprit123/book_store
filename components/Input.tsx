import { View, TextInput, TextInputProps } from 'react-native';
import { ReactNode } from 'react';

interface InputProps extends TextInputProps {
      leftIcon?: ReactNode;
      rightIcon?: ReactNode;
}

const Input = ({ leftIcon, rightIcon, className = '', ...props }: InputProps) => {
      return (
            <View className="flex-row items-center border border-gray-300 rounded-lg bg-white px-4 h-16">
                  {leftIcon && <View className="mr-2">{leftIcon}</View>}
                  <TextInput
                        className="flex-1 text-base text-textDark"
                        placeholderTextColor="#767676"
                        {...props}
                  />
                  {rightIcon && <View className="ml-2">{rightIcon}</View>}
            </View>
      );
};

export default Input;