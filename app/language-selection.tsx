import { images } from '@/constants/images';
import { languages } from '@/data/languages';
import { useLanguageStore } from '@/store/languageStore';
import type { LanguageCode } from '@/types/learning';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LanguageSelection() {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState<LanguageCode | null>(null);
  const setSelectedLanguage = useLanguageStore((state) => state.setSelectedLanguage);

  const handleConfirm = () => {
    if (!selectedCode) return;
    setSelectedLanguage(selectedCode);
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className='flex-row items-center justify-center px-4 pt-2'>
        <TouchableOpacity onPress={() => router.back()} className='absolute left-4 z-10' hitSlop={12}>
          <Ionicons name='chevron-back' size={24} color='#0D132B' />
        </TouchableOpacity>
        <Text className='text-h3 font-poppins-semibold text-text-primary'>Выберите язык</Text>
      </View>

      <ScrollView
        className='flex-1 px-6'
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <Text className='mt-6 text-body-md font-poppins-semibold text-text-secondary'>Популярные</Text> */}

        <View className='mt-4 gap-1'>
          {languages.map((language) => {
            const isSelected = language.code === selectedCode;

            return (
              <TouchableOpacity
                key={language.code}
                onPress={() => setSelectedCode(language.code)}
                activeOpacity={0.8}
                className={`flex-row items-center rounded-2xl border px-4 py-3 ${
                  isSelected ? 'border-primary bg-[#F5F3FF]' : 'border-border bg-white'
                }`}
              >
                <Image source={{ uri: language.flagEmoji }} className='h-12 w-12 rounded-full bg-surface' />

                <View className='ml-4 flex-1'>
                  <Text className='text-body-lg font-poppins-semibold text-text-primary'>{language.name}</Text>
                  <Text className='mt-0.5 text-body-sm text-text-secondary'>{language.description}</Text>
                </View>

                {isSelected ? (
                  <View className='h-6 w-6 items-center justify-center rounded-full bg-primary'>
                    <Ionicons name='checkmark' size={16} color='#FFFFFF' />
                  </View>
                ) : (
                  <View className='h-6 w-6 rounded-full border border-border' />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Image source={images.earth} className='h-36 w-full' resizeMode='contain' />
      </ScrollView>

      <View className='px-6 pb-6 pt-3'>
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!selectedCode}
          className={`items-center rounded-full py-3 ${selectedCode ? 'bg-primary' : 'bg-border'}`}
        >
          <Text className={`text-body-lg font-poppins-semibold ${selectedCode ? 'text-white' : 'text-text-secondary'}`}>
            Подтвердить
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
