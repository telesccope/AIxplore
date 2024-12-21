import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform } from 'react-native';

export const MyBackground = ({ children, style }) => (
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView} // 只保留 flexGrow: 1
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={Platform.OS === 'ios'}
      style={{ flex: 1 }} // 让 KeyboardAwareScrollView 本身占满屏幕
    >
      <LinearGradient
        colors={['#FFFFFF', '#F1F3FA', '#FFFFFF', '#EEF9F4', '#F1F3FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.container, style]} // 确保 LinearGradient 占满父容器
      >
        {children}
      </LinearGradient>
    </KeyboardAwareScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // 确保 SafeAreaView 占满整个屏幕
  },
  scrollView: {
    flexGrow: 1, // 让内容扩展以适应屏幕高度
  },
  container: {
    flex: 1, // 确保 LinearGradient 占满父容器
    justifyContent: 'center',
    alignItems: 'center',
  },
});
