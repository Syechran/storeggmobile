import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, BackHandler, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { LayoutGrid, List, Search, ShoppingBag, Egg } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const coins = useSelector((state) => state.user.coins);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit Storegg',
          'Are you sure you want to close Storegg?',
          [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      const modifiedData = response.data.map(item => ({
        ...item,
        price: Math.round(item.price),
      }));
      setProducts(modifiedData);
      setFilteredProducts(modifiedData);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = products.filter(item => 
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, isGridView ? styles.cardGrid : styles.cardList]}
      onPress={() => navigation.navigate('Detail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={isGridView ? styles.imageGrid : styles.imageList} resizeMode="contain" />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.priceContainer}>
           <Text style={styles.price}>{item.price} Coins</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Storegg</Text>
          <Text style={styles.greeting}>Welcome back!</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.coinButton}
            onPress={() => navigation.navigate('LuckyEgg')}
          >
            <Egg size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.coinText}>{coins}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.myProdButton}
            onPress={() => navigation.navigate('MyProducts')}
          >
            <ShoppingBag size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#888" />
          <TextInput 
            placeholder="Search products..." 
            style={styles.input}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity onPress={() => setIsGridView(!isGridView)} style={styles.toggleBtn}>
          {isGridView ? <List size={24} color="#333" /> : <LayoutGrid size={24} color="#333" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F59E0B" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          key={isGridView ? 'GRID' : 'LIST'}
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={isGridView ? 2 : 1}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={isGridView ? styles.row : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  greeting: { fontSize: 14, color: '#666' },
  headerRight: { flexDirection: 'row', gap: 10 },
  coinButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
  coinText: { fontWeight: 'bold', color: '#B45309' },
  myProdButton: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 50 },
  searchContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', height: 45 },
  input: { flex: 1, marginLeft: 8 },
  toggleBtn: { justifyContent: 'center', alignItems: 'center', width: 45, height: 45, backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  listContainer: { paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  cardGrid: { width: '48%' }, 
  cardList: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  imageGrid: { width: '100%', height: 120, marginBottom: 8 },
  imageList: { width: 80, height: 80, marginRight: 12 },
  cardContent: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  category: { fontSize: 12, color: '#9CA3AF', marginBottom: 4, textTransform: 'capitalize' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#059669' },
});