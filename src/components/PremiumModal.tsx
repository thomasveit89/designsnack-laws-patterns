import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePurchase } from '@/src/store/usePurchase';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PremiumModal({ visible, onClose }: PremiumModalProps) {
  const insets = useSafeAreaInsets();
  const { purchasePremium, restorePurchases, isLoading } = usePurchase();

  const handlePurchase = async () => {
    const success = await purchasePremium();
    if (success) {
      onClose();
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-900">Unlock Full Access</Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center"
            activeOpacity={0.8}
          >
            <IconSymbol name="xmark" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="p-6">
            <View className="bg-blue-50 rounded-3xl p-8 mb-8 items-center">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                <IconSymbol name="lock.open.fill" size={40} color="#3B82F6" />
              </View>
              <Text className="text-4xl font-bold text-gray-900 mb-2">$2.99</Text>
              <Text className="text-base text-gray-600 text-center">One-time purchase</Text>
            </View>

            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                What you'll get:
              </Text>

              <View className="space-y-4">
                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
                    <IconSymbol name="checkmark" size={14} color="#FFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 mb-1">
                      72 Additional Principles
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Access all 102 UX laws, patterns, and cognitive biases
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
                    <IconSymbol name="checkmark" size={14} color="#FFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 mb-1">
                      Complete Quiz Library
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Practice with questions from all principles
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
                    <IconSymbol name="checkmark" size={14} color="#FFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 mb-1">
                      All Future Updates
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Get new principles and features as they're added
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
                    <IconSymbol name="checkmark" size={14} color="#FFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 mb-1">
                      No Subscription
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Pay once, own it forever
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <Text className="text-sm text-gray-600 text-center">
                30 principles are free forever. Unlock the remaining 72 to become a UX expert.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="p-6 border-t border-gray-100" style={{ paddingBottom: insets.bottom + 24 }}>
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View className={`bg-blue-500 rounded-2xl py-4 items-center ${isLoading ? 'opacity-50' : ''}`}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text className="text-white text-lg font-semibold">Unlock Full Access</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRestore}
            disabled={isLoading}
            className="mt-3"
            activeOpacity={0.8}
          >
            <Text className="text-blue-500 text-center text-base font-medium">
              Restore Previous Purchase
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
