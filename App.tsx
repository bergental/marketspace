import { StatusBar } from 'react-native';
import { Center, NativeBaseProvider, Spinner } from "native-base";
import { useFonts, Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';

import { THEME } from './src/theme';
import { Routes } from './src/routes';

export default function App() {
  let [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
        {
          fontsLoaded ?
            <Routes />
          :
            <Center flex={1} background="gray.700">
              <Spinner color="gray.100" />
            </Center>
        }
    </NativeBaseProvider>
  );
}
