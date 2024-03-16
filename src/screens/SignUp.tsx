import { useState } from 'react';
import { VStack, Center, Text, Heading, ScrollView, useToast, Skeleton, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { PencilSimpleLine } from 'phosphor-react-native';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { InputPassword } from '@components/InputPassword';
import { UserPhoto } from '@components/UserPhoto';

import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { toMaskedPhone } from '@utils/Masks';

import { api } from '@services/api';

import LogoSvg from '@assets/logo.svg';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'
import { TouchableOpacity } from 'react-native';

const PHOTO_SIZE = 20;

type FormDataProps = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  password_confirm: string;
};

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  phoneNumber: yup.string().max(11, 'Telefone inválido.').min(11, 'Telefone inválido.').required('Informe o telefone.'),

  password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A confirmação da senha não confere.')
}).required();

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userPhoto, setUserPhoto] = useState<ImagePicker.ImagePickerAsset>(
    {} as ImagePicker.ImagePickerAsset
  );

  const toast = useToast();
  const { signIn } = useAuth();
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });
  
  const navigation = useNavigation();
  
  function handleGoBack() {
    navigation.goBack();
  }

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true);

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo: any = await FileSystem.getInfoAsync(photoSelected.assets[0].uri, { size: true });
        if (photoInfo.size && (photoInfo.size / 1024 / 1024 > 5)) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500'
          })
        }

        setUserPhoto(photoSelected.assets[0]);
      }
    } catch(error) {
      toast.show({
        title: "Não foi possível carregar a foto. Tente novamente.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleSignUp({ name, email, phoneNumber, password }: FormDataProps) {
    try {
      if (!userPhoto || !userPhoto.uri) {
        return toast.show({
          title: "Escolha uma foto de perfil.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      setIsLoading(true);

      const fileExtension = userPhoto.uri.split('.').pop();
      const fileName = `${Math.random().toString().replace('0.', '')}-${name}.${fileExtension}`;

      const photoFile = {
        name: fileName,
        uri: userPhoto.uri,
        type: `${userPhoto.type}/${fileExtension}`,
      } as any;

      
      const userForm = new FormData();
      userForm.append("avatar", photoFile);
      userForm.append("name", name);
      userForm.append("email", email);
      userForm.append("tel", `+55${phoneNumber}`);
      userForm.append("password", password);

      await api.post("/users", userForm, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
      });

      await signIn(email, password);
    } catch(error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possível criar a conta. Tente novamente mais tarde.";
      toast.show({
        title,
        bgColor: "red.500",
      });
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} background="gray.600">
      <VStack flex={1} px={10}>
        <Center my={10}>
          <LogoSvg />

          <Heading
            color="gray.100"
            fontSize="md"
            mt={4}
          >
            Boas vindas!
          </Heading>

          <Text
            color="gray.200"
            fontSize="sm"
            mt={2}
          >
            Crie sua conta e use o espaço para comprar itens variados e vender seus produtos
          </Text>
        </Center>

        <Center mb={4}>
          {
            photoIsLoading ?
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
              />
            :
              <TouchableOpacity
                onPress={handleUserPhotoSelect}
              >
                <UserPhoto 
                  source={userPhoto && userPhoto.uri ? { uri: userPhoto.uri } : defaultUserPhotoImg}
                  alt="Imagem do usuário"
                  size={PHOTO_SIZE}
                />
                <Center 
                  size={8} 
                  position={'absolute'}
                  rounded="full" 
                  background="blueLight"
                  p={4}
                  ml={12}
                  mt={12}
                >
                  <Icon 
                    as={<PencilSimpleLine size={12} />} 
                    color="gray.700" 
                  />
                </Center>
              </TouchableOpacity>
          }
        </Center>

        <Center>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
                returnKeyType="next"
              />
            )}
          />

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
                returnKeyType="next"
              />
            )}
          />


          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder='Telefone'
                keyboardType='phone-pad'
                value={value}
                onChangeText={(text) => onChange(toMaskedPhone(text))}
                errorMessage={errors.email?.message}
                returnKeyType="next"
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
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <InputPassword 
                placeholder="Confirmar Senha"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />

          <Button 
            mt={2}
            title="Criar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>


        <Center mt={12} mb={6}>
          <Text
            color="gray.200"
            fontSize="sm"
            mb={4}
            fontFamily="body"
          >
            Já tem uma conta?
          </Text>
          <Button 
            title="Ir para o login" 
            variant="gray" 
            onPress={handleGoBack}
          />
        </Center>
        
      </VStack>
    </ScrollView>
  );
}
