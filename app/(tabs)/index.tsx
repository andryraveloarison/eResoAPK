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

      await FileSystem.uploadAsync('http://192.168.0.111:5000/resolve', uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file'
      })
      .then(reponse=>{
        let rep  = JSON.parse(reponse.body);

        console.log(rep.data); // Affiche l'objet JSON complet
        
        setReponse(rep.data)
      })
  
    } catch (error) {
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

        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
        {reponse && (
          <>
            {reponse.map((item, index) => (
              <Text key={index}>{item}</Text>
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

    marginTop: 50

  },
  titre:{
    textAlign:'center',
    color:'black'
  },
  
  buttonContainer: {
    backgroundColor:'red',
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
