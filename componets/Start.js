import React, { Component } from 'react';
import { StyleSheet, Alert, Text, View, ImageBackground, TextInput, Button, Pressable, Modal} from 'react-native';
// background image
const image = require('../assets/project_assets/bg.png')
class Start extends Component {
  constructor(props){
    super(props)
    this.state = {
      name:'',
      color:'',
      colors: {
        black:'#0F120E',
        purple:'#757082',
        green:'#B8C6AE',
        blue:'#637380'
      }
    }
  }
  handleColorSelection = (colorSelection) => {
    return this.setState({color:colorSelection})  
  }

  render() {
    return (
      <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode='cover'
        style={styles.image}
      >
        {/* input */}
        <View style={styles.main}>
          <Text style={styles.title}>
            Chat
            {this.state.color}
          </Text>
        </View>
        {/* call to action */}
        <View style={styles.containerCta}>
        <TextInput 
          placeholder='Enter Your Name'
          style={styles.input}
          onChangeText={(text) => this.setState({name: text})}
        />
        
        
        {/* color selction */}
        <View style={styles.colorSelectionContainer}>
          <Text>Choose a background color:</Text>
          <View style={styles.colorSelection}>
              <Pressable
                onPress={() => this.handleColorSelection(this.state.colors.black)}
                style={styles.colorSelectionSize}
              >
                <View 
                  style={[styles.black, styles.colorSelectionSize]}
                />
              </Pressable>
              <Pressable
                onPress={() => this.handleColorSelection(this.state.colors.purple)}
                style={styles.colorSelectionSize}
              >
                <View
                  style={[styles.purple, styles.colorSelectionSize]}
                />
              </Pressable>
              
              <Pressable
                onPress={() => this.handleColorSelection(this.state.colors.green)}
                style={styles.colorSelectionSize}
              >
                <View
                  style={[styles.green, styles.colorSelectionSize]}
                />
              </Pressable>
              
              <Pressable
                onPress={() => this.handleColorSelection(this.state.colors.blue)}
                style={styles.colorSelectionSize}
              >
                <View
                  style={[styles.blue, styles.colorSelectionSize]}
                />
              </Pressable>
          </View>
        </View>
        
        {/* Go to Chat Button */}
          <View style={styles.cta}>
            <Pressable
              style={styles.button}
              onPress={() => {
                // Send name and color state as props to chat
                this.props.navigation.navigate('Chat', {name: this.state.name, color: this.state.color})
                }
              }>
                <Text
                style={styles.text}
                >Go to Chat
              </Text>
            </Pressable>
          </View>      
        </View>
        
      </ImageBackground>
      </View>
    );
  }
}

export default Start;

const styles = StyleSheet.create({
  colorSelectionContainer:{
    marginTop:30,
    marginBottom:0,
    
  },
  colorSelection:{
    marginTop:15,
    marginBottom:40,
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-end',
    flexWrap:'wrap',
  },
  containerCta:{
    position:'relative',
    bottom:50,
    height:300,
    width:300,
    alignSelf:'center',
    padding:23,
    backgroundColor:'white',
    shadowOpacity:.5,
    shadowRadius:7,
    shadowColor:'black',
    shadowOffset:{
      width:-6,
      height:8
    },
    borderRadius:22
  },
  container: {
    flex:1,
    justifyContent:'space-around',
  },
  centeredView: {
    flex: 1,
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  main:{
    height:100,
    flex:1,
    justifyContent:'center'
  },
  cta:{
    marginBottom:10
  },
  // button text
  text:{
    textAlign:'center',
    color:'rgb(255, 255, 255)',
    fontSize:35
  },
  title:{
    color:'white',
    fontSize: 56
  },
  input:{
    padding:10,
    borderWidth:1,
    borderColor:'black',
    borderRadius:5,
    backgroundColor:'white',
    height:50
  },
  image: {
    flex:1,
    // flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    
  },
  button:{
    marginTop:50,
    backgroundColor:'#757082',
    padding:10,
    borderRadius:10
  },
  colorSelectionSize:{
    width:40,
    height:40,
    borderRadius: 50
  },
  black :{
    backgroundColor: '#0F120E',
  },
  purple :{
    backgroundColor: '#757082',
  },
  green :{
    backgroundColor: '#B8C6AE',
  },
  blue :{
    backgroundColor: '#637380',
  }
});
