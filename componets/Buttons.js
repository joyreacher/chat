import React, { useEffect } from "react"
import { StyleSheet, Platform, View, Pressable, KeyboardAvoidingView, Text, Image } from 'react-native'
function Buttons({deleteMessages, pickImage, getLocation}) {
  return (
    <>
      {/* FOR TESTING PURPOSES ONLY */}
      <View style={buttons.container}>
          {/* DELETE ASYNC STORAGE */}
          <View
            style={[buttons.btnContainer, { backgroundColor: 'white' }]}
          >
            <Pressable
              onPress={() => deleteMessages()}
              style={{}}
            >
              <Text>Delete storage</Text>
            </Pressable>
          </View>
          {/* PICK IMAGE */}
          <View
            style={[buttons.btnContainer, { backgroundColor: 'white' }]}
          >
            <Pressable
              onPress={pickImage}
            >
              <Text>Pick image</Text>
            </Pressable>
          </View>
          {/* TAKE PHOTO */}
          <View
            style={[buttons.btnContainer, { backgroundColor: 'white' }]}
          >
            <Pressable
              onPress={() => takePhoto()}
            >
              <Text>Take photo</Text>
            </Pressable>
          </View>
          {/* GET LOCATION */}
          <View
            style={[buttons.btnContainer, { backgroundColor: 'white' }]}
          >
            <Pressable
              onPress={() => this.getLocation()}
            >
              <Text>Get location</Text>
            </Pressable>
          </View>
        </View>
    </>
  )
}

export default Buttons

const buttons = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    marginTop: 30
  },
  btnContainer:{
    height: 60,
    width: '34%',
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
})
