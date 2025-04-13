import { Stack } from 'expo-router';
import { Text, View } from 'react-native';


export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <View className='flex-1 items-center justify-center'>
        <Text className='text-primary font-Poppins-Bold text-3xl'>
          Welcome to the Home Screen!
        </Text>
      </View>
    </>
  );
}
