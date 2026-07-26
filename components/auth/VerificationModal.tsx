import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CODE_LENGTH = 6;

export default function VerificationModal({
  visible,
  email,
  onClose,
  onVerify,
  onResend,
}: {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<string | void>;
  onResend: () => void;
}) {
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCode('');
      setError(null);
      setVerifying(false);
      return;
    }
    const focusTimeout = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(focusTimeout);
  }, [visible]);

  const handleChange = async (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digitsOnly);
    setError(null);

    if (digitsOnly.length === CODE_LENGTH) {
      setVerifying(true);
      const errorMessage = await onVerify(digitsOnly);
      setVerifying(false);

      if (errorMessage) {
        setError(errorMessage);
        setCode('');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(13, 19, 43, 0.4)' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className='rounded-t-3xl bg-white px-6 pb-10 pt-4'>
            <View className='mb-2 items-end'>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Text className='text-body-lg text-text-secondary'>✕</Text>
              </TouchableOpacity>
            </View>

            <Text className='text-h3 font-poppins-bold text-text-primary'>Check your email</Text>
            <Text className='mt-2 text-body-md text-text-secondary'>
              We&apos;ve sent a 6-digit verification code to{' '}
              <Text className='font-poppins-medium text-text-primary'>{email || 'your email'}</Text>. Enter it below to
              continue.
            </Text>

            <Pressable onPress={() => inputRef.current?.focus()} className='mt-6'>
              <View className='flex-row justify-center gap-2'>
                {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                  <View
                    key={i}
                    className={`h-14 w-11 items-center justify-center rounded-2xl border ${
                      error ? 'border-error' : i === code.length ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <Text className='text-h3 font-poppins-semibold text-text-primary'>{code[i] ?? ''}</Text>
                  </View>
                ))}
              </View>
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                keyboardType='number-pad'
                maxLength={CODE_LENGTH}
                editable={!verifying}
                style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
              />
            </Pressable>

            {error && <Text className='mt-3 text-center text-body-sm text-error'>{error}</Text>}

            <TouchableOpacity onPress={onResend} className='mt-6 items-center'>
              <Text className='text-body-md text-text-secondary'>
                Didn&apos;t receive a code? <Text className='font-poppins-semibold text-primary'>Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
