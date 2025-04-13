import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Input from './Input';
import { TextInputProps } from 'react-native';
import COLORS from '~/constants/colors';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
      iconSize?: number;
      iconColor?: string;
}

const PasswordInput = ({
      iconSize = 24,
      iconColor = COLORS.primary,
      ...props
}: PasswordInputProps) => {
      const [showPassword, setShowPassword] = useState(false);

      return (
            <Input
                  {...props}
                  secureTextEntry={!showPassword}
                  leftIcon={
                        <Ionicons
                              name="lock-closed-outline"
                              size={iconSize}
                              color={iconColor}
                        />
                  }
                  rightIcon={
                        <Ionicons
                              name={showPassword ? "eye-outline" : "eye-off-outline"}
                              size={iconSize}
                              color={iconColor}
                              onPress={() => setShowPassword(!showPassword)}
                        />
                  }
            />
      );
};

export default PasswordInput;