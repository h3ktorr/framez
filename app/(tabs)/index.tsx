// app/(tabs)/feed.tsx
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../supabase/config';

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            image_url,
            content,
            created_at,
            profiles!inner(username, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // 🔁 Real-time listener
    const subscription = supabase
      .channel('realtime:posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => fetchPosts()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.post}>
          <View style={styles.userRow}>
            <Image
              source={{ uri: item.profiles?.avatar_url || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.profiles?.username || 'User'}</Text>
          </View>

          {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}
          {item.content && <Text style={styles.caption}>{item.content}</Text>}

          {/* Timestamp */}
          {item.created_at && (
            <Text style={styles.timestamp}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          )}
        </View>
      )}
      contentContainerStyle={{ padding: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  post: { marginBottom: 20, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: '600', fontSize: 16 },
  image: { width: '100%', height: 300, backgroundColor: '#f0f0f0' },
  caption: { padding: 10, fontSize: 14, color: '#333' },
  timestamp: { fontSize: 12, color: '#888', paddingHorizontal: 10, paddingBottom: 5 },
});
