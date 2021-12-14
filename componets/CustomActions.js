import React, { useEffect } from "react"
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native'
function CustomActions() {
  const onActionPress = () =>{
    console.log('pressssss')
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