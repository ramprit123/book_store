import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';
import Image from '~/components/Image';
import Input from '~/components/Input';
import PasswordInput from '~/components/PasswordInput';
import COLORS from '~/constants/colors';
import { useStore } from '~/store/store';

const SignIn = () => {
  const { signIn } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      await signIn(email, password);
      router.push('/(tabs)');
    } catch (error: any) {
      // Handle specific auth errors
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError(error.message || 'Failed to sign in');
      }
      Alert.alert('Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center justify-center mx-6 gap-4">
            <Image source={require('~/assets/img/i.png')} width={200} height={200} />
            <View className="w-full p-6 bg-cardBackground gap-6 rounded-lg">
              <Input
                keyboardType="email-address"
                placeholder="Email or Username"
                onChangeText={setEmail}
                leftIcon={<Ionicons name="mail-outline" size={24} color={COLORS.primary} />}
              />

              <PasswordInput placeholder="Password" onChangeText={setPassword} />
              <View className="w-full mt-4">
                <Button
                  title="Sign In"
                  loading={loading}
                  disabled={loading}
                  onPress={handleSignIn}
                />
                <View className="flex-row items-center justify-center mt-4">
                  <Text className=" text-textDark">Do not have an account?</Text>
                  <TouchableOpacity className="ml-1" onPress={() => router.push('/(auth)/signup')}>
                    <Text className="text-primary font-semibold">Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn