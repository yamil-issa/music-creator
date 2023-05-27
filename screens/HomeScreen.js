import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export function HomeScreen({ navigation }) {
  const [serverAddress, setServerAddress] = useState('');
  const [port, setPort] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');

  const handleTestConnection = () => {
    // Send a test request to the server
    // Replace the placeholder URL with your actual server endpoint
    const testUrl = `http://${serverAddress}:${port}`;

    fetch(testUrl)
      .then(response => {
        if (response.ok) {
          setConnectionStatus('Connection successful');
          showToast('Connection successful');
        } else {
          setConnectionStatus('Connection failed');
          showToast('Connection failed');
        }
      })
      .catch(error => {
        console.error('Error testing connection:', error);
        setConnectionStatus('Connection failed');
        showToast('Connection failed');
      });
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handlerecord = () => {
    navigation.navigate('Record'); // Navigate to the "Record" screen
  }

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
