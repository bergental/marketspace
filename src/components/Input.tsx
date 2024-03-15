import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;
  return (
    <FormControl isInvalid={invalid} mb={4}>
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
        { ...rest }
      />
      <FormControl.ErrorMessage _text={{ color: 'redLight' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}