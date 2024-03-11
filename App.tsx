import { StyleSheet, Text, View } from 'react-native';
import LearnifyAppLogo from "./src/icons/learnify-app-logo";

export default function App() {
  return (
    <View style={styles.container}>
      <LearnifyAppLogo size={400}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#590d82',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
