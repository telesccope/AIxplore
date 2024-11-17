import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Text, TouchableOpacity,View,Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const MyButton = ({text, onPress}) =>(
    <TouchableOpacity style={BottonStyles.buttonContainer}
        onPress={onPress}
      >
      <LinearGradient
          colors={['#7AD0CD', '#93DBC8', '#A9E5C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={BottonStyles.button}
        >
        <Text style={BottonStyles.buttonText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>)

export const HomeButton = ({text, onPress, colors}) =>(
  <TouchableOpacity style={HomeBottonStyles.buttonContainer}
      onPress={onPress}
    >
    <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={HomeBottonStyles.button}
      >
      <Text style={HomeBottonStyles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>)
  
export const DateButton = ({text, onPress, width}) =>(
  <TouchableOpacity
    style={[
      DateBottonStyles.buttonContainer,
      { width: width || '25%' } 
    ]}
    onPress={onPress}
  >
    <Text style={DateBottonStyles.buttonText}>{text}</Text>
  </TouchableOpacity>)

export const SelectButton = ({text, onPress,}) =>(
  <TouchableOpacity style={BottonStyles.SelectButton}
      onPress={onPress}>
      <Icon name="check-circle" size={36} color="gray" />
  </TouchableOpacity>
)
export const FilterButton = ({text, onPress,}) =>(
    <TouchableOpacity style={BottonStyles.buttonContainer}
        onPress={onPress}
      >
      <LinearGradient
          colors={['#7AD0CD', '#93DBC8', '#A9E5C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={BottonStyles.button}
        >
        <Text style={BottonStyles.buttonText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>)

export const ProductButton = ({ name, price, quantity, imageUrl }) => (
  <View style={ProductButtonStyles.card}>
      <Image source={imageUrl} style={ProductButtonStyles.image} />
      <View style={ProductButtonStyles.infoContainer}>
        <Text style={ProductButtonStyles.name}>{name}</Text>
      </View>
    </View>
);

const BottonStyles = StyleSheet.create({
  button: {
    paddingVertical: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20,
  },
  buttonContainer: {
    width: '95%', 
    borderRadius: 28, 
    overflow: 'hidden', 
    paddingVertical:16,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight:'bold' 
  },
  SelectButton: {
    height: 50, 
    width: '20%',
    marginBottom: 10, 
    marginLeft: 20,
    justifyContent: 'center',
  },
  FilterButton: {

  },
  })
const HomeBottonStyles = StyleSheet.create({
  button: {
    paddingVertical: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20,
    marginRight: 5,
    marginLeft: 5
  },
  buttonContainer: {
    width: '32%', 
    borderRadius: 28, 
    overflow: 'hidden', 
    paddingVertical:16,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight:'bold' 
  },
})
const DateBottonStyles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 28, 
    overflow: 'hidden', 
    paddingVertical:16,
    backgroundColor: '#fcfcfe',
    borderWidth: 1, 
    borderColor: '#f0f0f3', 
    marginRight:10,
    marginBottom: 0,
    height: '95%'
  },
  buttonText: {
    color: 'black', 
    fontSize: 14,
    fontWeight:'bold', 
    textAlign: 'center', 
  },
});

const ProductButtonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15, 
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    width: '45%', 
    aspectRatio: 1, 
    marginHorizontal: '1%', 
  },
  image: {
    width: '100%',
    height: '70%', 
  },
  infoContainer: {
    flex: 1, 
    paddingHorizontal: 5, 
    paddingTop: 5, 
    paddingBottom: 10, 
    justifyContent: 'center',

  },
  name: {
    fontSize: 14, 
    fontWeight: 'bold',
    textAlign: 'center', 
    color: '#333', 
  },

    priceQuantityContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
    },
    price: {
      fontSize: 18,
      color: '#333',
      marginBottom: 5,
    },
    quantity: {
      fontSize: 16,
      color: '#666',
    },
  });
