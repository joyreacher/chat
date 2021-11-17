import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, Button, Pressable } from 'react-native';
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
        {/* navbar */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Chat</Text>
        </View>

          {/* input */}
        <View style={styles.main}>
          <TextInput 
                style={styles.input}
                onChangeText={(text) => this.setState({name: text})}
              />
        </View>
        {/* call to action */}
        <View style={styles.cta}>
          <Pressable style={styles.button} onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name})}>
              <Text
              style={styles.text}
              >Go to Chat
            </Text>
          </Pressable>
        </View>      
      </ImageBackground>
      </View>
    );
  }
}

export default Start;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'space-around',
    flexDirection:'column',
  },
  
  header:{
    flex:1,
    position:'relative',
    alignSelf:'stretch',
    top:0,
    maxHeight:'10%',
    width:'auto',
    paddingTop:15,
    paddingLeft:20
  },
  headerText:{
    color:'white',
    height:100,
    fontSize: 25
  },
  main:{
    height:100
  },
  cta:{
    marginBottom:150
  },
  text:{
    color:'white',
    fontSize:35
  },
  input:{
    borderRadius:5,
    backgroundColor:'white',
    width:300,
    height:50
  },
  image: {
    flex:1,
    justifyContent: 'space-between',
    alignItems:'center',
    
  },
  button:{
    backgroundColor:'green',
    padding:10,
    borderRadius:10
  }
});
