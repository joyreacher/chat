import React, { Component } from 'react';

// react native specific components
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
class Chat extends Component {
  constructor(props){
    super()
  }
  render() {
    // name holds the name value from the route prop/hook
    let { name, color } = this.props.route.params
    // Add the name to top of screen
    this.props.navigation.setOptions({ title: name})
    return (
      <View style={[{backgroundColor: color}, styles.container]}>
        <Text
          style={styles.text}
        >CHAT</Text>
        {/* using the 'name' container */}
        <Text
          style={styles.text}
        >
          Hello {name},
          You Chose {color} as your background.
        </Text>
        <Pressable
          style={styles.button}
          title='Go back'
          // calls on the navigation's navigate prop.
          // Navigates you to 'Start'
          onPress={() => this.props.navigation.navigate('Start')}
        >
        <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'rgb(255, 255, 255)'
  },
  button:{
    width: 100,
    height: 50,
    backgroundColor:'#757082'
  },
  buttonText:{
    paddingTop:15,
    textAlign:'center',
    color: 'rgb(255, 255, 255)'
  }
});
