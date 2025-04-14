import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import COLORS from '~/constants/colors';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange: (rating: number) => void;
}

export const Rating = ({
  rating,
  maxRating = 5,
  size = 24,
  onRatingChange,
}: RatingProps) => {
  return (
    <View className="flex-row gap-2">
      {[...Array(maxRating)].map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onRatingChange(index + 1)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={index < rating ? 'star' : 'star-outline'}
            size={size}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};