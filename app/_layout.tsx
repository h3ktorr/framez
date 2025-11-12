import { Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { SupabaseProvider, useSupabase } from '../context/SupabaseProvider';

function RootNavigation() {
  const { session, loading } = useSupabase();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading Framez...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <RootNavigation />
    </SupabaseProvider>
  );
}
