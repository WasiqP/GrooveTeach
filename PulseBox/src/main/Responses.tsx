import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BottomTab from '../components/BottomTab';
import { PulseScrollView } from '../components/PulseScrollView';
import TabScreenHeaderBar from '../components/TabScreenHeaderBar';
import { useForms } from '../context/FormsContext';
import { theme, fonts as F, ink, radius } from '../theme';

const CANVAS = ink.canvas;
const INK = ink.ink;
const INK_SOFT = ink.inkSoft;
const BORDER_INK = ink.borderInk;
const BORDER_WIDTH = ink.borderWidth;
const ROW_DIVIDER = ink.rowDivider;
const R_CARD = radius.card;
const R_INPUT = radius.input;
import ShareIcon from '../../assets/images/share.svg';
import TrashIcon from '../../assets/images/trash.svg';
import StatsIcon from '../../assets/images/stats.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Responses'>;

interface ResponseData {
  id: string;
  formId: string;
  formName: string;
  submittedAt: string;
  answers: Record<string, any>;
  isRead: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isSaved: boolean;
}

const Responses: React.FC<Props> = ({ navigation }) => {
  const { forms } = useForms();
  const [filter, setFilter] = useState<'all' | 'unread' | 'favorites' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Mock responses data - In real app, this would come from context/API
  const [responses, setResponses] = useState<ResponseData[]>([]);

  const filteredResponses = useMemo(() => {
    let filtered = responses;

    // Apply filter
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(r => !r.isRead);
        break;
      case 'favorites':
        filtered = filtered.filter(r => r.isFavorite);
        break;
      case 'archived':
        filtered = filtered.filter(r => r.isArchived);
        break;
      default:
        filtered = filtered.filter(r => !r.isArchived); // Don't show archived by default
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.formName.toLowerCase().includes(query) ||
        Object.values(r.answers).some(answer => 
          String(answer).toLowerCase().includes(query)
        )
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [responses, filter, searchQuery]);

  const toggleFavorite = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const toggleArchive = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isArchived: !r.isArchived } : r
    ));
  };

  const toggleSave = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isSaved: !r.isSaved } : r
    ));
  };

  const markAsRead = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isRead: true } : r
    ));
  };

  const deleteResponse = (id: string) => {
    setResponses(prev => prev.filter(r => r.id !== id));
  };

  const ResponseCard: React.FC<{ response: ResponseData }> = ({ response }) => {
    const firstAnswer = Object.values(response.answers)[0];
    const preview = firstAnswer ? String(firstAnswer).substring(0, 100) : 'No answer provided';
    
    return (
      <Pressable
        style={[styles.responseCard, !response.isRead && styles.responseCardUnread]}
        onPress={() => markAsRead(response.id)}
        android_ripple={{ color: 'rgba(160,96,255,0.08)' }}
      >
        <View style={styles.responseHeader}>
          <View style={styles.responseHeaderLeft}>
            {!response.isRead && <View style={styles.unreadDot} />}
            <View style={styles.responseInfo}>
              <Text style={styles.responseFormName}>{response.formName}</Text>
              <Text style={styles.responseDate}>
                {new Date(response.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
          <View style={styles.responseActions}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(response.id);
              }}
              style={styles.actionBtn}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
            >
              <Text style={[styles.actionIcon, response.isFavorite && styles.actionIconActive]}>
                ★
              </Text>
            </Pressable>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleSave(response.id);
              }}
              style={styles.actionBtn}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
            >
              <Text style={[styles.actionIcon, response.isSaved && styles.actionIconActive]}>
                {response.isSaved ? '✓' : '○'}
              </Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.responsePreview} numberOfLines={2}>
          {preview}
        </Text>
        <View style={styles.responseFooter}>
          <View style={styles.responseFooterLeft}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleArchive(response.id);
              }}
              style={styles.footerActionBtn}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
            >
              <Text style={styles.footerActionText}>
                {response.isArchived ? 'Unarchive' : 'Archive'}
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              deleteResponse(response.id);
            }}
            style={styles.deleteBtn}
            android_ripple={{ color: 'rgba(255,0,0,0.1)', borderless: true }}
          >
            <TrashIcon width={18} height={18} stroke="#FF6B6B" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TabScreenHeaderBar
        navigation={navigation}
        right={
          <Pressable
            style={styles.filterBtn}
            onPress={() => setShowFilterModal(true)}
            android_ripple={{ color: 'rgba(160,96,255,0.12)', borderless: true }}
          >
            <StatsIcon width={24} height={24} stroke={theme.primary} />
          </Pressable>
        }
      >
        <View>
          <Text style={styles.title}>Responses</Text>
          <Text style={styles.subtitle}>
            {filteredResponses.length} {filteredResponses.length === 1 ? 'response' : 'responses'}
          </Text>
        </View>
      </TabScreenHeaderBar>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search responses..."
          placeholderTextColor={ink.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
            Unread
          </Text>
          {responses.filter(r => !r.isRead && !r.isArchived).length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {responses.filter(r => !r.isRead && !r.isArchived).length}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'favorites' && styles.filterTabActive]}
          onPress={() => setFilter('favorites')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'favorites' && styles.filterTabTextActive]}>
            Favorites
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'archived' && styles.filterTabActive]}
          onPress={() => setFilter('archived')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'archived' && styles.filterTabTextActive]}>
            Archived
          </Text>
        </Pressable>
      </View>

      {/* Responses List */}
      <PulseScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredResponses.length === 0 ? (
          <View style={styles.emptyState}>
            <StatsIcon width={64} height={64} stroke={ink.iconMuted} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No responses found' : filter === 'archived' ? 'No archived responses' : 'No responses yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try adjusting your search query'
                : filter === 'archived'
                ? 'Archived responses will appear here'
                : 'Responses to your forms will appear here'}
            </Text>
          </View>
        ) : (
          filteredResponses.map((response) => (
            <ResponseCard key={response.id} response={response} />
          ))
        )}
      </PulseScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter Responses</Text>
                <Text style={styles.modalSubtitle}>
                  Total: {responses.length} | 
                  Unread: {responses.filter(r => !r.isRead).length} | 
                  Favorites: {responses.filter(r => r.isFavorite).length}
                </Text>
                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setShowFilterModal(false)}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <BottomTab navigation={navigation} currentRoute="Responses" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: F.outfitBlack,
    color: INK,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: CANVAS,
  },
  searchInput: {
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_INPUT,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: F.dmRegular,
    color: INK,
  },
  filterTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
    backgroundColor: CANVAS,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: INK,
    borderColor: INK,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
  },
  filterTabTextActive: {
    color: CANVAS,
  },
  badge: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: F.dmSemi,
    color: theme.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  responseCard: {
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_CARD,
    padding: 16,
    marginBottom: 12,
  },
  responseCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    backgroundColor: 'rgba(160, 96, 255, 0.06)',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
    marginRight: 12,
    marginTop: 6,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  responseHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  responseInfo: {
    flex: 1,
  },
  responseFormName: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: F.dmBold,
    color: INK,
    marginBottom: 3,
  },
  responseDate: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  responseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
  },
  actionIcon: {
    fontSize: 18,
    color: INK_SOFT,
  },
  actionIconActive: {
    color: theme.primary,
  },
  responsePreview: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginBottom: 12,
  },
  responseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ROW_DIVIDER,
  },
  responseFooterLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  footerActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  footerActionText: {
    fontSize: 13,
    fontFamily: F.dmSemi,
    color: theme.primary,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: F.outfitExtraBold,
    color: INK,
    letterSpacing: -0.5,
    marginTop: 16,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    lineHeight: 23,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: CANVAS,
    borderRadius: R_CARD,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: F.outfitExtraBold,
    color: INK,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginBottom: 24,
  },
  modalCloseBtn: {
    backgroundColor: INK,
    borderRadius: radius.btn,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: F.outfitBold,
    color: theme.white,
  },
});

export default Responses;
