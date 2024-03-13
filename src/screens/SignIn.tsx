import { Center, Text } from "native-base";
import { useNavigation } from '@react-navigation/native';


import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  return (
    <Center flex={1} background="gray.700">
      <Text color="gray.100" fontFamily="heading" onPress={handleNewAccount}>
        SignIn
      </Text>
    </Center>
  );
}
