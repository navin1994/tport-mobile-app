import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";

import BackgroundImage from "./BackgroundImage";
import MenuItem from "./MenuItem";

const Dashboard = (props) => {
  const { userData, menuList } = props;

  return (
    <BackgroundImage>
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.gridContainer}>
            <FlatList
              numColumns={2}
              nestedScrollEnabled
              ListHeaderComponent={
                <View style={styles.welcomeContainer}>
                  <Text style={styles.initText}>WELCOME TO T-PORT</Text>
                  <Text style={styles.initText}>{userData.usrnme}</Text>
                </View>
              }
              data={menuList}
              keyExtractor={(item, index) => index}
              renderItem={(itemData) => (
                <MenuItem
                  style={{ backgroundColor: itemData.item.bgColor }}
                  icon={itemData.item.iconName}
                  title={itemData.item.title}
                  onSelect={itemData.item.onClick}
                />
              )}
            />
          </View>
        </View>
      </View>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: window.width,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  initText: {
    fontFamily: "open-sans",
    textTransform: "uppercase",
    color: "#fff",
    fontSize: 16,
  },
  gridContainer: {
    margin: 10,
  },
});
export default Dashboard;
