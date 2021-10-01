import * as React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useDispatch } from "react-redux";

import * as authActions from "../../store/action/auth";

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={onLogout} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
