import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '~/components/Button'
import Image from '~/components/Image'
import Input from '~/components/Input'
import PasswordInput from '~/components/PasswordInput'
import COLORS from '~/constants/colors'

const SignIn = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = () => {
    // Handle sign in logic here
    console.log('Email:', email)
    console.log('Password:', password)
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
              <Input keyboardType='email-address' placeholder='Email or Username' leftIcon={<Ionicons name="mail-outline" size={24} color={COLORS.primary} />} />

              <PasswordInput placeholder='Password' />
              <View className='w-full mt-4'>
                <Button title='Sign In' />
                <View className='flex-row items-center justify-center mt-4'>
                  <Text className=' text-textDark'>Do not have an account?</Text>
                  <TouchableOpacity className='ml-1' onPress={() => router.push("/(auth)/signup")}>
                    <Text className='text-primary font-semibold'>Sign Up</Text>
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

export default SignIn