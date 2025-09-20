import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Wallet = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 justify-center items-center bg-yellow-400'>

        <View className="w-24 h-24 bg-yellow-200 rounded-full mb-4" />

        <Text className='mb-3'>Godswill Udida</Text>

        <Button title='Pay Now' onPress={() => alert('Payment Successful!')} />

      </View>
    </SafeAreaView>
  );
}

export default Wallet