import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';

export default function MyProductsScreen({ navigation }) {
  const inventory = useSelector((state) => state.user.inventory);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.ownedTag}>
          <Text style={styles.ownedText}>Owned</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Inventory</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {inventory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color="#D1D5DB" />
          <Text style={styles.emptyText}>You haven't bought anything yet.</Text>
          <TouchableOpacity 
            style={styles.shopBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.shopBtnText}>Go Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={inventory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  backBtn: { padding: 5 },
  
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  image: { width: 70, height: 70, marginRight: 12 },
  cardContent: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  category: { fontSize: 12, color: '#9CA3AF', textTransform: 'capitalize', marginBottom: 8 },
  ownedTag: { alignSelf: 'flex-start', backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  ownedText: { fontSize: 10, fontWeight: 'bold', color: '#059669' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -50 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  shopBtn: { marginTop: 20, backgroundColor: '#F59E0B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  shopBtnText: { color: '#FFF', fontWeight: 'bold' }
});