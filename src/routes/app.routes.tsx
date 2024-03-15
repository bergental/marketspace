import { Platform, TouchableOpacity } from 'react-native';
import { useTheme } from 'native-base';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { House, Tag, SignOut } from 'phosphor-react-native';

import { Home } from '@screens/Home';
import { MyAds } from '@screens/MyAds';
import { useAuth } from '@hooks/useAuth';

type AppRoutes = {
  home: undefined;
  myAds: undefined;
  signOut: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  
  const { signOut } = useAuth();

  const { colors, sizes } = useTheme();

  const iconSize = sizes[6];

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.gray[200],
      tabBarInactiveTintColor: colors.gray[400],
      tabBarStyle: {
        backgroundColor: colors.gray[700],
        borderTopWidth: 0,
        height: Platform.OS === 'android' ? 'auto' : 96,
        paddingBottom: sizes[5],
        paddingTop: sizes[5]
      }
    }}>
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House 
              color={color}
              size={iconSize}
            />
          )
        }}
      />
      <Screen
        name="myAds"
        component={MyAds}
        options={{
          tabBarIcon: ({ color }) => (
            <Tag 
              color={color}
              size={iconSize}
            />
          )
        }}
      />
      <Screen 
        name='signOut'
        options={{
          tabBarIcon: ({ color }) => (
            <SignOut 
              color="#E07878"
              size={iconSize}
            />
          ),
          tabBarButton: (props) => (<TouchableOpacity {...props} onPress={signOut} />)
        }}
        children={() => (<></>)}
      />
      
    </Navigator>
  )
}