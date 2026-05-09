import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { deductCoins, addToInventory } from '../store/userSlice';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function DetailScreen({ route, navigation }) {
  const product = route.params?.product;

  const dispatch = useDispatch();
  const { coins, inventory } = useSelector(state => state.user);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: Product Data Not Found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text>Go Back</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  const isOwned = inventory.some(item => item.id === product.id);
  const canBuy = coins >= product.price;

  const handleBuy = () => {
    if (isOwned) return;
    if (canBuy) {
      dispatch(deductCoins(product.price));
      dispatch(addToInventory(product));
      Alert.alert("Success", "You bought this item!");
      navigation.goBack();
    } else {
      Alert.alert("Failed", "Not enough coins! Play minigame to earn more.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <ArrowLeft color="#333" size={24} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <View style={styles.priceTag}>
             <Text style={styles.priceText}>{product.price} Coins</Text>
          </View>
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isOwned ? (
          <View style={[styles.buyBtn, styles.ownedBtn]}>
            <CheckCircle color="#FFF" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.buyText}>Already Owned</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.buyBtn, !canBuy && styles.disabledBtn]} 
            onPress={handleBuy}
            disabled={!canBuy}
          >
            <Text style={styles.buyText}>{canBuy ? 'Buy Now' : 'Not Enough Coins'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: '#F3F4F6', padding: 8, borderRadius: 50 },
  image: { width: '100%', height: 300, backgroundColor: '#FFF', marginTop: 20 },
  content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#F9FAFB', marginTop: -20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
  category: { fontSize: 14, color: '#9CA3AF', textTransform: 'capitalize', marginBottom: 15 },
  priceTag: { alignSelf: 'flex-start', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 20 },
  priceText: { color: '#B45309', fontWeight: 'bold', fontSize: 16 },
  descTitle: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  description: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#F3F4F6' },
  buyBtn: { backgroundColor: '#F59E0B', padding: 15, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buyText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  disabledBtn: { backgroundColor: '#D1D5DB' },
  ownedBtn: { backgroundColor: '#10B981' }
});