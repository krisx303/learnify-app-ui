import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginPage from "./src/pages/login/LoginPage";

const App: React.FC = () => {
  return (
      <View style={styles.container}>
        <LoginPage />
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
});

export default App;
