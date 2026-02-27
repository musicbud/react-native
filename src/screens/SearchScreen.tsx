import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchContentQuery } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Assuming useSearchContentQuery takes the search text as an argument
  const { data: searchResults, error: searchError, isLoading: isSearchLoading } = useSearchContentQuery(searchText, {
    skip: !searchText, // Skip query if search text is empty
  });

  const categories = ['All', 'Artists', 'Tracks', 'Albums', 'Playlists'];

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setActiveCategory(item)}
    >
      <LinearGradient
        colors={activeCategory === item ? ['#1E90FF', '#007AFF'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.categoryButton}
      >
        <Text style={[styles.categoryButtonText, activeCategory === item && styles.activeCategoryButtonText]}>
          {item}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSearchResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '/DetailsScreen', params: { id: item.id, type: item.type || 'track' } })}>
      <LinearGradient
        colors={['rgba(30,30,30,0.8)', 'rgba(20,20,20,0.8)']}
        style={styles.searchResultItem}
      >
        <Image source={{ uri: item.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.searchResultImage} />
        <View style={styles.searchResultDetails}>
          <Text style={styles.searchResultTitle}>{item.title || item.name}</Text>
          <Text style={styles.searchResultSubtitle}>{item.artist || item.type}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['rgba(30,30,30,0.9)', '#121212']}
        style={styles.headerGradient}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to find?"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <ScrollView style={styles.resultsContainer}>
          {isSearchLoading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#1E90FF" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {searchError && (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>Failed to fetch search results.</Text>
            </View>
          )}

          {!searchText && (
            <View style={styles.centerContainer}>
              <Text style={styles.emptySearchText}>Start typing to find artists, tracks, albums, and more!</Text>
            </View>
          )}

          {searchResults?.data?.length === 0 && searchText && !isSearchLoading && (
            <View style={styles.centerContainer}>
              <Text style={styles.emptySearchText}>No results found for &quot;{searchText}&quot;</Text>
            </View>
          )}

          {searchResults?.data?.length > 0 && (
            <FlatList
              data={searchResults.data}
              renderItem={renderSearchResultItem}
              keyExtractor={(item) => item.id + item.type}
              scrollEnabled={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerGradient: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 15,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  categoryButtonText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsList: {
    paddingBottom: 20,
  },
  centerContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  emptySearchText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  searchResultDetails: {
    flex: 1,
  },
  searchResultTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchResultSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default SearchScreen;