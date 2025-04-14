import { Feather, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '~/components/Button'
import Image from '~/components/Image'
import Input from '~/components/Input'
import PasswordInput from '~/components/PasswordInput'
import COLORS from '~/constants/colors'
import { useStore } from '~/store/store'

const SignUp = () => {
  const { signUp, signOut, user } = useStore();

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = () => {
    setLoading(true)
    signUp(email, password)
      .then((userCredential) => {
        console.log(userCredential)
        setLoading(false)
        router.push("/(auth)")
        //...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        setLoading(false)
      });

  }
  return (
    <SafeAreaView className='flex-1 bg-background'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className='flex-1 items-center justify-center mx-6 gap-4'>
            <Image
              source={require('~/assets/img/i.png')}
              width={200}
              height={200}
            />
            <View className='w-full p-6 bg-cardBackground gap-6 rounded-lg'>
              <Input placeholder='Full name' onChangeText={(name) => setName(name)} leftIcon={<Feather name="user" size={24} color={COLORS.primary} />} />
              <Input keyboardType='email-address' onChangeText={(email) => setEmail(email)} placeholder='Email or Username' leftIcon={<Ionicons name="mail-outline" size={24} color={COLORS.primary} />} />

              <PasswordInput placeholder='Password' onChangeText={password => setPassword(password)} />
              <View className='w-full mt-4'>
                <Button title='Sign Up' onPress={handleSignUp} />
                <View className='flex-row items-center justify-center mt-4'>
                  <Text className=' text-textDark'>Already have an account?</Text>
                  <TouchableOpacity className='ml-1' onPress={() => router.push("/(auth)")}>
                    <Text className='text-primary font-semibold'>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUp