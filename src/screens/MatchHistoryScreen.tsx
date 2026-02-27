import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetMatchHistoryQuery } from '../store/api';

const { width, height } = Dimensions.get('window');

const MatchHistoryScreen = () => {
  const router = useRouter();
  const { data: matchHistoryData, error: matchHistoryError, isLoading: isMatchHistoryLoading } = useGetMatchHistoryQuery({});

  if (isMatchHistoryLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Match History...</Text>
      </View>
    );
  }

  if (matchHistoryError) {
    console.error("Match History Error:", matchHistoryError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load Match History.</Text>
        <Text style={styles.errorText}>Please check your backend server.</Text>
      </View>
    );
  }

  const matchCards = matchHistoryData?.data?.matches || [];

  const renderMatchCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.matchCard} onPress={() => router.push(`/BudProfile/${item.id}`)}>
      <Image source={{ uri: item.avatar_url || item.avatar || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.matchCardImage} />
      <Text style={styles.matchCardName} numberOfLines={1}>{item.display_name || item.name || item.username}</Text>
      <Text style={styles.matchCardCommon} numberOfLines={1}>{item.compatibility_score ? `${item.compatibility_score}% Match` : 'New Match'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/extra/Match History.png') */ }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.screenTitle}>Match Recommendations</Text>

        <FlatList
          data={matchCards}
          renderItem={renderMatchCard}
          keyExtractor={(item, index) => item.id || index.toString()}
          numColumns={2}
          contentContainerStyle={styles.matchGrid}
          columnWrapperStyle={matchCards.length > 0 ? styles.matchGridColumnWrapper : undefined}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#888', fontSize: 16 }}>No matches found yet.</Text>
              <Text style={{ color: '#666', fontSize: 14, marginTop: 10 }}>Start swiping to find your Buds!</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullBackgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  screenTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  matchGrid: {
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  matchGridColumnWrapper: {
    justifyContent: 'space-around',
  },
  matchCard: {
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 10,
    width: width * 0.4,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  matchCardImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  matchCardName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  matchCardCommon: {
    color: '#CCC',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MatchHistoryScreen;