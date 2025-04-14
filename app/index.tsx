import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useStore } from '~/store/store';

export default function Index() {
  const { user, signOut } = useStore();
  // Redirect to the appropriate screen based on authentication status
  return <Redirect href={user ? '/(tabs)' : '/(auth)'} />;
}