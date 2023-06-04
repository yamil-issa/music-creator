import { connect } from 'react-redux';
import { View, Text, FlatList, Button,  StyleSheet } from 'react-native';

const RaveScreen = ({ recordedFiles, serverInfo }) => {
  let address = serverInfo.address
  let port = serverInfo.port
  
  return (
    <View>
      <FlatList
        data={recordedFiles}
        renderItem={({ item }) => (
          <View key={item.info.uri} style={styles.row}>
            <Text style={styles.fill}>Recording {item.info.uri}</Text>
          </View>
        )}
        keyExtractor={(item) => item.info.uri}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
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

const mapStateToProps = (state) => ({
  recordings: state.recordings,
  serverInfo: state.serverInfo,
  recordedFiles: state.recordedFiles,
});

export default connect(mapStateToProps)(RaveScreen);
