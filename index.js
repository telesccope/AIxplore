import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.log("App name:", appName); // 打印应用程序名称
console.log("App component:", App); // 打印 App 组件

AppRegistry.registerComponent(appName, () => App);
