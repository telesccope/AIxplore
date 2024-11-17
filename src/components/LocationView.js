import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import * as TaskManager from 'expo-task-manager'; 

const LocationViewComponent = () => {
  /*
  const [isTaskRunning, setIsTaskRunning] = useState(false); 
  
  useEffect(() => {
    const checkTaskStatus = async () => {
      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync('background-location-task');
      setIsTaskRunning(isTaskRegistered); 
    };

    checkTaskStatus();
  }, []);
  */

  const { fetchCount,last10locationList,lastSendTime,taskStatus } = useSelector(state => state.locationReducer);
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>This is a test version of EcoTravel</Text>
        <Text style={styles.infoText}>Location Fetch Count: {fetchCount}</Text>
        <Text style={styles.infoText}>Last Send Time: {lastSendTime ? new Date(lastSendTime).toISOString() : 'No data'}</Text>
        {taskStatus ? (
          <Text style={styles.infoText}>Background task is running.</Text>
        ) : (
          <Text style={styles.infoText}>Background task is not running.</Text>
        )}
        <Text style={styles.infoText}>Last Location Data:</Text>
        {Object.keys(last10locationList).map((key) => (
        <View key={key} style={styles.dataRow}>
          <Text style={styles.keyText}>{`${key}:`}</Text>
          {last10locationList[key].length > 0 ? (
            <Text style={styles.valueText}>
              {formatValue(last10locationList[key][last10locationList[key].length - 1])}
            </Text>
          ) : (
            <Text style={styles.valueText}>No data</Text>
          )}
        </View>
      ))}
      </View>
    </ScrollView>
  );
};
function formatValue(value) {
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'number') {
    return value.toFixed(3);
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (typeof value === 'object' && 'toISOString' in value) {
    return new Date(value).toISOString();
  }
  return value;
}
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  infoContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', 
  },
  keyText: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  valueText: {
    marginRight: 10, 
  }
});

export default LocationViewComponent;
