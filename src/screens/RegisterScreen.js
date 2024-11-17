import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView,Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { MyInput } from '../components/Input'
import { MyButton } from '../components/Button';
import { userRegister, resetRegisterState } from '../actions/UserAction'
import { MyBackground } from '../components/Background';
import { fetchAllOptions } from '../actions/UserAction';

export default function RegisterScreen({navigation}) {
  // 获取登录相关的状态，确保匹配reducer中的属性
  const userRegisterState = useSelector(state => state.registerReducer);
  console.log('Reducer:',userRegisterState)
  const { registerloading, registerpass, registererror } = userRegisterState;

  
  const [errorMessages, setErrorMessages] = useState({
    emailaddress: '',
  })
  const clearError = (field) => {
    setErrorMessages(prevErrors => ({ ...prevErrors, [field]: '' }));
  };
  
  const handlePostcodeChange = (newText) => {
    setPostcode(newText);
  };
  useEffect(() => {
    console.log('Effect triggered');
  
    if (registerpass) {
      navigation.navigate('Login'); 
    }
  }, [registerpass, navigation]);
  const dispatch = useDispatch();
  
  const [CountryData, setCountryData] = useState([]);
  const [AgeGroupData, setAgeGroupData] = useState([]);
  const [GenderData, setGenderData] = useState([]);
  const [EthnicGroupData, setEthnicGroupData] = useState([]);
  const [OccupationData, setOccupationData] = useState([]);
  const [DisabilityData, setDisabilityData] = useState([]);
  const [OrganisationData, setOrganisationData] = useState([]);
  const [TypeOfVehicleData, setTypeOfVehicleData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const options = await fetchAllOptions();
      console.log(options,"*****")
      const transformedCountryData = options.country.map(option => ({
        label: option.name,
        value: option.code
      }));
      setCountryData(transformedCountryData);
      const transformedAgeGroupData = options.agegroup ? options.agegroup.map(option => ({
        label: option.name,
        value: option.id
      })) : [];

      setAgeGroupData(transformedAgeGroupData);

      // 同样的转换逻辑适用于其他数据类型...
      // 请确保后端返回的结构与选项名称相匹配
      setGenderData(options.gender ? options.gender.map(option => ({
        label: option.name,
        value: option.id
      })) : []);
      
      setEthnicGroupData(options.ethicalgroup ? options.ethicalgroup.map(option => ({
        label: option.name,
        value: option.id
      })) : []);
      
      setOccupationData(options.occupation ? options.occupation.map(option => ({
        label: option.name,
        value: option.id
      })) : []);
      
      setDisabilityData(options.disability ? options.disability.map(option => ({
        label: option.name,
        value: option.id
      })) : []);
      
      setOrganisationData(options.organisation ? options.organisation.map(option => ({
        label: option.name,
        value: option.id
      })) : []);
      
      setTypeOfVehicleData(options.typeofvehicle ? options.typeofvehicle.map(option => ({
        label: option.name,
        value: option.id
      })) : []);
    }

    fetchData();
  }, []);

  useEffect(() => {
    
  }, []);
  useEffect(() => {
    return () => {
      // 组件卸载时调用，重置注册状态
      dispatch(resetRegisterState());
      dispatch(resetNextStepState());
    };
  }, [dispatch]);
  useEffect(() => {
    if (registererror) {
      console.log('useEffect registererror',registererror)
      Alert.alert('Register Failed', registererror['message'], [{ text: 'OK' }]);
    }
  }, [registererror]); // 单独处理error的警告，只在error改变时触发

  const handleRegister = () => {
    console.log('Register');
    let errors = {};
  
    // 如果存在任何错误，则更新状态并阻止提交
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
  
    // 清除错误信息并执行下一步操作
    setErrorMessages({});
    dispatch(userRegister(Country, AgeGroup, Gender, EthnicGroup, Occupation, Disability, Postcode, Organisation, TypeOfVehicle));
  };

  return (
    <MyBackground>
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.text}>Postcode</Text>
      <MyInput placeholder='Please enter your postcode' value={Postcode}
          onChangeText={handlePostcodeChange}/>
      <MyButton text='Register' onPress={handleRegister}/>
    </View>
    </ScrollView>
    </MyBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '5%', // You can adjust this value
    paddingHorizontal: '5%', // You can adjust this value
    //justifyContent: 'center',
    alignItems: 'left',
    marginVertical: 1,
  },
  text: {
    marginBottom:10
  },
})
