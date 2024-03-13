import { Center, Text } from "native-base";
import { useNavigation } from '@react-navigation/native';


import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <Center flex={1} background="gray.700">
      <Text color="gray.100" fontFamily="heading" onPress={handleGoBack}>
        SignUp
      </Text>
    </Center>
  );
}
