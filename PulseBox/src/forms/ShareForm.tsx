import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Dimensions,
  Share as RNShare,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useForms } from '../context/FormsContext';
import { fonts as F, useThemeMode } from '../theme';
import BackButton from '../components/Reusable-Components/BackButton';
import ShareIcon from '../../assets/images/share.svg';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { PulseScrollView } from '../components/PulseScrollView';
import { usePulseAlert } from '../context/AlertModalContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ShareForm'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ShareForm: React.FC<Props> = ({ route, navigation }) => {
  const { ink, theme, isDark } = useThemeMode();
  const { formId } = route.params;
  const { forms } = useForms();
  const { showSuccess, showError } = usePulseAlert();
  const form = forms.find((f) => f.id === formId);

  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const viewShotRef = useRef<any>(null);

  const formLink = form ? `https://pulsebox.app/form/${formId}` : '';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: ink.canvas,
        },
        header: {
          paddingTop: 70,
          paddingHorizontal: 24,
          paddingBottom: 16,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: ink.rowDivider,
          flexDirection: 'row',
          alignItems: 'center',
        },
        backBtn: {
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: ink.borderInk,
          alignItems: 'center',
          justifyContent: 'center',
        },
        headerCenter: {
          flex: 1,
          alignItems: 'center',
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: '700',
          fontFamily: F.outfitBold,
          color: ink.ink,
        },
        headerSubtitle: {
          fontSize: 12,
          fontFamily: F.dmRegular,
          color: ink.inkSoft,
          marginTop: 2,
        },
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          padding: 24,
          paddingBottom: 40,
        },
        previewSection: {
          marginBottom: 24,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: '700',
          fontFamily: F.outfitBold,
          color: ink.ink,
          marginBottom: 12,
        },
        previewCard: {
          backgroundColor: theme.primarySoft,
          borderWidth: 1,
          borderColor: ink.borderInk,
          borderRadius: 12,
          padding: 16,
        },
        previewCardHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        },
        previewIcon: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: ink.borderInk,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        },
        previewFormName: {
          flex: 1,
          fontSize: 18,
          fontWeight: '600',
          fontFamily: F.dmSemi,
          color: ink.ink,
        },
        previewDescription: {
          fontSize: 14,
          fontFamily: F.dmRegular,
          color: ink.inkSoft,
          lineHeight: 20,
        },
        tabSelector: {
          flexDirection: 'row',
          backgroundColor: isDark ? theme.backgroundAlt : '#F5F5F5',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        },
        tab: {
          flex: 1,
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        },
        tabActive: {
          backgroundColor: theme.primary,
        },
        tabText: {
          fontSize: 14,
          fontFamily: F.dmMedium,
          color: ink.inkSoft,
        },
        tabTextActive: {
          color: theme.white,
          fontFamily: F.dmSemi,
        },
        contentSection: {
          flex: 1,
        },
        section: {
          marginBottom: 32,
        },
        sectionLabel: {
          fontSize: 16,
          fontWeight: '600',
          fontFamily: F.dmSemi,
          color: ink.ink,
          marginBottom: 12,
        },
        linkContainer: {
          flexDirection: 'row',
          gap: 10,
          marginBottom: 8,
        },
        linkInput: {
          flex: 1,
          backgroundColor: isDark ? theme.backgroundAlt : '#F5F5F5',
          borderWidth: 1,
          borderColor: ink.borderInk,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 14,
          fontFamily: F.dmRegular,
          color: ink.ink,
        },
        copyBtn: {
          backgroundColor: theme.primary,
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 12,
          justifyContent: 'center',
        },
        copyBtnText: {
          fontSize: 14,
          fontFamily: F.dmSemi,
          color: theme.white,
        },
        helperText: {
          fontSize: 12,
          fontFamily: F.dmRegular,
          color: ink.inkSoft,
          lineHeight: 18,
        },
        shareActionBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? theme.backgroundAlt : '#F5F5F5',
          borderWidth: 1,
          borderColor: ink.borderInk,
          borderRadius: 12,
          padding: 16,
          gap: 12,
        },
        shareActionText: {
          flex: 1,
          fontSize: 16,
          fontFamily: F.dmMedium,
          color: ink.ink,
        },
        socialGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        },
        socialBtn: {
          width: (SCREEN_WIDTH - 72) / 3,
          alignItems: 'center',
          backgroundColor: isDark ? theme.backgroundAlt : '#F5F5F5',
          borderWidth: 1,
          borderColor: ink.borderInk,
          borderRadius: 12,
          padding: 16,
        },
        socialIcon: {
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        },
        socialEmoji: {
          fontSize: 28,
        },
        socialLabel: {
          fontSize: 12,
          fontFamily: F.dmMedium,
          color: ink.ink,
        },
        qrDescription: {
          fontSize: 14,
          fontFamily: F.dmRegular,
          color: ink.inkSoft,
          lineHeight: 20,
          marginBottom: 24,
        },
        qrWrapper: {
          alignItems: 'center',
          marginBottom: 24,
        },
        qrCard: {
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: ink.borderInk,
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.35 : 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        qrFormName: {
          fontSize: 16,
          fontWeight: '600',
          fontFamily: F.dmSemi,
          color: '#000000',
          marginTop: 16,
          marginBottom: 4,
        },
        qrHelperText: {
          fontSize: 12,
          fontFamily: F.dmRegular,
          color: '#1A1A22',
        },
        saveQRBtn: {
          backgroundColor: theme.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: 'center',
          marginBottom: 16,
        },
        saveQRBtnText: {
          fontSize: 16,
          fontFamily: F.dmSemi,
          color: theme.white,
        },
        qrActions: {
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 12,
        },
        qrActionBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? theme.backgroundAlt : '#F5F5F5',
          borderWidth: 1,
          borderColor: ink.borderInk,
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 12,
          gap: 8,
        },
        qrActionText: {
          fontSize: 14,
          fontFamily: F.dmMedium,
          color: ink.ink,
        },
        errorContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        },
        errorText: {
          fontSize: 16,
          fontFamily: F.dmRegular,
          color: ink.inkSoft,
        },
        webIndicator: {
          marginTop: 12,
          padding: 12,
          backgroundColor: isDark ? 'rgba(45, 212, 191, 0.12)' : '#E8F5E9',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(45, 212, 191, 0.35)' : '#4CAF50',
          borderRadius: 8,
          alignItems: 'center',
        },
        webIndicatorText: {
          fontSize: 14,
          fontFamily: F.dmSemi,
          color: isDark ? theme.accent : '#2E7D32',
          marginBottom: 4,
        },
        webIndicatorSubtext: {
          fontSize: 12,
          fontFamily: F.dmRegular,
          color: isDark ? 'rgba(45, 212, 191, 0.85)' : '#4CAF50',
        },
        previewBtn: {
          marginTop: 12,
          backgroundColor: theme.primary,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: 'center',
        },
        previewBtnText: {
          fontSize: 14,
          fontFamily: F.dmSemi,
          color: theme.white,
        },
        openBrowserBtn: {
          marginTop: 12,
          backgroundColor: isDark ? theme.backgroundAlt : '#F5F5F5',
          borderWidth: 1,
          borderColor: ink.borderInk,
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
        },
        openBrowserBtnText: {
          fontSize: 14,
          fontFamily: F.dmSemi,
          color: ink.ink,
        },
      }),
    [ink, theme, isDark],
  );

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(formLink);
      showSuccess('Link Copied', 'Form link has been copied to clipboard.');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showError('Error', 'Failed to copy link to clipboard.');
    }
  };

  const openInBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(formLink);
      if (supported) {
        await Linking.openURL(formLink);
      } else {
        showError('Error', `Cannot open URL: ${formLink}`);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      showError('Error', 'Failed to open link in browser.');
    }
  };

  const shareLink = async () => {
    try {
      await RNShare.share({
        message: `Check out this form: ${formLink}`,
        title: form?.name || 'Share Form',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const shareOnSocial = async (platform: string) => {
    const message = `Check out this form: ${formLink}`;

    switch (platform) {
      case 'whatsapp':
        await RNShare.share({
          message: `${message} ${formLink}`,
          title: form?.name || 'Share Form',
        });
        break;
      case 'email':
        await RNShare.share({
          message,
          title: form?.name || 'Share Form',
        });
        break;
      case 'sms':
        await RNShare.share({
          message: `${message} ${formLink}`,
        });
        break;
      default:
        await shareLink();
    }
  };

  const saveQRCode = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          format: 'png',
          quality: 1.0,
        });
        showSuccess('QR Code Saved', `QR code has been saved to: ${uri}`);
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
      showError('Error', 'Failed to save QR code.');
    }
  };

  const backStroke = ink.ink;
  const iconStroke = ink.ink;

  if (!form) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            size={16}
            stroke={backStroke}
            rippleColor={theme.rippleLight}
          />
          <Text style={styles.headerTitle}>Share Form</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Form not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          size={16}
          stroke={backStroke}
          rippleColor={theme.rippleLight}
        />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Share Form</Text>
          <Text style={styles.headerSubtitle}>{form.name}</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <PulseScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Form Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewCardHeader}>
              <View style={styles.previewIcon}>
                <ShareIcon width={24} height={24} stroke={theme.primary} />
              </View>
              <Text style={styles.previewFormName}>{form.name}</Text>
            </View>
            <Text style={styles.previewDescription}>
              Share this form with others to collect responses. This form will be accessible on the web.
            </Text>
            <View style={styles.webIndicator}>
              <Text style={styles.webIndicatorText}>🌐 Web Form</Text>
              <Text style={styles.webIndicatorSubtext}>This form will be published on the web</Text>
            </View>
            <Pressable
              style={styles.previewBtn}
              onPress={openInBrowser}
              android_ripple={{ color: theme.rippleLight }}
            >
              <Text style={styles.previewBtnText}>Preview in Browser</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.tabSelector}>
          <Pressable
            style={[styles.tab, activeTab === 'link' && styles.tabActive]}
            onPress={() => setActiveTab('link')}
            android_ripple={{ color: theme.rippleLight }}
          >
            <Text style={[styles.tabText, activeTab === 'link' && styles.tabTextActive]}>Link Sharing</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'qr' && styles.tabActive]}
            onPress={() => setActiveTab('qr')}
            android_ripple={{ color: theme.rippleLight }}
          >
            <Text style={[styles.tabText, activeTab === 'qr' && styles.tabTextActive]}>QR Code</Text>
          </Pressable>
        </View>

        {activeTab === 'link' && (
          <View style={styles.contentSection}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Shareable Link</Text>
              <View style={styles.linkContainer}>
                <TextInput
                  style={styles.linkInput}
                  value={formLink}
                  editable={false}
                  selectTextOnFocus
                />
                <Pressable
                  style={styles.copyBtn}
                  onPress={copyToClipboard}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <Text style={styles.copyBtnText}>Copy</Text>
                </Pressable>
              </View>
              <Text style={styles.helperText}>
                Share this link with anyone to allow them to fill out your form on the web
              </Text>
              <Pressable
                style={styles.openBrowserBtn}
                onPress={openInBrowser}
                android_ripple={{ color: theme.rippleLight }}
              >
                <Text style={styles.openBrowserBtnText}>Open in Browser</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quick Share</Text>
              <Pressable
                style={styles.shareActionBtn}
                onPress={shareLink}
                android_ripple={{ color: theme.rippleLight }}
              >
                <ShareIcon width={24} height={24} stroke={iconStroke} />
                <Text style={styles.shareActionText}>Share via...</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Share on Social Media</Text>
              <View style={styles.socialGrid}>
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('whatsapp')}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#25D366' }]}>
                    <Text style={styles.socialEmoji}>💬</Text>
                  </View>
                  <Text style={styles.socialLabel}>WhatsApp</Text>
                </Pressable>

                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('email')}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#4285F4' }]}>
                    <Text style={styles.socialEmoji}>✉️</Text>
                  </View>
                  <Text style={styles.socialLabel}>Email</Text>
                </Pressable>

                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('sms')}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#34B7F1' }]}>
                    <Text style={styles.socialEmoji}>💬</Text>
                  </View>
                  <Text style={styles.socialLabel}>SMS</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'qr' && (
          <View style={styles.contentSection}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>QR Code</Text>
              <Text style={styles.qrDescription}>
                Scan this QR code to access your form. Perfect for posters, presentations, or printed materials.
              </Text>

              <View style={styles.qrWrapper}>
                <View ref={viewShotRef} style={styles.qrCard}>
                  <QRCode value={formLink} size={250} color="#000000" backgroundColor="#FFFFFF" />
                  <Text style={styles.qrFormName}>{form.name}</Text>
                  <Text style={styles.qrHelperText}>Scan to access form on web</Text>
                </View>
              </View>

              <Pressable
                style={styles.saveQRBtn}
                onPress={saveQRCode}
                android_ripple={{ color: theme.rippleLight }}
              >
                <Text style={styles.saveQRBtnText}>Save QR Code</Text>
              </Pressable>

              <View style={styles.qrActions}>
                <Pressable
                  style={styles.qrActionBtn}
                  onPress={shareLink}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <ShareIcon width={20} height={20} stroke={iconStroke} />
                  <Text style={styles.qrActionText}>Share QR</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </PulseScrollView>
    </View>
  );
};

export default ShareForm;
