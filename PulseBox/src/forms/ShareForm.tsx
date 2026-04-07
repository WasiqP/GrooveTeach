import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Dimensions, Share as RNShare, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useForms } from '../context/FormsContext';
import { theme } from '../theme/Colors';
import BackIcon from '../../assets/images/Back.svg';
import ShareIcon from '../../assets/images/share.svg';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'ShareForm'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ShareForm: React.FC<Props> = ({ route, navigation }) => {
  const { formId } = route.params;
  const { forms } = useForms();
  const form = forms.find(f => f.id === formId);
  
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const viewShotRef = useRef<any>(null);
  
  // Generate form link
  const formLink = form 
    ? `https://pulsebox.app/form/${formId}`
    : '';

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(formLink);
      Alert.alert('Link Copied', 'Form link has been copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy link to clipboard');
    }
  };

  const openInBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(formLink);
      if (supported) {
        await Linking.openURL(formLink);
      } else {
        Alert.alert('Error', `Cannot open URL: ${formLink}`);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open link in browser');
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
        // Note: React Native Share API doesn't support direct WhatsApp sharing
        // Users will need to select WhatsApp from the share sheet
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
        Alert.alert('QR Code Saved', `QR code has been saved to: ${uri}`);
        // Note: To save to gallery, you may need to use a library like react-native-fs or expo-media-library
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'Failed to save QR code');
    }
  };

  if (!form) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon width={16} height={16} stroke="#000000" />
          </Pressable>
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        >
          <BackIcon width={16} height={16} stroke="#000000" />
        </Pressable>
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
        {/* Form Preview Section */}
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
            {/* Web Sharing Indicator */}
            <View style={styles.webIndicator}>
              <Text style={styles.webIndicatorText}>🌐 Web Form</Text>
              <Text style={styles.webIndicatorSubtext}>This form will be published on the web</Text>
            </View>
            {/* Preview Button */}
            <Pressable
              style={styles.previewBtn}
              onPress={openInBrowser}
              android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
            >
              <Text style={styles.previewBtnText}>Preview in Browser</Text>
            </Pressable>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <Pressable
            style={[styles.tab, activeTab === 'link' && styles.tabActive]}
            onPress={() => setActiveTab('link')}
            android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
          >
            <Text style={[styles.tabText, activeTab === 'link' && styles.tabTextActive]}>
              Link Sharing
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'qr' && styles.tabActive]}
            onPress={() => setActiveTab('qr')}
            android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
          >
            <Text style={[styles.tabText, activeTab === 'qr' && styles.tabTextActive]}>
              QR Code
            </Text>
          </Pressable>
        </View>

        {/* Link Sharing Section */}
        {activeTab === 'link' && (
          <View style={styles.contentSection}>
            {/* Copy Link Section */}
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
                  android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
                >
                  <Text style={styles.copyBtnText}>Copy</Text>
                </Pressable>
              </View>
              <Text style={styles.helperText}>
                Share this link with anyone to allow them to fill out your form on the web
              </Text>
              {/* Open in Browser Button */}
              <Pressable
                style={styles.openBrowserBtn}
                onPress={openInBrowser}
                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              >
                <Text style={styles.openBrowserBtnText}>Open in Browser</Text>
              </Pressable>
            </View>

            {/* Quick Share Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quick Share</Text>
              <Pressable
                style={styles.shareActionBtn}
                onPress={shareLink}
                android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
              >
                <ShareIcon width={24} height={24} stroke="#000000" />
                <Text style={styles.shareActionText}>Share via...</Text>
              </Pressable>
            </View>

            {/* Social Media Sharing */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Share on Social Media</Text>
              <View style={styles.socialGrid}>
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('whatsapp')}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#25D366' }]}>
                    <Text style={styles.socialEmoji}>💬</Text>
                  </View>
                  <Text style={styles.socialLabel}>WhatsApp</Text>
                </Pressable>
                
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('email')}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#4285F4' }]}>
                    <Text style={styles.socialEmoji}>✉️</Text>
                  </View>
                  <Text style={styles.socialLabel}>Email</Text>
                </Pressable>
                
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('sms')}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
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

        {/* QR Code Section */}
        {activeTab === 'qr' && (
          <View style={styles.contentSection}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>QR Code</Text>
              <Text style={styles.qrDescription}>
                Scan this QR code to access your form. Perfect for posters, presentations, or printed materials.
              </Text>
              
              <View style={styles.qrWrapper}>
                <View ref={viewShotRef} style={styles.qrCard}>
                  <QRCode
                    value={formLink}
                    size={250}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                  />
                  <Text style={styles.qrFormName}>{form.name}</Text>
                  <Text style={styles.qrHelperText}>Scan to access form on web</Text>
                </View>
              </View>

              <Pressable
                style={styles.saveQRBtn}
                onPress={saveQRCode}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <Text style={styles.saveQRBtnText}>Save QR Code</Text>
              </Pressable>

              <View style={styles.qrActions}>
                <Pressable
                  style={styles.qrActionBtn}
                  onPress={shareLink}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <ShareIcon width={20} height={20} stroke="#000000" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000000',
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
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
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
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#F8F5FF',
    borderWidth: 1,
    borderColor: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewFormName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
  },
  previewDescription: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    lineHeight: 20,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    color: '#1A1A22',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'DMSans-SemiBold',
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
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  linkInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
  },
  copyBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  copyBtnText: {
    fontSize: 14,
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    lineHeight: 18,
  },
  shareActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  shareActionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'DMSans-Medium',
    color: '#000000',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialBtn: {
    width: (SCREEN_WIDTH - 72) / 3,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
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
    fontFamily: 'DMSans-Medium',
    color: '#000000',
  },
  qrDescription: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
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
    borderColor: '#000000',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 16,
  },
  qrFormName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 4,
  },
  qrHelperText: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
  },
  saveQRBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveQRBtnText: {
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
  qrActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  qrActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  qrActionText: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
  },
  webIndicator: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  webIndicatorText: {
    fontSize: 14,
    fontFamily: 'DMSans-SemiBold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  webIndicatorSubtext: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#4CAF50',
  },
  previewBtn: {
    marginTop: 12,
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  previewBtnText: {
    fontSize: 14,
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
  openBrowserBtn: {
    marginTop: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  openBrowserBtnText: {
    fontSize: 14,
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
  },
});

export default ShareForm;

