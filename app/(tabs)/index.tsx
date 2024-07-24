import { StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native';
import { TouchableOpacity, Text } from 'react-native';
import { useRef } from 'react';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


export default function HomeScreen() {

  const cameraRef = useRef<any>(null);


  async function requestCameraPermissions() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
    }
  }


  async function takePhoto() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
  
    if (!result.canceled) {
      // Traitez l'image ici, par exemple en l'affichant ou en la stockant
    }
  }


  
  return (
    <View style={styles.vue}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titre}>
          Welcome!  <HelloWave />
        </ThemedText>  
      </ThemedView>
      
        <TouchableOpacity style={styles.buttonContainer} onPress={takePhoto}>
          <Text style={styles.buttonText}>Prendre une photo</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    textAlign:'center',
    backgroundColor:'white'
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  vue:{

    backgroundColor:'red',
    marginTop: 50

  },
  titre:{
    textAlign:'center',
    color:'black'
  },
  
  buttonContainer: {
    height: 40, // Hauteur fixe, ajustez selon vos besoins
    justifyContent: 'center', // Centrer le texte verticalement
    alignItems: 'center', 
    textAlign:'center'// Centrer le texte horizontalemen
  },
  
  buttonText: {
    fontSize: 16, // Taille de police, ajustez selon vos besoins
    color: 'white',
    textAlign:'center' // Couleur du texte, ajustez selon vos besoins
  },
  camera: {
    flex: 1,
  }
});
