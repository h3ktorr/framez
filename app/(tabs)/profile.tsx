// app/(tabs)/profile.tsx
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSupabase } from '../../context/SupabaseProvider';
import { supabase } from '../../supabase/config';

export default function ProfileScreen() {
  const { user } = useSupabase();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfileAndPosts = async () => {
      try {
        const [{ data: profileData, error: profileError }, { data: postData, error: postError }] =
          await Promise.all([
            supabase
              .from('profiles')
              .select('id, username, avatar_url, email')
              .eq('id', user.id)
              .single(),
            supabase
              .from('posts')
              .select(`
                id,
                image_url,
                content,
                created_at,
                profiles!inner(username, avatar_url)
              `)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false }),
          ]);

        if (profileError) throw profileError;
        if (postError) throw postError;

        setProfile(profileData);
        setPosts(postData || []);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();

    const subscription = supabase
      .channel(`realtime:posts:user:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts', filter: `user_id=eq.${user.id}` },
        () => fetchProfileAndPosts()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const handleUploadAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;
      setUploading(true);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filePath = `${user!.id}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user!.id);

      if (updateError) throw updateError;

      setProfile((prev: any) => ({ ...prev, avatar_url: avatarUrl }));
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <Text style={styles.info}>You’re not logged in.</Text>;
  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handleUploadAvatar} disabled={uploading}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/100' }}
            style={[styles.avatar, uploading && { opacity: 0.5 }]}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{profile?.username || 'Anonymous'}</Text>
      <Text style={styles.email}>{profile?.email}</Text>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutButton}>Log out</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.userRow}>
              <Image
                source={{ uri: item.profiles?.avatar_url || 'https://via.placeholder.com/40' }}
                style={styles.postAvatar}
              />
              <Text style={styles.username}>{item.profiles?.username || 'User'}</Text>
            </View>

            {item.image_url && <Image source={{ uri: item.image_url }} style={styles.postImage} />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  avatarSection: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: '700', marginTop: 10, textAlign: 'center' },
  email: { color: '#888', marginBottom: 20, textAlign: 'center' },
  logoutButton: { color: 'red', textAlign: 'center', marginBottom: 20, fontWeight: '600' },
  info: { textAlign: 'center', marginTop: 40 },

  post: { marginBottom: 20, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: '600', fontSize: 16 },
  postImage: { width: '100%', height: 300, backgroundColor: '#f0f0f0' },
  caption: { padding: 10, fontSize: 14, color: '#333' },
  timestamp: { fontSize: 12, color: '#888', paddingHorizontal: 10, paddingBottom: 5 },
});
