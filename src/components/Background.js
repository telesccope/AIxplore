import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform } from 'react-native';

export const MyBackground = ({children, style}) => (
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps='handled'
      enableOnAndroid={true}
      enableAutomaticScroll={Platform.OS === 'ios'}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F1F3FA', '#FFFFFF', '#EEF9F4', '#F1F3FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.container, style]}
      >
        {children}
      </LinearGradient>
    </KeyboardAwareScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    paddingTop: '5%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
