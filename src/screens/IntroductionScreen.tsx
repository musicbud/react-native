// musicbud-expo/src/screens/IntroductionScreen.tsx
import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { StyleSheet, View, Text, Linking, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const imgProfile = "https://www.figma.com/api/mcp/asset/fc5ded98-2cc4-4717-8bdf-01b0e8727734";
const imgVector = "https://www.figma.com/api/mcp/asset/2b2ccfe6-5e5d-4869-887d-3ed63655d7c0";
const imgSocialBehance = "https://www.figma.com/api/mcp/asset/b7699159-991b-4075-9b76-ba7aab98efb1";
const imgVector1 = "https://www.figma.com/api/mcp/asset/50867cd1-8989-4a99-8f08-8957f27c1433";

export default function IntroductionScreen() {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container} testID="introduction">
      <View style={styles.eslamContainer}>
        <Text style={styles.eslamText}>Eslam.</Text>
      </View>
      <View style={styles.profileContainer} testID="Profile">
        <SafeImage source={{ uri: imgProfile }} style={styles.profileImage} />
      </View>
      <View style={styles.linksContainer} testID="Links">
        <View style={styles.backlink}>
          <View style={styles.socialIconContainer}>
            <SafeImage source={{ uri: imgVector }} style={styles.socialIcon} />
          </View>
          <TouchableOpacity onPress={() => handleLinkPress("https://dribbble.com/Evani")}>
            <Text style={styles.linkText}>Gray | Dribbble</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.backlink}>
          <View style={styles.socialIconContainer}>
            <SafeImage source={{ uri: imgSocialBehance }} style={styles.socialIcon} />
          </View>
          <TouchableOpacity onPress={() => handleLinkPress("https://www.behance.net/Grayberry")}>
            <Text style={styles.linkText}>Gray | Behance</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.backlink}>
          <View style={styles.socialIconContainer}>
            <SafeImage source={{ uri: imgVector1 }} style={styles.socialIcon} />
          </View>
          <Text style={styles.emailText}>
            <Text style={styles.emailTextBold}>GrayBerryPawn@gmail</Text>
            <Text style={styles.emailTextNormal}>.</Text>
            <Text style={styles.emailTextBold}>com</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 7,
    borderStyle: 'solid',
    flexDirection: 'column',
    gap: 48,
    alignItems: 'flex-start',
    paddingBottom: 64,
    paddingLeft: 256,
    paddingRight: 64,
    paddingTop: 148,
    position: 'relative',
    borderRadius: 40,
    boxShadow: '16px 16px 0px rgba(0, 0, 0, 1)',
    flex: 1,
    width: width, // Ensure the container takes full width
    height: height, // Ensure the container takes full height
  },
  eslamContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'PoiretOne-Regular',
    fontSize: 124,
    color: 'black',
    letterSpacing: 7.44,
    width: 893,
  },
  eslamText: {
    lineHeight: 124 * 1.2,
  },
  profileContainer: {
    position: 'absolute',
    left: -211,
    width: 421,
    height: 421,
    top: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  linksContainer: {
    position: 'absolute',
    backgroundColor: 'black',
    bottom: 157,
    flexDirection: 'column',
    gap: 24,
    alignItems: 'flex-start',
    paddingHorizontal: 128,
    paddingVertical: 40,
    borderRadius: 200,
    left: 1015,
    height: 322,
    width: 702.5,
  },
  backlink: {
    flexDirection: 'row',
    gap: 24.5,
    alignItems: 'flex-end',
  },
  socialIconContainer: {
    overflow: 'hidden',
    width: 36,
    height: 36,
  },
  socialIcon: {
    position: 'absolute',
    left: 4.5,
    width: 27,
    height: 27,
    top: 4.5,
  },
  linkText: {
    fontFamily: 'Jost-Bold',
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    textDecorationLine: 'underline',
  },
  emailText: {
    fontSize: 30,
    color: 'white',
  },
  emailTextBold: {
    fontFamily: 'Jost-Bold',
    fontWeight: 'bold',
  },
  emailTextNormal: {
    fontFamily: 'Jost-Regular',
    fontWeight: 'normal',
  },
});
