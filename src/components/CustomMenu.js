import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu } from 'react-native-paper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

function CustomMenu({ menuItems }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  console.log("menuItems", menuItems);
  return (
    <View style={{ alignItems: 'flex-end' }}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Icon
            name="ellipsis-vertical"
            size={24}
            onPress={openMenu}
            style={{ marginRight: 10 }}
          />
        }
      >
        {menuItems.map((item, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              item.onPress();
              closeMenu();
            }}
            title={item.title}
          />
        ))}
      </Menu>
    </View>
  );
}

CustomMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default CustomMenu;
