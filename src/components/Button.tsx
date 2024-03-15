import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  variant?: 'blue' | 'black' | 'gray';
}

export function Button({ title, variant = 'black', ...rest }: Props) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'black':
        return 'gray.100';
      case 'blue':
        return 'blueLight';
      default:
        return 'gray.500';
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case 'black':
      case 'blue':
        return 'gray.700';
      default:
        return 'gray.200';
    }
  }

  return (
    <NativeBaseButton
      w="full"
      h={11}
      bg={getBackgroundColor()}
      rounded="sm"
      _pressed={{
        bg: getBackgroundColor()
      }}
      { ...rest }
    >
      <Text
        color={getTextColor()}
        fontFamily="heading"
        fontSize="sm"
      >
        { title }
      </Text>
    </NativeBaseButton>
  ); 
}