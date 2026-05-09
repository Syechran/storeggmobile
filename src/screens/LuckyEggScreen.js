import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { addCoins } from '../store/userSlice';
import { Egg, CheckCircle, ArrowLeft } from 'lucide-react-native'; 

export default function LuckyEggScreen({ navigation }) {
  const dispatch = useDispatch();
  const [isCracked, setIsCracked] = useState(false);
  const [reward, setReward] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current; 
  const splitAnim = useRef(new Animated.Value(0)).current; 
  const opacityAnim = useRef(new Animated.Value(1)).current; 

  const handleCrackEgg = () => {
    if (isCracked) {
      setIsCracked(false);
      setReward(0);
      splitAnim.setValue(0);
      opacityAnim.setValue(1);
      shakeAnim.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(splitAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        })
      ]).start(() => {
        const randomCoins = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        setReward(randomCoins);
        setIsCracked(true);
        dispatch(addCoins(randomCoins));
      });
    });
  };

  const translateYTop = splitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  const translateYBottom = splitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <ArrowLeft color="#333" size={24} />
      </TouchableOpacity>

      <Text style={styles.title}>Lucky Egg 🥚</Text>
      <Text style={styles.subtitle}>Tap the egg to get free coins!</Text>

      <View style={styles.gameArea}>
        <TouchableOpacity 
          activeOpacity={1}
          onPress={handleCrackEgg}
          style={styles.eggContainer}
          disabled={isCracked}
        >
          {!isCracked ? (
            <Animated.View style={{ 
              opacity: opacityAnim,
              transform: [{ translateX: shakeAnim }] 
            }}>
              <Animated.View style={[styles.halfEgg, { transform: [{ translateY: translateYTop }] }]}>
                <View style={styles.eggClipTop}>
                  <Egg size={200} color="#F59E0B" fill="#FEF3C7" />
                </View>
              </Animated.View>

              <Animated.View style={[styles.halfEgg, { transform: [{ translateY: translateYBottom }] }]}>
                <View style={styles.eggClipBottom}>
                  <Egg size={200} color="#F59E0B" fill="#FEF3C7" />
                </View>
              </Animated.View>
            </Animated.View>
          ) : (
             <Animated.View style={styles.rewardContainer}>
                <CheckCircle size={120} color="#10B981" />
                <Text style={styles.rewardText}>+{reward} Coins</Text>
                <TouchableOpacity onPress={handleCrackEgg} style={styles.resetBtn}>
                   <Text style={styles.resetText}>Tap to play again</Text>
                </TouchableOpacity>
             </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', padding: 20 },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: '#F3F4F6', padding: 8, borderRadius: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#B45309', marginBottom: 10, marginTop: 40 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 50 },
  gameArea: { height: 400, justifyContent: 'center', alignItems: 'center', width: '100%' },
  eggContainer: { alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
  halfEgg: {
    height: 100,
    width: 200,
    overflow: 'hidden',
  },
  eggClipTop: {
    height: 200,
    width: 200,
  },
  eggClipBottom: {
    height: 200,
    width: 200,
    marginTop: -100,
  },
  rewardContainer: { alignItems: 'center' },
  rewardText: { fontSize: 32, fontWeight: 'bold', color: '#10B981', marginTop: 20 },
  resetBtn: { marginTop: 20, padding: 10 },
  resetText: { color: '#9CA3AF', fontSize: 16 },
});
