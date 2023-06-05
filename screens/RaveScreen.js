import { connect } from 'react-redux';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';



const RaveScreen = ({ recordedFiles, serverInfo }) => {
  const address = serverInfo.address;
  const port = serverInfo.port;
  const models = serverInfo.models;
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);



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

      // Download file
      const { uri } = await FileSystem.downloadAsync(`http://${address}:${port}/download/`, directory + "/hey.wav");
  
    } catch (error) {
      console.error('Failed to download file', error);
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
      </View>
      <Button
          style={styles.button}
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
});

const mapStateToProps = (state) => {
  console.log(state.serverInfo); 
  return {
    recordedFiles: state.recordedFiles,
    serverInfo: state.serverInfo,
  };
};

export default connect(mapStateToProps)(RaveScreen);
