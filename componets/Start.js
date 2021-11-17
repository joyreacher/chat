import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, Button } from 'react-native';
// background image
const image = require('../assets/project_assets/bg.png')
class Start extends Component {
  constructor(props){
    super(props)
    this.state = {
      name:''
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode='cover'
        style={styles.image}
      >
        <Text>hello</Text>
          <TextInput 
            style={styles.input}
            onChangeText={(text) => this.setState({name: text})}
          />
          <Button 
            title='Go to chat'
            onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name})}
          />
      </ImageBackground>
      </View>
    );
  }
}

export default Start;

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  input:{
    backgroundColor:'red',
    width:300,
    height:50
  },
  image: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  }
});
