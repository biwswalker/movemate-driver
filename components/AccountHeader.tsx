import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from 'react-native';
import Text, { getFontVarient } from './Text';
import ButtonIcon from './ButtonIcon';
import { Iconify } from 'react-native-iconify';
import { Badge } from 'react-native-paper';
import { imagePath } from '@utils/file';
import colors from '@/constants/colors';
import useAuth from '@/hooks/useAuth';
import { normalize } from '@/utils/normalizeSize';

const styles = StyleSheet.create({
  accountContainer: {
    paddingTop: normalize(24),
    paddingHorizontal: normalize(32),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountAvatarWrapper: {},
  avatarImage: {
    borderRadius: normalize(24),
    width: normalize(48),
    height: normalize(48),
    resizeMode: 'cover',
    aspectRatio: 1,
  },
  accountNameWrapper: {
    flex: 1,
  },
  accountActionWrapper: {},
  notificationBadge: {
    backgroundColor: colors.error.dark,
    color: colors.common.white,
    ...getFontVarient('overline'),
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

interface AccountHeaderProps {
  style?: ViewStyle;
}

export default function AccountHeader({ style: containerStyle = {} }: AccountHeaderProps) {
  const { user, notificationCount } = useAuth();

  const imageUri: ImageSourcePropType = user?.profileImage
    ? { uri: imagePath(user.profileImage.filename) }
    : require('@assets/images/user-duotone-large.png');

  return (
    <View style={[styles.accountContainer, containerStyle]}>
      <View style={styles.accountAvatarWrapper}>
        <Image style={styles.avatarImage} source={imageUri} tintColor={colors.text.secondary} />
      </View>
      <View style={styles.accountNameWrapper}>
        <Text varient="h5" numberOfLines={1}>
          {user?.individualDriver?.fullname}
        </Text>
        <Text varient="body2" color="secondary">
          {user?.userNumber}
        </Text>
      </View>
      <View style={styles.accountActionWrapper}>
        <ButtonIcon varient="text" circle>
          <Iconify icon="solar:bell-bold-duotone" size={normalize(24)} color={colors.text.secondary} />
          {notificationCount > 0 && (
            <Badge
              style={[styles.notificationBadge]}
              theme={{
                fonts: { default: { fontFamily: getFontVarient().fontFamily } },
              }}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Badge>
          )}
        </ButtonIcon>
      </View>
    </View>
  );
}
