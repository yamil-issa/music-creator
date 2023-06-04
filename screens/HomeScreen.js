import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { setServerInfo } from '../redux/actions';

const mapStateToProps = (state) => ({
  serverInfo: state.serverInfo,
});

const mapDispatchToProps = {
  setServerInfo,
};

export function HomeScreen({ setServerInfo }) {
  const [serverAddress, setServerAddress] = useState('');
  const [port, setPort] = useState('');
  const [models, setModels] = useState();
  const [connectionStatus, setConnectionStatus] = useState('');

  const getModels = async () => {
    let data = null;
    try {
      const response = await fetch(`http://${serverAddress}:${port}/getmodels`);
      if (response.ok) {
        data = await response.json();
       
      } else {
        console.log('La requête a échoué');
      }
    } catch (error) {
      console.error('Une erreur s\'est produite', error);
    }
    return data;
  };

  const handleTestConnection = () => {
    
    const testUrl = `http://${serverAddress}:${port}`;

    fetch(testUrl)
      .then(response => {
        if (response.ok) {
          setConnectionStatus('Connection successful');
          showToast('Connection successful');
          
         
              setModels(getModels().models);
            
         
          // Dispatch action to store server address and port
          setServerInfo({ address: serverAddress, port: port, models: models });
          //console.log(models);
   
        } else {
          setConnectionStatus('Connection failed');
          showToast('Connection failed');
        }
      })
      .catch(error => {
        setConnectionStatus('Connection failed');
        showToast('Connection failed');
      });
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to Server</Text>
      <TextInput
        style={styles.input}
        placeholder="Server Address"
        value={serverAddress}
        onChangeText={setServerAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Port"
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
      />
      <Button
        title="Test Connection"
        onPress={handleTestConnection}
        disabled={!serverAddress || !port}
      />
      <Text style={styles.connectionStatus}>{connectionStatus}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  connectionStatus: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    display: 'flex',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
