import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '~/components/Button'
import Image from '~/components/Image'
import Input from '~/components/Input'
import PasswordInput from '~/components/PasswordInput'
import COLORS from '~/constants/colors'

const SignIn = () => {
  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className='flex-1 items-center justify-center mx-6 gap-4'>
        <Image
          source={require('~/assets/img/i.png')}
          width={200}
          height={200}
          resizeMode='contain'
        />
        <View className='w-full p-10 bg-cardBackground gap-6 rounded-lg'>
          <Input keyboardType='email-address' placeholder='Email or Username' leftIcon={<Ionicons name="mail-outline" size={24} color={COLORS.primary} />} />

          <PasswordInput placeholder='Password' />
          <View className='w-full mt-6'>
            <Button title='Sign In' />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignIn