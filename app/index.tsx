import { Redirect } from 'expo-router';
import { useStore } from '~/store/store';

export default function Index() {
  const { user } = useStore();
  // Redirect to the appropriate screen based on authentication status
  return <Redirect href={user ? '/(tabs)' : '/(auth)'} />;
}