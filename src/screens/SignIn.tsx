import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { VStack, Center, Text, Heading, ScrollView, useToast, View } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import LogoWithNameSvg from '@assets/logo_with_name.svg';

import { Input } from '@components/Input';
import { InputPassword } from '@components/InputPassword';
import { Button } from '@components/Button';

import { useAuth } from '@hooks/useAuth';

import { AppError } from '@utils/AppError';

type FormDataProps = {
  email: string;
  password: string;
};

const signInSchema = yup.object({
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.')
}).required();

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema)
  });
  
  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);

      await signIn(email, password);
    } catch (error) {      
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.';
      
      setIsLoading(false);

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });

    } 
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} background={'gray.700'}>
        <View px={10} pb={16} roundedBottom={'2xl'} background={'gray.600'}>
          <Center my={20}>
            <LogoWithNameSvg />

            <Text
              color="gray.300"
              fontSize="sm"
            >
              Seu espaço de compra e venda
            </Text>
          </Center>

          <Center>
            <Heading 
              color="gray.200"
              fontSize="sm"
              fontFamily="body"
              mb={4}
            >
              Acesse sua conta
            </Heading>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />
            
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <InputPassword 
                  placeholder="Senha"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
                )}
              />

            <Button 
              title="Acessar" 
              variant="blue"
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
          </Center>
        </View>
        

        <Center px={10} mt={16}>
          <Text
            color="gray.200"
            fontSize="sm"
            mb={4}
            fontFamily="body"
          >
            Ainda não tem acesso?
          </Text>
          <Button 
            title="Criar conta"
            variant="gray"
            onPress={handleNewAccount}
            disabled={isLoading}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}