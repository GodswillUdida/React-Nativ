import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className=" flex-1 flex-wrap flex-row justify-center items-center bg-green-600">
        <Text>Home</Text>
        <Text>Home</Text>
        <Text>
          {[...Array()].map((_, i) => (
            <Text key={i}>Home</Text>
          ))}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Home