import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ManageExpenses from "./screens/ManageExpenses";
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import { GlobalStyles } from "./constants/styles";
import AntDesign from 'react-native-vector-icons/AntDesign';
import IconButton from "./components/UI/IconButton";
import ExpensesContextProvider from "./store/expenses-context";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();




function ExpensesOverview() {

  return (
    <BottomTab.Navigator 
      screenOptions={({navigation}) => ({
        headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
        headerTintColor: 'white',
        tabBarStyle: {backgroundColor: GlobalStyles.colors.primary500},
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        tabBarInactiveTintColor: GlobalStyles.colors.primary200,
        headerRight: ({tintColor}) => (
          <IconButton icon="plus" size={24} color={tintColor} onPress={() => navigation.navigate('MenageExpenses')} />
        )
      })}
    >
      <BottomTab.Screen 
        name="RecentExpenses" 
        component={RecentExpenses}
        options={{
          title: "Recent Expenses",
          tabBarLabel: "Recent",
          tabBarIcon: ({color, size}) => <AntDesign name='dribbble' color={color} size={size} />
        }}
      />
      <BottomTab.Screen 
        name="All Expenses" 
        component={AllExpenses}
        options={{
          title: "All",
          tabBarIcon: ({color, size}) => <AntDesign name="gitlab" color={color} size={size} />
        }}
      />
    </BottomTab.Navigator>
  )
}

export default function App() {
  return(
    <>
      <StatusBar barStyle={'light-content'}/>
      <ExpensesContextProvider>
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
              headerTintColor: 'white'
            }}
          >
            <Stack.Screen name="ExpensesOverview" component={ExpensesOverview} options={{headerShown: false}}/>
            <Stack.Screen name="MenageExpenses" component={ManageExpenses} options={{presentation: 'modal'}}/>
          </Stack.Navigator>

        </NavigationContainer>
      </ExpensesContextProvider>
    </>
  )
}
