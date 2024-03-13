import { StatusBar } from 'react-native';
import { Center, Text, NativeBaseProvider, Spinner } from "native-base";
import { useFonts, Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';

import { THEME } from './src/theme';

export default function App() {
  let [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Center flex={1} background="gray.700">
        {
          fontsLoaded ?
            <Text color="gray.100" fontFamily="heading">
              Welcome to Marketspace!
            </Text>
          :
            <Spinner color="gray.100" />
        }
      </Center>
    </NativeBaseProvider>
  );
}
