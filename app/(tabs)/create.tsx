import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';
import Input from '~/components/Input';
import COLORS from '~/constants/colors';
import { BookStore } from '~/store/book';
import { useStore } from '~/store/store';

const Create = () => {
      const { user } = useStore()

      console.log(JSON.stringify(user, null, 4))
      const router = useRouter();
      const [loading, setLoading] = useState(false);
      const [image, setImage] = useState<string | null>(null);
      console.log("image", image)
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
            const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.5,
                  base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                  setImage(result.assets[0].base64);
            }
      };

      const handleCreate = async () => {
            try {
                  setLoading(true);
                  const bookStore = new BookStore();

                  // Validate numeric inputs
                  if (isNaN(parseFloat(form.price)) || isNaN(parseInt(form.stock)) || isNaN(parseFloat(form.rating))) {
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
                        author: user?.id
                  });

                  if (result) {
                        router.back();
                  }
            } catch (error: any) {
                  console.error('Error creating book:', error.message);
                  // You might want to show an error message to the user here
            } finally {
                  setLoading(false);
            }
      };

      return (
            <SafeAreaView className="flex-1 bg-background">
                  <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1"
                  >
                        <ScrollView className="flex-1 p-4">
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
                                          value={form.title}
                                          onChangeText={(text) => setForm({ ...form, title: text })}
                                    />

                                    <Input
                                          placeholder="Author"
                                          value={form.author}
                                          onChangeText={(text) => setForm({ ...form, author: text })}
                                    />

                                    <Input
                                          placeholder="Caption (optional)"
                                          value={form.caption}
                                          onChangeText={(text) => setForm({ ...form, caption: text })}
                                    />

                                    <Input
                                          placeholder="Description"
                                          value={form.description}
                                          onChangeText={(text) => setForm({ ...form, description: text })}
                                          multiline
                                          numberOfLines={4}
                                          className="h-24"
                                    />

                                    <View className="flex-row gap-4">
                                          <View className="flex-1">
                                                <Input
                                                      placeholder="Price"
                                                      value={form.price}
                                                      onChangeText={(text) => setForm({ ...form, price: text })}
                                                      keyboardType="decimal-pad"
                                                />
                                          </View>
                                          <View className="flex-1">
                                                <Input
                                                      placeholder="Stock"
                                                      value={form.stock}
                                                      onChangeText={(text) => setForm({ ...form, stock: text })}
                                                      keyboardType="number-pad"
                                                />
                                          </View>
                                    </View>

                                    <Input
                                          placeholder="Rating (0-5)"
                                          value={form.rating}
                                          onChangeText={(text) => setForm({ ...form, rating: text })}
                                          keyboardType="decimal-pad"
                                    />

                                    <Button
                                          title="Create Book"
                                          onPress={handleCreate}
                                          loading={loading}
                                          disabled={loading || !form.title || !form.author || !form.price || !form.stock}
                                    />
                              </View>
                        </ScrollView>
                  </KeyboardAvoidingView>
            </SafeAreaView>
      );
};

export default Create;