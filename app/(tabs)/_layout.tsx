import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '~/constants/colors'

const TabLayout = () => {
      const insets = useSafeAreaInsets()
      return (
            <SafeAreaView style={{ flex: 1 }} className='bg-background' >
                  <Tabs
                        screenOptions={{
                              headerShown: false,
                              tabBarStyle: {
                                    backgroundColor: COLORS.cardBackground,
                                    borderTopWidth: 0,
                                    elevation: 0,
                                    height: 60 + insets.bottom,
                                    paddingBottom: insets.bottom,
                              },
                              tabBarActiveTintColor: COLORS.primary,
                              tabBarInactiveTintColor: COLORS.textSecondary,
                              headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                    color: COLORS.textPrimary,
                              },
                              headerShadowVisible: false
                        }}
                  >
                        <Tabs.Screen
                              name="index"
                              options={{
                                    title: 'Home',
                                    tabBarIcon: ({ focused, color }) => (
                                          <Ionicons
                                                name={focused ? 'home' : 'home-outline'}
                                                size={24}
                                                color={color}
                                          />
                                    ),
                              }}
                        />
                        <Tabs.Screen
                              name="create"
                              options={{
                                    title: 'Create',
                                    tabBarIcon: ({ focused, color }) => (
                                          <Ionicons
                                                name={focused ? 'add-circle' : 'add-circle-outline'}
                                                size={24}
                                                color={color}
                                          />
                                    ),
                              }}
                        />
                        <Tabs.Screen
                              name="profile"
                              options={{
                                    title: 'Profile',
                                    tabBarIcon: ({ focused, color }) => (
                                          <Ionicons
                                                name={focused ? 'person' : 'person-outline'}
                                                size={24}
                                                color={color}
                                          />
                                    ),
                              }}
                        />
                  </Tabs>
            </SafeAreaView>
      )
}

export default TabLayout