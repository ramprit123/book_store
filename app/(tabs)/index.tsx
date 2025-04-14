import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import Image from '~/components/Image';
import { BookStore, useBookStore } from '~/store/book';
import { supabase } from '~/utils/supabase';

const Home = () => {
  const { books, loading, error, setBooks } = useBookStore();
  console.log(JSON.stringify(books, null, 2));
  const bookStore = new BookStore();
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await bookStore.getBooksWithPagination();
        setBooks(books.data, books.count); // Update the state with the fetched books
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <View className="flex-1 bg-background">
      {loading && <Text>Loading...</Text>}
      <FlatList
        data={books.data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="bg-cardBackground p-4 rounded-lg mb-4">
            <Image
              height={100}
              width={100}
              source={{
                uri: item.image,
              }}
            />
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Home;
