import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import { Platform } from 'react-native';

export const StatsCard = ({ points_earned, co2_saved, onDateSelected,dateLabel,carddate }) => {
  const [date, setDate] = useState(carddate);

  const [displayDate, setDisplayDate] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  
  useEffect(() => {
    console.log('carddate:', carddate);
    if (date !== carddate) {
      setDate(carddate); 
    }
  }, [carddate]);
  

  useEffect(() => {
    if (date) { 
      setDisplayDate(date.toISOString().split('T')[0]);
    }
  }, [date]);

  const decrementDate = () => {
    const newDate = new Date(date.setDate(date.getDate() - 1));
    setDate(newDate);
  };

  const incrementDate = () => {
    const newDate = new Date(date.setDate(date.getDate() + 1));
    setDate(newDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); 
    setDate(currentDate);
  };

  useEffect(() => {
    onDateSelected(date); 
  }, [date]);

  return (
    <LinearGradient
      colors={['#CFF5E0','#CFF5E0','#CFF5E0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
    <View style={styles.card}>
      <View style={styles.dateRow}>
        { !dateLabel && (
          <TouchableOpacity onPress={decrementDate} style={styles.arrowContainer}>
            <Text style={styles.arrowText}>{"<"}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={showDatePicker} style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {dateLabel || displayDate}
          </Text>
        </TouchableOpacity>

        { !dateLabel && (
          <TouchableOpacity onPress={incrementDate} style={styles.arrowContainer}>
            <Text style={styles.arrowText}>{">"}</Text>
          </TouchableOpacity>
        )}

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{points_earned}</Text>
          <Text style={styles.statLabel}>Points earned</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>{co2_saved} g</Text>
          <Text style={styles.statLabel}>CO2 saved</Text>
        </View>
      </View>
    </View>
    </LinearGradient>
  );
};

export const EmissionCard = ({ IconComponent, distance, duration, emission, text }) => (
  <View style={emissionstyles.container}>
    <View style={emissionstyles.iconTextContainer}>
      {IconComponent}
      <Text style={emissionstyles.text}>{text}</Text>
    </View>
    <View style={emissionstyles.valuesContainer}>
      <View style={emissionstyles.valueItem}>
        <Feather name="flag" size={14} color="gray" />
        <Text style={emissionstyles.valueText}>{distance} Km</Text>
      </View>
      <View style={emissionstyles.valueItem}>
        <Feather name="clock" size={14} color="gray" />
        <Text style={emissionstyles.valueText}>{duration} min</Text>
      </View>
      <View style={emissionstyles.valueItem}>
        <Entypo name="air" size={14} color="gray" />
        <Text style={emissionstyles.valueText}>{emission} g</Text>
      </View>
    </View>
  </View>
);

const emissionstyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
    width: '95%', 
    paddingTop: 10, 
    paddingBottom: 10, 
    height: '12%'
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '95%',
    marginBottom: 8, 
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '95%',
    marginLeft: '10%'
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '33%', 
    textAlign: 'center', 
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
  },
  valueText: {
    marginLeft: 4,
    fontSize: 14,
    textAlign: 'center', 
  },
});

const styles = StyleSheet.create({
  background: {
    borderRadius: 15, 
    paddingVertical: 10, 
    paddingHorizontal: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    height: '21%',
    alignSelf: 'center',
    backgroundColor: '#ffffff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    borderRadius: 15, 
    paddingVertical: 10, 
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#ffffff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    width: '100%',
    height: '30%',
    marginBottom: 15, 
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  arrowContainer: {
    padding: 8, 
    backgroundColor: '#E4F5F0', 
    borderRadius: 30, 
  },
  arrowText: {
    fontSize: 23, 
    color: '#1bd19a', 
  },
  dateContainer: {
    flex: 2, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 21, 
    fontWeight: 'bold',
    color: '#05291E',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 30, 
    fontWeight: 'bold',
    color: '#05291E',
  },
  statLabel: {
    fontSize: 18, 
    color: '#05291E',
    opacity: 0.8,
  },
});