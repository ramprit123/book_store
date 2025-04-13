import { Redirect, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Container } from '~/components/Container';


export default function Home() {

  if (true) return <Redirect href='/(auth)' />;
  return (
    <Container>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <View className='flex-1 items-center justify-center'>
        <Text className='text-primary font-Poppins-Bold text-3xl text-center'>
          Welcome to the Home Screen!
        </Text>
      </View>
    </Container>
  );
}
