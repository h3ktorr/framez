// app/(tabs)/post.tsx
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSupabase } from '../../context/SupabaseProvider';
import { supabase } from '../../supabase/config';

export default function PostScreen() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useSupabase(); // get the logged-in user

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handlePost = async () => {
    if (!user) return Alert.alert('Error', 'You must be logged in to post.');
    if (!content && !image) return Alert.alert('Error', 'Post cannot be empty.');

    try {
      setLoading(true);
      const { error } = await supabase.from('posts').insert([
        {
          user_id: user.id,   // ⚡ link to the profile
          content: content,
          image_url: image,
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Post created!');
      setContent('');
      setImage(null);
    } catch (err: any) {
      console.error('Error creating post:', err);
      Alert.alert('Error creating post', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="What's on your mind?"
        style={styles.input}
        multiline
      />

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Add Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.postButton, loading && { opacity: 0.7 }]} onPress={handlePost} disabled={loading}>
        <Text style={styles.postButtonText}>{loading ? 'Posting...' : 'Post'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  preview: { width: '100%', height: 200, borderRadius: 8, marginVertical: 10 },
  imageButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  imageButtonText: { textAlign: 'center', color: '#333' },
  postButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  postButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
