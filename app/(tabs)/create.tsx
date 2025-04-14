import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '~/components/Button';
import Input from '~/components/Input';
import { Rating } from '~/components/Rating';
import COLORS from '~/constants/colors';
import { BookStore } from '~/store/book';
import { useStore } from '~/store/store';

const Create = () => {
  const { user } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    rating: '0',
    caption: '',
  });

  const pickImage = async () => {
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      if (result.assets[0].base64) {
        setImage(result.assets[0].base64);
      } else if (result.assets[0].uri) {
        try {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImage(base64);
        } catch (error) {
          console.error('Error reading image file:', error);
          Alert.alert('Error', 'Failed to process the image');
        }
      }
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const bookStore = new BookStore();

      // Validate numeric inputs
      if (
        isNaN(parseFloat(form.price)) ||
        isNaN(parseInt(form.stock)) ||
        isNaN(parseFloat(form.rating))
      ) {
        throw new Error('Please enter valid numbers for price, stock, and rating');
      }

      // Validate rating range
      const rating = parseFloat(form.rating);
      if (rating < 0 || rating > 5) {
        throw new Error('Rating must be between 0 and 5');
      }

      if (!user) {
        throw new Error('User not available');
      }

      const result = await bookStore.createBookWithImage({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        rating: rating,
        image: image || undefined,
        author: user?.id,
      });

      if (result) {
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred while creating the book', [
        { text: 'OK' },
      ]);
      console.error('Error creating book:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView className="flex-1 p-4">
        <View className="bg-cardBackground p-4 rounded-lg">
          <View className="mb-4">
            <Text className="text-2xl font-bold text-textDark mb-2 font-Poppins-SemiBold">
              Add Book Recommendation
            </Text>
            <Text className="text-sm text-textLight">
              Share your favorite book with the community. Fill in the details below to create a new
              book recommendation.
            </Text>
          </View>

          <View className="gap-4">
            <TouchableOpacity
              onPress={pickImage}
              className="h-48 bg-cardBackground rounded-lg items-center justify-center"
            >
              {image ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${image}` }}
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="image-outline" size={48} color={COLORS.primary} />
                  <Text className="text-textDark mt-2">Add Book Cover</Text>
                </View>
              )}
            </TouchableOpacity>

            <Input
              placeholder="Book Title"
              label="Book Title"
              value={form.title}
              onChangeText={text => setForm({ ...form, title: text })}
            />

            <Input
              label="Author"
              placeholder="Author"
              value={form.author}
              onChangeText={text => setForm({ ...form, author: text })}
            />

            <Input
              label="Caption"
              placeholder="Caption (optional)"
              value={form.caption}
              onChangeText={text => setForm({ ...form, caption: text })}
            />

            <Input
              label="Description"
              placeholder="Description"
              value={form.description}
              onChangeText={text => setForm({ ...form, description: text })}
              multiline
              numberOfLines={4}
              className="h-24"
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Input
                  label="Price"
                  placeholder="Price"
                  value={form.price}
                  onChangeText={text => setForm({ ...form, price: text })}
                  keyboardType="decimal-pad"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Stock"
                  placeholder="Stock"
                  value={form.stock}
                  onChangeText={text => setForm({ ...form, stock: text })}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Replace the Rating Input with the new Rating component */}
            <View className="gap-2 ml-2">
              <Text className="text-textDark">Rating</Text>
              <Rating
                rating={Number(form.rating)}
                onRatingChange={newRating => setForm({ ...form, rating: newRating.toString() })}
              />
            </View>

            <Button
              title="Create Book"
              onPress={handleCreate}
              loading={loading}
              disabled={loading || !form.title || !form.author || !form.price || !form.stock}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
