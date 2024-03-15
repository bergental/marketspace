import { useState } from 'react';
import { Stack, Pressable, Input as NativeBaseInput, IInputProps, FormControl, Icon } from 'native-base';
import { Eye, EyeClosed } from 'phosphor-react-native';

type Props = IInputProps & {
  errorMessage?: string | null;
}

export function InputPassword({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;
  const [show, setShow] = useState(false);
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <Stack space={4} w="100%" alignItems="center">
        <NativeBaseInput 
          bg="gray.700"
          h={11}
          px={4}
          borderWidth={0}
          fontSize="md"
          color="gray.100"
          fontFamily="body"
          placeholderTextColor="gray.200"
          isInvalid={invalid}
          _invalid={{
            borderWidth: 1,
            borderColor: "redLight"
          }}
          _focus={{
            bg: "gray.700",
            borderWidth: 1,
            borderColor: "gray.100"
          }}
          type={show ? "text" : "password"}
          InputRightElement={
            <Pressable onPress={() => setShow(!show)}>
              <Icon as={show ? <EyeClosed /> : <Eye />} size={5} mr="3" color="gray.100" />
            </Pressable>
            
          }
          { ...rest }
        />
      </Stack>
      <FormControl.ErrorMessage _text={{ color: 'redLight' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}