import { StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View,Image } from 'react-native';
import { TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';


export default function HomeScreen() {

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [reponse , setReponse] = useState<String[]>([])

  async function readImage(uri: string): Promise<Blob> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }


  async function uploadImageToServer(uri: string) {
    const blob = await readImage(uri);
  

    const formData = new FormData();
    formData.append('file', blob);
    
    formData.append('Content-Type', 'image/jpeg');
    console.log(formData)

    try {

      await FileSystem.uploadAsync('http://192.168.117.239:5000/resolve', uri, {
      //await FileSystem.uploadAsync('http://192.168.137.148:5000/resolve', uri, {

        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file'
      })
      .then(reponse=>{
        let rep  = JSON.parse(reponse.body);

        console.log(rep.data); 
        setReponse(rep.data)
      })
  
    } catch (error) {
      alert("Erreur lors de la lecture de l'image")
      console.log("test")
      console.error(error);
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
      setImageUri(result.assets[0].uri); // Stocke l'URI de l'image dans l'état
      uploadImageToServer(result.assets[0].uri)        
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

        {imageUri && 
          <Image 
            source={{ uri: imageUri }} 
            style={{
              width: 200,
              height: 200,
              borderWidth: 2, // Largeur de la bordure
              borderColor: '#000', // Couleur de la bordure
              borderRadius: 10, // Arrondi des coins de la bordure
            }}
          />
        }
      
        {reponse && (

          <>
            {reponse.map((item, index) => (
              <Text style={ index != (reponse.length - 1) ? styles.resolution : styles.reponse} key={index}>
              {item}</Text>
            ))}
          </>

        )}


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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap:10

  },
  titre:{
    textAlign:'center',
    color:'black'
  },
  
  buttonContainer: {
    backgroundColor:'grey',
    height: 40, // Hauteur fixe, ajustez selon vos besoins
    justifyContent: 'center', // Centrer le texte verticalement
    alignItems: 'center', 
    textAlign:'center',
    padding:10,
    borderRadius: 20
  },
  
  buttonText: {
    fontSize: 16, // Taille de police, ajustez selon vos besoins
    color: 'white',
    textAlign:'center' // Couleur du texte, ajustez selon vos besoins
  },
  camera: {
    flex: 1,
  },

  resolution:{
    fontSize: 20
  },

  reponse:{
    fontSize:20,
    borderWidth: 2,
    padding: 5
   }
});
