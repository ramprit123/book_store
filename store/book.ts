import { supabase } from '~/utils/supabase';
import { decode } from 'base64-arraybuffer';
import { create } from 'zustand';

interface BookState {
  books: {
    data: Book[];
    count: number;
  };
  currentBook: Book | null;
  loading: boolean;
  error: string | null;
  setBooks: (books: Book[], count: number) => void;
  setCurrentBook: (book: Book | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookStore = create<BookState>(set => ({
  books: {
    data: [],
    count: 0,
  },
  currentBook: null,
  loading: false,
  error: null,
  setBooks: (books: Book[], count: number) => set({ books: { data: books, count } }),
  setCurrentBook: book => set({ currentBook: book }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));

// Define the Book interface
interface Book {
  id: string;
  title: string;
  caption?: string;
  image?: string;
  user_id: string;
  rating: number;
  description?: string;
  price: number;
  stock: number;
  created: string;
  updated: string;
}

// CRUD Operations
export class BookStore {
  private readonly BUCKET_NAME = 'books';

  private async uploadImage(base64Image: string): Promise<string | null> {
    try {
      const fileName = `book-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const fileExt = 'jpg';
      const filePath = `${fileName}.${fileExt}`;
      const contentType = 'image/jpeg';

      // Remove data URL prefix if present
      const base64Data = base64Image.includes('base64,')
        ? base64Image.split('base64,')[1]
        : base64Image;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, decode(base64Data), {
          contentType,
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  private async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return false;

      const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([fileName]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  async createBookWithImage(bookData: {
    title: string;
    caption?: string;
    image?: string;
    author: string;
    rating: number;
    description?: string;
    price: number;
    stock: number;
  }): Promise<Book | null> {
    try {
      let imageUrl = null;
      if (bookData.image) {
        imageUrl = await this.uploadImage(bookData.image);
      }

      const { image: base64Image, ...bookInfo } = bookData;
      const book = {
        ...bookInfo,
        image: imageUrl,
      };

      const { data, error } = await supabase.from('books').insert(book).select().single();

      if (error) {
        console.error('Error creating book:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating book with image:', error);
      return null;
    }
  }

  async updateBookWithImage(
    id: string,
    updates: Partial<Book> & { base64Image?: string }
  ): Promise<Book | null> {
    try {
      const currentBook = await this.getBook(id);
      if (!currentBook) return null;

      let imageUrl = currentBook.image;

      if (updates.base64Image) {
        // Delete old image if exists
        if (currentBook.image) {
          await this.deleteImage(currentBook.image);
        }
        // Upload new image
        imageUrl = (await this.uploadImage(updates.base64Image)) || undefined;
      }

      const { base64Image, ...bookUpdates } = updates;
      return await this.updateBook(id, {
        ...bookUpdates,
        image: imageUrl,
      });
    } catch (error) {
      console.error('Error updating book with image:', error);
      return null;
    }
  }

  // Override the original deleteBook to handle image deletion
  // Delete a book and its associated image
  async deleteBookAndImage(id: string): Promise<boolean> {
    try {
      const book = await this.getBook(id);
      if (!book) return false;

      if (book.image) {
        await this.deleteImage(book.image);
      }

      const { error } = await supabase.from('books').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  }

  // Read a single book by ID
  async getBook(id: string): Promise<Book | null> {
    const { data, error } = await supabase.from('books').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching book:', error);
      return null;
    }

    return data;
  }

  // Get books with pagination
  async getBooksWithPagination(
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'created',
    ascending: boolean = false,
    searchQuery?: string
  ): Promise<{ data: Book[]; count: number }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase.from('books').select(
        `*,
    user:user_id (id, email)`,
        { count: 'exact' }
      );

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error, count } = await query.order(orderBy, { ascending }).range(from, to);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
      };
    } catch (error) {
      console.error('Error fetching books with pagination:', error);
      return { data: [], count: 0 };
    }
  }
  // Read all books
  async getAllBooks() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
      return [];
    }

    return data || [];
  }

  // Update a book
  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating book:', error);
      return null;
    }

    return data;
  }

  // Delete a book
  async deleteBook(id: string): Promise<boolean> {
    const { error } = await supabase.from('books').delete().eq('id', id);

    if (error) {
      console.error('Error deleting book:', error);
      return false;
    }

    return true;
  }

  // Search books by title
  async searchBooks(query: string): Promise<Book[]> {
    const { data, error } = await supabase.from('books').select('*').ilike('title', `%${query}%`);

    if (error) {
      console.error('Error searching books:', error);
      return [];
    }

    return data || [];
  }

  // Get books by author
  async getBooksByAuthor(authorId: string): Promise<Book[]> {
    const { data, error } = await supabase.from('books').select('*').eq('author', authorId);

    if (error) {
      console.error('Error fetching books by author:', error);
      return [];
    }

    return data || [];
  }
}
