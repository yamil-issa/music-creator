import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { addRecording } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { setRecordedFiles } from '../redux/actions';




export const RecordScreen = () => {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();


  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage('Please grant permission to app to access microphone');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }
  
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
  
      const info = await FileSystem.getInfoAsync(recording.getURI());
      const newRecording = {
        file: recording.getURI(),
        info,
      };
  
      setRecordings((prevRecordings) => [...prevRecordings, newRecording]);
     

    // Dispatch the setRecordedFiles action to store the recorded files
    dispatch(setRecordedFiles([...recordings, newRecording]));
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }
  
  

  async function deleteRecording(index) {
    const deletedRecording = recordings[index];

    try {
      await FileSystem.deleteAsync(deletedRecording.file);
      setRecordings((prevRecordings) =>
        prevRecordings.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error('Failed to delete recording', error);
    }
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1}
          </Text>
          <Button
            style={styles.button}
            onPress={() => playRecording(recordingLine.file)}
            title="Play"
          />
          <Button
            style={styles.button}
            onPress={() => deleteRecording(index)}
            title="Delete"
          />
        </View>
      );
    });
  }

  async function playRecording(uri) {
    try {
      if (recording && recording.isPlaying) {
        await recording.stopAsync();
      }

      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play recording', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});


export default connect()(RecordScreen);
