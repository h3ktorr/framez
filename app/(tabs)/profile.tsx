import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

type Post = {
  id: string;
  content: string;
  image?: string;
  timestamp: string;
};

export default function ProfileScreen() {
  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  };

  const myPosts: Post[] = [
    {
      id: '1',
      content: 'Sunset views never get old 🌅',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      timestamp: '3 days ago',
    },
    {
      id: '2',
      content: 'Excited to share my new project soon! 🚧',
      timestamp: '1 week ago',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>My Posts</Text>

      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            <Text style={styles.content}>{item.content}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileHeader: { alignItems: 'center', marginTop: 20, marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 16, marginBottom: 8 },
  postCard: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 12,
  },
  timestamp: { fontSize: 12, color: '#666', marginBottom: 4 },
  content: { fontSize: 15 },
  postImage: { width: '100%', height: 180, borderRadius: 8, marginTop: 8 },
});
