import { colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const CIRCLE_SIZE = 48;
const BAR_TOP_PADDING = 8;

type IconRenderer = (color: string) => React.ReactNode;

const ICON_SIZE = 22;

const TAB_ICONS: Record<string, { active: IconRenderer; inactive: IconRenderer }> = {
  home: {
    active: (color) => <Ionicons name='home' size={ICON_SIZE} color={color} />,
    inactive: (color) => <Ionicons name='home-outline' size={ICON_SIZE} color={color} />,
  },
  learn: {
    active: (color) => <Ionicons name='book' size={ICON_SIZE} color={color} />,
    inactive: (color) => <Ionicons name='book-outline' size={ICON_SIZE} color={color} />,
  },
  'ai-teacher': {
    active: (color) => <MaterialCommunityIcons name='robot' size={ICON_SIZE} color={color} />,
    inactive: (color) => <MaterialCommunityIcons name='robot-outline' size={ICON_SIZE} color={color} />,
  },
  chat: {
    active: (color) => <Ionicons name='chatbubble-ellipses' size={ICON_SIZE} color={color} />,
    inactive: (color) => <Ionicons name='chatbubble-ellipses-outline' size={ICON_SIZE} color={color} />,
  },
  profile: {
    active: (color) => <Ionicons name='person' size={ICON_SIZE} color={color} />,
    inactive: (color) => <Ionicons name='person-outline' size={ICON_SIZE} color={color} />,
  },
};

type TabLayout = { x: number; width: number };

export function CustomTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const [tabLayouts, setTabLayouts] = useState<Record<number, TabLayout>>({});
  const circleX = useSharedValue(0);
  const circleOpacity = useSharedValue(0);

  const activeLayout = tabLayouts[state.index];

  useEffect(() => {
    if (!activeLayout) return;

    const target = activeLayout.x + activeLayout.width / 2 - CIRCLE_SIZE / 2;
    circleX.value = withSpring(target, { damping: 16, stiffness: 160 });
    circleOpacity.value = withTiming(1, { duration: 150 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, activeLayout?.x, activeLayout?.width]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ translateX: circleX.value }],
  }));

  return (
    <View className='flex-row border-t border-border bg-white pt-2' style={{ paddingBottom: insets.bottom || 12 }}>
      <Animated.View
        pointerEvents='none'
        style={[
          {
            position: 'absolute',
            top: BAR_TOP_PADDING,
            left: 0,
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            backgroundColor: colors.primary,
          },
          circleStyle,
        ]}
      />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const label = (options.title ?? route.name) as string;
        const icons = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLayout = (event: LayoutChangeEvent) => {
          const { x, width } = event.nativeEvent.layout;
          setTabLayouts((prev) => ({ ...prev, [index]: { x, width } }));
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLayout={onLayout}
            className='flex-1 items-center'
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <View style={{ height: CIRCLE_SIZE }} className='items-center justify-center'>
              {isFocused ? icons.active('#FFFFFF') : icons.inactive(colors.textSecondary)}
            </View>

            {!isFocused && (
              <Text className='text-caption font-poppins-medium text-text-secondary' numberOfLines={1}>
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
