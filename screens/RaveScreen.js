import { connect } from 'react-redux';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';



const RaveScreen = ({ recordedFiles, serverInfo }) => {
  const address = serverInfo.address;
  const port = serverInfo.port;
  const models = serverInfo.models;
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const soundRef = useRef(null);
  const [isFileDownloaded, setIsFileDownloaded] = useState(false);




  const selectModel = async () => {
    try {
      const response = fetch(`http://${address}:${port}/selectModel/${selectedModel}`);
      if (response !== null) {
        console.log('Modèle sélectionné avec succès');
      } else {
        console.log('La requête a échoué');
      }
    } catch (error) {
      console.error('Une erreur s\'est produite', error);
    }
  };

  useEffect(() => {
    if (selectedModel) {
      selectModel(selectedModel);
    }
  }, [selectedModel]);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };


  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const fileUri = file.info.uri;
      const response = await FileSystem.uploadAsync(`http://${address}:${port}/upload`, fileUri, {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: { filename: fileUri }
      });
     showToast(response.body);
    } catch (error) {
      console.error('Failed to upload file', error);
    }finally {
      setLoading(false);
    }
  };

  
  const handleFileDownload = async (file) => {

    try {
      // Create a directory in the app document directory
    let directory = FileSystem.documentDirectory + "my_directory";


    const directoryInfo = await FileSystem.getInfoAsync(directory);
    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory);
    }
    const serverAddress = `http://${address}:${port}/download`;

      // Download file
      const { uri } = await FileSystem.downloadAsync(serverAddress, directory + "/hey.wav");
      showToast('File downloaded');
      setSelectedFile(uri);
      setIsFileDownloaded(true);

      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      soundRef.current = sound;
  
    } catch (error) {
      console.error('Failed to download file', error);
    }
  };
  
  const handlePlaySound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  };

  const handleStopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
    } catch (error) {
      console.error('Failed to stop sound', error);
    }
  };

    const renderItem = ({ item }) => {
      const handleFileSelection = () => {
        setSelectedFile(item);
        handleFileUpload(item);
      };
  
      return (
        <TouchableOpacity
          onPress={handleFileSelection}
          style={[
            styles.item,
            selectedFile === item ? styles.selectedItem : null,
          ]}
        >
          <Text>{item.info.uri}</Text>
        </TouchableOpacity>
      );
    };

  return (
    
    <><View>
      <Text>Select a model:</Text>
      <Picker
        selectedValue={selectedModel}
        onValueChange={(itemValue) => setSelectedModel(itemValue)}
      >
        {models && models.map((model) => (
          <Picker.Item key={model} label={model} value={model} />
        ))}
      </Picker>
    </View><View style={styles.container}>
    
    <FlatList
          data={recordedFiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.info.uri}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text></Text>
        )}
         {isFileDownloaded && (
        <View style={styles.buttonContainer}>
          <Button
            style={styles.playStopButton}
            onPress={handleStopSound}
            title="Stop"
          />
          <Button
            style={styles.playStopButton}
            onPress={handlePlaySound}
            title="Play"
          />
        </View>
      )}
      </View>
     
      <Button
          onPress={() => handleFileDownload()}
          title="Download" />

      </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: '#36C9E3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fill: {
    flex: 1,
    marginRight: 16,
  },
  button: {
    marginRight: 16,
  },
  buttonContainer: {
    marginBottom: 150,
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playStopButton: {

  }
});

const mapStateToProps = (state) => {
  console.log(state.serverInfo); 
  return {
    recordedFiles: state.recordedFiles,
    serverInfo: state.serverInfo,
  };
};

export default connect(mapStateToProps)(RaveScreen);
