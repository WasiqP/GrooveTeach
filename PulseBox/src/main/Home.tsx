import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme, fonts as F, ink, radius } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import BottomTab from '../components/BottomTab';
import { PulseScrollView } from '../components/PulseScrollView';
import { useClasses } from '../context/ClassesContext';
import { useForms } from '../context/FormsContext';
import { useUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const CANVAS = ink.canvas;
const INK = ink.ink;
const INK_SOFT = ink.inkSoft;
const BORDER_INK = ink.borderInk;
const BORDER_WIDTH = ink.borderWidth;
const ROW_DIVIDER = ink.rowDivider;
const ICON_WELL = ink.iconWell;
const PRESS_TINT = ink.pressTint;

const PAGE_H = 20;
const R_CARD = radius.card;

/* —— Icons —— */
const IconBase = ({
  children,
  size = 22,
}: {
  children: React.ReactNode;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {children}
  </Svg>
);

const IconPlusCircle = ({ color, size = 22 }: { color: string; size?: number }) => (
  <IconBase size={size}>
    <Circle cx="12" cy="12" r="9.25" stroke={color} strokeWidth="1.75" />
    <Path
      d="M12 8.5v7M8.5 12h7"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </IconBase>
);

const IconFileLines = ({ color, size = 22 }: { color: string; size?: number }) => (
  <IconBase size={size}>
    <Path
      d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z"
      stroke={color}
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <Path d="M14 2v6h6" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
    <Path
      d="M8 13h8M8 17h6M8 9h3"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </IconBase>
);

const IconListChecks = ({ color, size = 22 }: { color: string; size?: number }) => (
  <IconBase size={size}>
    <Circle cx="6" cy="7" r="1.5" fill={color} />
    <Circle cx="6" cy="12" r="1.5" fill={color} />
    <Circle cx="6" cy="17" r="1.5" fill={color} />
    <Path
      d="M10 7h10M10 12h10M10 17h7"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </IconBase>
);

const IconClipboardUser = ({ color, size = 22 }: { color: string; size?: number }) => (
  <IconBase size={size}>
    <Path
      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
      stroke={color}
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <Path
      d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v0Z"
      stroke={color}
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12h6M9 16h4"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </IconBase>
);

const IconChevronRight = ({ color, size = 20 }: { color: string; size?: number }) => (
  <IconBase size={size}>
    <Path
      d="m9 18 6-6-6-6"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

const IconBook = ({ color, size = 22 }: { color: string; size?: number }) => (
  <IconBase size={size}>
    <Path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 7h8M8 11h6"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </IconBase>
);

const IconCircleCheck = ({ color, size = 22 }: { color: string; size?: number }) => (
  <IconBase size={size}>
    <Circle cx="12" cy="12" r="9.25" stroke={color} strokeWidth="1.75" />
    <Path
      d="m8.5 12.5 2 2 4.5-4.5"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

type QuickItem = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
};

const Home: React.FC<Props> = ({ navigation }) => {
  const { classes } = useClasses();
  const { forms } = useForms();
  const { firstName } = useUser();

  const heyLine = useMemo(() => {
    const who = firstName.trim() || 'there';
    return `Hey ${who}`;
  }, [firstName]);

  const avatarInitial = useMemo(() => {
    const n = firstName.trim();
    if (!n) return '?';
    return n.charAt(0).toUpperCase();
  }, [firstName]);

  const totalStudents = useMemo(
    () => classes.reduce((sum, c) => sum + (c.studentCount || 0), 0),
    [classes],
  );

  const accent = theme.primary;
  const iconMuted = 'rgba(160, 96, 255, 0.55)';
  const chevronMuted = 'rgba(160, 96, 255, 0.45)';

  const quickActions: QuickItem[] = useMemo(
    () => [
      {
        key: 'class',
        title: 'New class',
        subtitle: 'Create a cohort and invite students',
        icon: <IconPlusCircle color={accent} size={22} />,
        onPress: () => navigation.navigate('CreateClass'),
      },
      {
        key: 'lesson',
        title: 'Lesson plans',
        subtitle: 'Draft and organize lessons',
        icon: <IconFileLines color={accent} size={22} />,
        onPress: () => navigation.navigate('LessonPlanner'),
      },
      {
        key: 'quiz',
        title: 'Tasks & quizzes',
        subtitle: 'Build and publish for classes',
        icon: <IconListChecks color={accent} size={22} />,
        onPress: () => navigation.navigate('Quizzes'),
      },
      {
        key: 'att',
        title: 'Attendance',
        subtitle: 'Take roll in seconds',
        icon: <IconClipboardUser color={accent} size={22} />,
        onPress: () => {
          if (classes.length > 0) {
            navigation.navigate('Attendance', { classId: classes[0].id });
          } else {
            navigation.navigate('MyClasses');
          }
        },
      },
    ],
    [navigation, classes, accent],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.root}>
        <PulseScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
        >
          <View style={[styles.page, { paddingHorizontal: PAGE_H }]}>
            <View style={styles.topBar}>
              <View style={styles.brandRow}>
                <Text style={styles.brandGroove}>Groove</Text>
                <Text style={styles.brandBox}>Box</Text>
              </View>
              <Pressable
                style={styles.avatar}
                onPress={() => navigation.navigate('Settings')}
                accessibilityRole="button"
                accessibilityLabel="Open settings"
                android_ripple={{ color: theme.rippleLight, borderless: true }}
              >
                <Text style={styles.avatarLetter}>{avatarInitial}</Text>
              </Pressable>
            </View>

            <Text style={styles.greetingDisplay}>{heyLine}</Text>
            <Text style={styles.tagline}>
              Jump in — your classes and tools are ready when you are.
            </Text>

            <View style={styles.surfaceCard}>
              <View style={styles.statsRow}>
                <View style={styles.statBlock}>
                  <Text style={styles.statNum}>{classes.length}</Text>
                  <Text style={styles.statLab}>Classes</Text>
                </View>
                <View style={styles.statV} />
                <View style={styles.statBlock}>
                  <Text style={styles.statNum}>{totalStudents}</Text>
                  <Text style={styles.statLab}>Students</Text>
                </View>
                <View style={styles.statV} />
                <View style={styles.statBlock}>
                  <Text style={styles.statNum}>{forms.length}</Text>
                  <Text style={styles.statLab}>Saved items</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionHeading}>What do you want to do next?</Text>

            <View style={[styles.surfaceCard, styles.actionsCard]}>
              {quickActions.map((item, index) => (
                <Pressable
                  key={item.key}
                  style={({ pressed }) => [
                    styles.actionRow,
                    index < quickActions.length - 1 && styles.actionRowDivider,
                    pressed && styles.actionRowPressed,
                  ]}
                  onPress={item.onPress}
                  android_ripple={{ color: 'rgba(15,23,42,0.04)' }}
                >
                  <View style={styles.actionIconWell}>{item.icon}</View>
                  <View style={styles.actionCopy}>
                    <Text style={styles.actionTitle}>{item.title}</Text>
                    <Text style={styles.actionSub}>{item.subtitle}</Text>
                  </View>
                  <IconChevronRight color={chevronMuted} size={20} />
                </Pressable>
              ))}
            </View>

            <View style={styles.classesHead}>
              <View>
                <Text style={styles.sectionHeadingTight}>Your classes</Text>
                <Text style={styles.sectionMeta}>
                  {classes.length === 0
                    ? 'Nothing here yet'
                    : `${classes.length} active · ${totalStudents} students`}
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('MyClasses')}
                style={styles.seeAll}
                hitSlop={10}
              >
                <Text style={styles.seeAllText}>See all</Text>
                <IconChevronRight color={accent} size={18} />
              </Pressable>
            </View>

            {classes.length === 0 ? (
              <View style={[styles.surfaceCard, styles.emptyCard]}>
                <View style={styles.emptyIconWell}>
                  <IconBook color={accent} size={26} />
                </View>
                <Text style={styles.emptyTitle}>No classes yet</Text>
                <Text style={styles.emptyBody}>
                  Add a class to track rosters, attendance, and work in one place.
                </Text>
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => navigation.navigate('CreateClass')}
                  android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  <Text style={styles.primaryBtnLabel}>Create a class</Text>
                </Pressable>
              </View>
            ) : (
              <View style={[styles.surfaceCard, styles.classListCard]}>
                {classes.map((c, index) => (
                  <Pressable
                    key={c.id}
                    style={({ pressed }) => [
                      styles.classRow,
                      index < classes.length - 1 && styles.classRowDivider,
                      pressed && styles.classRowPressed,
                    ]}
                    onPress={() =>
                      navigation.navigate('ClassDetails', { classId: c.id })
                    }
                    android_ripple={{ color: 'rgba(15,23,42,0.04)' }}
                  >
                      <View style={styles.classIconWell}>
                        <IconBook color={accent} size={22} />
                      </View>
                      <View style={styles.classMain}>
                        <Text style={styles.classTitle} numberOfLines={1}>
                          {c.name}
                        </Text>
                        <Text style={styles.classMeta} numberOfLines={2}>
                          {c.subject} · {c.gradeLevel} · {c.studentCount} students
                        </Text>
                      </View>
                      <Pressable
                        style={styles.classQuick}
                        onPress={e => {
                          e.stopPropagation();
                          navigation.navigate('Attendance', { classId: c.id });
                        }}
                        accessibilityLabel="Open attendance"
                        hitSlop={10}
                      >
                        <IconCircleCheck color={iconMuted} size={22} />
                      </Pressable>
                      <IconChevronRight color={chevronMuted} size={20} />
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </View>
        </PulseScrollView>

        <BottomTab navigation={navigation} currentRoute="Home" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  root: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    flexGrow: 1,
    paddingBottom: 112,
  },
  page: {
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandGroove: {
    fontSize: 20,
    fontFamily: F.outfitBold,
    color: INK,
    letterSpacing: -0.4,
  },
  brandBox: {
    fontSize: 20,
    fontFamily: F.outfitBold,
    color: theme.brandLogoPurple,
    letterSpacing: -0.4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.white,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 16,
    fontFamily: F.dmBold,
    color: INK,
  },
  greetingDisplay: {
    fontSize: 40,
    lineHeight: 44,
    fontFamily: F.outfitBlack,
    color: INK,
    letterSpacing: -1,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
    marginBottom: 22,
  },
  surfaceCard: {
    backgroundColor: theme.white,
    borderRadius: R_CARD,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 22,
    paddingHorizontal: 8,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statV: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: ROW_DIVIDER,
    marginVertical: 4,
  },
  statNum: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: F.dmExtraBold,
    color: INK,
    letterSpacing: -0.6,
  },
  statLab: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    letterSpacing: 0.2,
  },
  sectionHeading: {
    marginTop: 30,
    marginBottom: 14,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: F.outfitExtraBold,
    color: INK,
    letterSpacing: -0.5,
  },
  actionsCard: {
    overflow: 'hidden',
    paddingVertical: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 76,
  },
  actionRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ROW_DIVIDER,
  },
  actionRowPressed: {
    backgroundColor: PRESS_TINT,
  },
  actionIconWell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ICON_WELL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionCopy: {
    flex: 1,
    minWidth: 0,
  },
  actionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: F.dmBold,
    color: INK,
    marginBottom: 3,
  },
  actionSub: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  classesHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 14,
  },
  sectionHeadingTight: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: F.outfitExtraBold,
    color: INK,
    letterSpacing: -0.5,
  },
  sectionMeta: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllText: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: F.outfitBold,
    color: theme.primary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  emptyIconWell: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ICON_WELL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: F.outfitExtraBold,
    color: INK,
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 16,
    lineHeight: 23,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    textAlign: 'center',
    marginBottom: 22,
  },
  primaryBtn: {
    alignSelf: 'stretch',
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnLabel: {
    fontSize: 17,
    fontFamily: F.outfitBold,
    color: theme.white,
  },
  classListCard: {
    overflow: 'hidden',
    paddingVertical: 0,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 76,
  },
  classRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ROW_DIVIDER,
  },
  classRowPressed: {
    backgroundColor: PRESS_TINT,
  },
  classIconWell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  classMain: {
    flex: 1,
    minWidth: 0,
  },
  classTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: F.dmBold,
    color: INK,
    marginBottom: 3,
  },
  classMeta: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  classQuick: {
    padding: 8,
    marginRight: 4,
  },
  bottomSpacer: {
    height: 8,
  },
});

export default Home;
