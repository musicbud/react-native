import React, { useState, useRef } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../theme/design_system';

const { width, height } = Dimensions.get('window');

const ResendEmailAltScreen = () => {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill('')); // Assuming 6-digit code
  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus to next input
    if (text && index < 5) { // Assuming 6 digits (index 0-5)
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }: any, index: number) => {
    // Auto-focus to previous input on backspace
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const fullCode = code.join('');
    // TODO: Implement actual API call to verify code
    console.log('Confirming code:', fullCode);
    if (fullCode.length === 6) { // Basic validation for 6 digits
      alert('Code confirmed! (simulated)');
      router.push('/ChangePassScreen'); // Assuming next step is changing password
    } else {
      alert('Please enter the full 6-digit code.');
    }
  };

  const handleResendCode = () => {
    // TODO: Implement actual API call to resend code
    console.log('Resending code...');
    alert('Code resent! (simulated)');
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Resend Email2.png') */ }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to your email.</Text>

        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              selectionColor="white"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendLinkText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background,
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.7,
  },
  overlay: {
    backgroundColor: DesignSystem.colors.overlay,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: DesignSystem.colors.onSurface,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: DesignSystem.colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: DesignSystem.colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 40,
  },
  codeInput: {
    width: 45, // Adjust size as needed for digits
    height: 50,
    paddingVertical: 12,
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderRadius: 24,
    color: DesignSystem.colors.textPrimary,
    fontSize: 24,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: DesignSystem.colors.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: DesignSystem.colors.onPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendLinkText: {
    color: DesignSystem.colors.primary,
    fontSize: 14,
    marginTop: 10,
  },
});

export default ResendEmailAltScreen;