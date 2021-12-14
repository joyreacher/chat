import React, { useEffect } from "react"
import { ActionSheetIOS, StyleSheet, TouchableHighlight, Text, View } from 'react-native'
function CustomActions() {
  const onActionPress = () =>{
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel'
    ]
    const cancelButtonIndex = options.length - 1
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch(buttonIndex){
          case 0:
            console.log('pick image')
            return
          case 1:
            console.log('take photo')
            return
          case 2:
            console.log('get location')
            return 
          default:
        }
      }
    )
  }
  return (
    <>
      <TouchableHighlight
        onPress={() => onActionPress()}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <Text style={styles.icon}>+</Text>
        </View>
      </TouchableHighlight>
    </>
  )
}

export default CustomActions

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
 });