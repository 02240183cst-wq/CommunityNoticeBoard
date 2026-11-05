import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Polygon, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const peopleColors = ['#2563EB', '#16A34A', '#F59E0B', '#7C3AED', '#DC2626', '#0D9488'];

function Community({ dark }) {
  const people = [];
  for (let i = 0; i < 18; i++) {
    const x = 12 + i * 22;
    const c = peopleColors[i % peopleColors.length];
    people.push(
      <React.Fragment key={i}>
        <Circle cx={x} cy={206} r={5} fill={c} />
        <Rect x={x - 5} y={212} width={10} height={16} rx={4} fill={c} />
      </React.Fragment>
    );
  }

  return (
    <Svg width={width} height={width * 0.62} viewBox="0 0 400 248" preserveAspectRatio="xMidYMax meet">
      {/* hills */}
      <Path d="M0 185 Q100 135 200 170 T400 160 L400 248 L0 248 Z" fill={dark ? '#1F3A2E' : '#CFE8D5'} />
      <Path d="M0 205 Q120 172 240 200 T400 190 L400 248 L0 248 Z" fill={dark ? '#2B5240' : '#8FC09A'} />

      {/* trees */}
      <Rect x={44} y={158} width={7} height={36} fill="#6B4F3A" />
      <Circle cx={47} cy={148} r={26} fill="#5E9C6C" />
      <Circle cx={62} cy={160} r={16} fill="#78B386" />
      <Rect x={366} y={160} width={7} height={34} fill="#6B4F3A" />
      <Circle cx={369} cy={150} r={24} fill="#5E9C6C" />
      <Circle cx={355} cy={162} r={15} fill="#78B386" />

      {/* house 1 */}
      <Rect x={72} y={152} width={58} height={48} fill="#E0F2FE" />
      <Polygon points="64,154 101,122 138,154" fill="#3B82F6" />
      <Rect x={80} y={162} width={13} height={13} fill="#93C5FD" />
      <Rect x={108} y={162} width={13} height={13} fill="#93C5FD" />
      <Rect x={94} y={180} width={14} height={20} fill="#1E40AF" />

      {/* clock tower */}
      <Rect x={176} y={102} width={48} height={98} fill="#CBD5E1" />
      <Polygon points="170,104 200,70 230,104" fill="#1E3A8A" />
      <Rect x={198} y={56} width={2} height={16} fill="#1E3A8A" />
      <Polygon points="200,56 214,61 200,66" fill="#EF4444" />
      <Circle cx={200} cy={124} r={11} fill="#FFFFFF" />
      <Line x1={200} y1={124} x2={200} y2={116} stroke="#1E293B" strokeWidth={2} />
      <Line x1={200} y1={124} x2={206} y2={127} stroke="#1E293B" strokeWidth={2} />
      <Rect x={186} y={146} width={8} height={12} fill="#64748B" />
      <Rect x={206} y={146} width={8} height={12} fill="#64748B" />
      <Rect x={190} y={174} width={20} height={26} fill="#334155" />

      {/* house 2 */}
      <Rect x={244} y={158} width={56} height={42} fill="#FEF3C7" />
      <Polygon points="236,160 272,130 308,160" fill="#F97316" />
      <Rect x={252} y={168} width={12} height={12} fill="#FCD34D" />
      <Rect x={278} y={168} width={12} height={12} fill="#FCD34D" />
      <Rect x={266} y={182} width={12} height={18} fill="#9A3412" />

      {/* house 3 */}
      <Rect x={310} y={168} width={44} height={32} fill="#DCFCE7" />
      <Polygon points="303,170 332,146 361,170" fill="#16A34A" />
      <Rect x={318} y={176} width={10} height={10} fill="#86EFAC" />
      <Rect x={336} y={180} width={10} height={20} fill="#166534" />

      {/* people holding hands */}
      <Line x1={10} y1={218} x2={392} y2={218} stroke={dark ? '#94A3B8' : '#64748B'} strokeWidth={2} />
      {people}
    </Svg>
  );
}

export default function SplashScreen() {
  const { colors, isDark } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={isDark ? ['#0F172A', '#1E293B'] : ['#DBEAFE', '#F8FAFF', '#FFFFFF']}
      style={styles.container}
    >
      <Animated.View style={[styles.center, { opacity: fade, transform: [{ scale }] }]}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Ionicons name="pin" size={52} color="#fff" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Community{'\n'}Notice Board</Text>
        <Text style={[styles.sub, { color: colors.subText }]}>Connect. Share. Stay Informed.</Text>
      </Animated.View>

      <View style={styles.bottom}>
        <Community dark={isDark} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 120 },
  logo: {
    width: 104, height: 104, borderRadius: 30, alignItems: 'center', justifyContent: 'center',
    marginBottom: 26, shadowColor: '#2563EB', shadowOpacity: 0.35,
    shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 10,
  },
  title: { fontSize: 34, fontWeight: '800', textAlign: 'center', lineHeight: 42 },
  sub: { fontSize: 16, marginTop: 10 },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});