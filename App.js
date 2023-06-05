import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Provider } from 'react-redux';
import store from './store';
import HomeScreen from './screens/HomeScreen';
import RecordScreen from './screens/RecordScreen';
import RaveScreen from './screens/RaveScreen';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer style={styles.navigationContainer}>
        <Tab.Navigator style={styles.tabNavigatorContainer}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Record" component={RecordScreen} />
          <Tab.Screen name="Rave" component={RaveScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    
  },
  tabNavigatorContainer: {
    marginTop: 20,
  }
});
