import React, { Component } from 'react';

// react native specific components
import { StyleSheet, Text, View, Pressable } from 'react-native';

// Gifted chat
import { GiftedChat } from 'react-native-gifted-chat'

/* 
  Application chat screen: Displays the selected background color along with the users name
  entered on the Start.js screen
*/
class Chat extends Component {
  constructor(props){
    super()
    this.state = {
      messages: []
    }
  }
  /* 
    componentDidMount does 2 things:
      1) Adds what the user types in the textbox to the top of the chat screen
      2) Set the name variable with the same textbox value to use in render()
      !IMPORTANT setOptions needs to be in component did mount to avoid console errors
  */
  componentDidMount() {
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name })
  }
  render() {
    // store the prop values that are passed
    let { name, color } = this.props.route.params
    return (
      <View style={[{backgroundColor: color}, styles.container]}>
        {/* App Title */}
        <View style={styles.main}>
          <Text style={styles.title}>CHAT</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.responseContainer}>
            {/* Main Text */}
            <Text style={styles.text}>
              Hello <Text style={styles.data}>{name}</Text>,
              You Chose <Text style={styles.data}>{color}</Text> as your background.
            </Text>
          </View>
          {/* Go Back Button */}
          <View style={styles.main}>
            <Pressable
              style={styles.button}
              title='Go back'
              /**
                Calls on the navigation's navigate prop to navigates you back to 'Start'
               */
              onPress={() => this.props.navigation.navigate('Start')}
            >
            <Text style={styles.buttonText}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  responseContainer:{
    padding:5
  },
  main:{
    height: 100,
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  data:{
    color: '#FFFFFF'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#757083',
    fontSize: 16
  },
  title: {
    color:'#FFFFFF',
    fontSize: 45,
    fontWeight: '600'
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
