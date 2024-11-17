import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, ScrollView,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from 'react-redux';
import { MyShortDropdown,MyLongDropdown } from '../components/Dropdown';
import { MyBackground } from '../components/Background';
import * as ImagePicker from 'expo-image-picker';
import { fetchAllOptions } from '../actions/UserActions';
import { fetchProfileData,updateProfileField,uploadAvatar } from '../actions/ProfileActions';

function EditProfileScreen({ navigation }) {

  const dispatch = useDispatch();
  const [isInitialUpdate, setIsInitialUpdate] = useState(true);
  useEffect(() => {
    async function fetchData() {
      const options = await fetchAllOptions();
      
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
      
      dispatch(fetchProfileData())
    }

    fetchData();
    
  }, []);

  useEffect(() => {
    
  }, []);
  
  const [CountryData, setCountryData] = useState([]);
  const [AgeGroupData, setAgeGroupData] = useState([]);
  const [GenderData, setGenderData] = useState([]);
  const [EthnicGroupData, setEthnicGroupData] = useState([]);
  const [OccupationData, setOccupationData] = useState([]);
  const [DisabilityData, setDisabilityData] = useState([]);
  const [OrganisationData, setOrganisationData] = useState([]);
  const [TypeOfVehicleData, setTypeOfVehicleData] = useState([]);

  
  const profileDataState = useSelector(state => state.profileReducer);
  const { userdetail, loading: profileLoading, error: profileError } = profileDataState;

  useEffect(() => {
    if (userdetail){
      console.log(userdetail,"^^^")
      setEmailAddress(userdetail.emailaddress)
      setCountry(userdetail.country_id)
      setAgeGroup(userdetail.agegroup_id)
      setGender(userdetail.gender_id)
      setEthnicGroup(userdetail.ethicalgroup_id)
      setOccupation(userdetail.occupation_id)
      setDisability(userdetail.disability_id)
      setPostcode(userdetail.postcode)
      setOrganisation(userdetail.organisation_id)
      setTypeOfVehicle(userdetail.typeofvehicle_id)
      setIsInitialUpdate(false);
    }
  }, [userdetail]);

  const [EmailAddress, setEmailAddress] = useState('');
  const [Country, setCountry] = useState('SG');
  const [AgeGroup, setAgeGroup] = useState(1);
  const [Gender, setGender] = useState(1);
  const [EthnicGroup, setEthnicGroup] = useState(1);
  const [Occupation, setOccupation] = useState(1);
  const [Disability, setDisability] = useState(1);
  const [Postcode, setPostcode] = useState('');
  const [Organisation, setOrganisation] = useState(1);
  const [TypeOfVehicle, setTypeOfVehicle] = useState(1);
  
  const navigateToEditEmailScreen = (field) => {
    navigation.navigate('ChangeEmail')
  };
  const navigateToEditPostCodeScreen = (field) => {
    navigation.navigate('ChangePostCode')
  };
  const handleCountryChange = (value) => {
    console.log(value,"&&&&&")
    if (!isInitialUpdate && Country !== undefined && value !== Country) {
      setCountry(value);
      dispatch(updateProfileField('country_id', value));
    }
  };

  const handleAgeGroupChange = (value) => {
    if (!isInitialUpdate && AgeGroup !== undefined && value !== AgeGroup && value !==1) {
      setAgeGroup(value)
      dispatch(updateProfileField('agegroup_id', value))
    }
  };

  const handleGenderChange = (value) => {
    if (!isInitialUpdate && Gender !== undefined && value !== Gender && value !==1) {
      setGender(value);
      dispatch(updateProfileField('gender_id', value));
    }
  };
  
  const handleEthnicGroupChange = (value) => {
    if (!isInitialUpdate && EthnicGroup !== undefined && value !== EthnicGroup && value !==1) {
      setEthnicGroup(value);
      dispatch(updateProfileField('ethicalgroup_id', value));
    }
  };
  
  const handleOccupationChange = (value) => {
    if (!isInitialUpdate && Occupation !== undefined && value !== Occupation && value !==1) {
      console.log(Occupation,value,';;;')
      setOccupation(value);
      dispatch(updateProfileField('occupation_id', value));
    }
  };
  
  const handleDisabilityChange = (value) => {
    if (!isInitialUpdate && Disability !== undefined && value !== Disability && value !==1) {
      setDisability(value);
      dispatch(updateProfileField('disability_id', value));
    }
  };
  
  const handleOrganisationChange = (value) => {
    if (!isInitialUpdate && Organisation !== undefined && value !== Organisation && value !==1) {
      setOrganisation(value);
      dispatch(updateProfileField('organisation_id', value));
    }
  };
  
  const handleTypeOfVehicleChange = (value) => {
    if (!isInitialUpdate &&TypeOfVehicle !== undefined && value !== TypeOfVehicle && value!==1) {
      setTypeOfVehicle(value);
      dispatch(updateProfileField('typeofvehicle_id', value));
    }
  };
  
  const [avatarUri, setAvatarUri] = useState(null);

  const handleImagePicked = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }
    setAvatarUri(pickerResult.uri);
    dispatch(uploadAvatar(pickerResult.uri, userdetail.email))
  };
  return (
    <MyBackground>
      <ScrollView>
      {/* <TouchableOpacity style={styles.item} onPress={handleImagePicked}>
          <Text style={styles.label}>Profile Photo</Text>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Ionicons name="chevron-forward-outline" size={24} color="#000" />
          )}
        </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigateToEditEmailScreen('email')}>
        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.value}>{EmailAddress}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#000" />
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.item} onPress={() => navigateToEditPostCodeScreen('postcode')}>
        <Text style={styles.label}>PostCode</Text>
        <Text style={styles.value}>{Postcode}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#000" />
      </TouchableOpacity>

      <MyShortDropdown text='Country' data={CountryData} value={Country} 
          onValueChange={handleCountryChange}/>
      <MyShortDropdown text='Age Group' data={AgeGroupData} value={AgeGroup} 
          onValueChange={handleAgeGroupChange}/>
      <MyShortDropdown text='Gender' data={GenderData} value={Gender} 
          onValueChange={handleGenderChange}/>
      <MyLongDropdown text='Ethnic Group' data={EthnicGroupData} value={EthnicGroup}
          onValueChange={handleEthnicGroupChange}/>
      <MyLongDropdown text='Occupation' data={OccupationData} value={Occupation}
          onValueChange={handleOccupationChange}/>
      <MyLongDropdown text='Disability' data={DisabilityData} value={Disability}
          onValueChange={handleDisabilityChange}/>
      <MyShortDropdown text='Organisation' data={OrganisationData} value={Organisation} 
          onValueChange={handleOrganisationChange}/>
      <MyShortDropdown text='Type of vehicle' data={TypeOfVehicleData} value={TypeOfVehicle} 
          onValueChange={handleTypeOfVehicleChange}/>
    </ScrollView>
    </MyBackground>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingHorizontal: 10,
  },
  label: {
    flex: 3,
    fontSize: 16,
  },
  value: {
    flex: 7,
    fontSize: 16,
    textAlign: 'right',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
  },
});

export default EditProfileScreen;
