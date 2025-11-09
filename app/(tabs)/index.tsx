import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

type Post = {
  id: string;
  author: string;
  content: string;
  image?: string;
  timestamp: string;
  avatar?: string;
};

export default function FeedScreen() {
  const posts: Post[] = [
    {
      id: '1',
      author: 'Alice Johnson',
      content: 'Enjoying this sunny day at the park! ☀️🌳',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      timestamp: '2h ago',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      author: 'Bob Smith',
      content: 'Just finished a new React Native tutorial! 🚀',
      timestamp: '4h ago',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      author: 'Chloe Kim',
      content: 'Coffee + code = happiness ☕💻',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
      timestamp: 'Yesterday',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Framez Feed</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.authorRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.author}>{item.author}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>

            <Text style={styles.content}>{item.content}</Text>

            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  postCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  author: { fontWeight: '600', fontSize: 16 },
  timestamp: { fontSize: 12, color: '#666' },
  content: { fontSize: 15, marginBottom: 8 },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginTop: 6 },
});
