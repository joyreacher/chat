import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, Pressable, KeyboardAvoidingView} from 'react-native';
// background image
const image = require('../assets/project_assets/bg.png')

/* 
  Application start screen: User can enter their name and select a background color to set the
    theme of the UI.
  Removing AsyncStorage error
  on line 648 change require path in index.rn.cjs (chat/node_modules/@firebase/app/dist/index.rn.cjs.js)
  point it to @react-native-async-storage/async-storage
*/
class Start extends Component {
  constructor(props){
    super(props)
    this.state = {
      name:'',
      color:'#FFFFFF',
      contrastColor:'100, 18%, 15%',
      textColor:'0, 0%, 100%',
      colors: {
        black:'#090C08',
        purple:'#474056',
        green:'#8A95A5',
        blue:'#B9C6AE'
      }
    }
  }
  /** 
    - handleColorSelection(color) takes a color hex value and sets the
      empty color state to pass to Chat.js
    - Sets bubble color of user's messages in the Chat screen
    - Overrides the default state
   */
  handleColorSelection = (colorSelection) => {
    switch (colorSelection){
      case this.state.colors.black:
        return this.setState({color: colorSelection, contrastColor: '100, 18%, 43%', textColor: '0, 0%, 100%'})
      case this.state.colors.purple:
        return this.setState({color: colorSelection, contrastColor: '259, 15%, 50%', textColor: '0, 0%, 100%'})
      case this.state.colors.green:
        return this.setState({color: colorSelection, contrastColor: '216, 13%, 18%', textColor: '0, 0%, 100%'})
      case this.state.colors.blue:
        return this.setState({color: colorSelection, contrastColor: '93, 17%, 28%', textColor: '0, 0%, 100%'})
    }
  }

  render() {
    return (
      <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode='cover'
        style={styles.image}
      >
          {/* input */}
          <View
            style={styles.main}>
            <Text style={styles.title}>
              Chat
            </Text>
          </View>
          {/* call to action */}
          <View style={styles.containerCta}>
          <TextInput 
            placeholder='Your Name'
            style={[styles.input,{ borderColor: !this.state.contrastColor ? this.state.colors.black : `hsl(${this.state.contrastColor})` }]}
            onChangeText={(text) => this.setState({name: text})}
          />
          {/* color selction */}
          <View style={styles.colorSelectionContainer}>
            <Text style={styles.colorSelectionTitle}>Choose a background color:</Text>
            <View style={styles.colorSelection}>
                {/* BLACK */}
                <Pressable
                  onPress={() => this.handleColorSelection(this.state.colors.black)}
                  style={styles.colorSelectionSize}
                >
                  <View 
                    style={[styles.black, (this.state.colors.black === this.state.color ? styles.colorSelectionSizeActive : styles.colorSelectionSize )]}
                  />
                </Pressable>
                
                {/* PURPLE */}
                <Pressable
                  onPress={() => this.handleColorSelection(this.state.colors.purple)}
                  style={styles.colorSelectionSize}
                >
                  <View
                    style={[styles.purple, (this.state.colors.purple === this.state.color ? styles.colorSelectionSizeActive : styles.colorSelectionSize )]}
                  />
                </Pressable>
                
                <Pressable
                  onPress={() => this.handleColorSelection(this.state.colors.green)}
                  style={styles.colorSelectionSize}
                >
                  <View
                    style={[styles.green, (this.state.colors.green === this.state.color ? styles.colorSelectionSizeActive : styles.colorSelectionSize )]}
                  />
                </Pressable>
                
                <Pressable
                  onPress={() => this.handleColorSelection(this.state.colors.blue)}
                  style={styles.colorSelectionSize}
                >
                  <View
                    style={[styles.blue, (this.state.colors.blue === this.state.color ? styles.colorSelectionSizeActive : styles.colorSelectionSize )]}
                  />
                </Pressable>
            </View>
          </View>
          {/* Go to Chat Button */}
          <View style={styles.cta}>
            <Pressable
              style={[styles.button, {backgroundColor: this.state.color === '#FFFFFF' ? '#757082' : this.state.color}]}
              onPress={() => {
                // Send name and color state as props to chat - Send Contrast color state for user's message bubbles
                this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color, contrastColor: this.state.contrastColor, textColor: this.state.textColor, isConnected: this.state.isConnected})
                }
              }>
                <Text
                style={styles.buttonText}
                >Go to Chat
              </Text>
            </Pressable>
          </View>      
        </View>
        
      </ImageBackground>
      </KeyboardAvoidingView>
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
    backgroundColor:'#FFFFFF',
    shadowOpacity:.5,
    shadowRadius:7,
    shadowColor:'black',
    shadowOffset:{
      width:-6,
      height:8
    },
    borderRadius:3
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
    color:'#FFFFFF',
    fontSize:35
  },
  title:{
    color:'#FFFFFF',
    fontSize: 45,
    fontWeight: '600'
  },
  input:{
    padding:10,
    borderWidth:2,
    borderRadius:5,
    height:50,
    fontSize:16,
    fontWeight: '300',
    opacity: .5
  },
  image: {
    flex:1,
    // flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    
  },
  button:{
    marginTop:50,
    padding:10,
    borderRadius:10
  },
  buttonText:{
    textAlign:'center',
    fontSize:16,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  colorSelectionTitle:{
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity:1
  },
  colorSelectionSize:{
    width:40,
    height:40,
    borderRadius: 20
  },
  colorSelectionSizeActive:{
    width:40,
    height:40,
    borderRadius: 50,
    borderColor:'lightblue',
    borderWidth:6,
  },
  black :{
    backgroundColor: 'hsl(105, 20%, 4%)',
  },
  purple :{
    backgroundColor: '#474056',
  },
  green :{
    backgroundColor: '#8A95A5',
  },
  blue :{
    backgroundColor: '#B9C6AE',
  }
});
