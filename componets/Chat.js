import React, { Component } from 'react';

// react native specific components
import { StyleSheet, Text, View, Pressable } from 'react-native';

/* 
  Application chat screen: Displays the selected background color along with the users name
  entered on the Start.js screen
*/
class Chat extends Component {
  constructor(props){
    super()
  }
  // Set the page title once Chat is loaded
  componentDidMount() {
    let { name } = this.props.route.params
    // Add the name to top of screen
    // ! setOptions needs to be in component did mount to avoid console errors
    this.props.navigation.setOptions({ title: name })
  }
  render() {
    // store the prop values that are passed
    let { name, color } = this.props.route.params
    // Add the name to top of screen
    return (
      <View style={[{backgroundColor: color}, styles.container]}>
        <View style={styles.main}>
          <Text style={styles.title}>CHAT</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.responseContainer}>
            <Text style={styles.text}>
              Hello <Text style={styles.data}>{name}</Text>,
              You Chose <Text style={styles.data}>{color}</Text> as your background.
            </Text>
          </View>
          
          <View style={styles.main}>
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
