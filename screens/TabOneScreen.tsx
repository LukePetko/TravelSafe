import { Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { logout } from '../redux/stores/user';
import { styles } from '../styles/global';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      <Button title="logout!" onPress={() => dispatch(logout())} />
    </View>
  );
}
