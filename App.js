import React, { useEffect, useState } from 'react'
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { DefaultTheme, Provider, DarkTheme } from 'react-native-paper'
import TodayTab from './components/todayTab'
import WeekTab from './components/weekTab'
import MonthTab from './components/monthTab'
import Header from './components/header'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    getTheme();
  }, [])

  const getTheme = async () => {
    let theme = await AsyncStorage.getItem('theme')
    theme = JSON.parse(theme)
    setDarkMode(theme)
  }


  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
    },
  };
  const darkTheme = {
    ...DarkTheme,
    roundness: 2,
    colors: {
      ...DarkTheme.colors,
    },
  };
  return (
    <>
      <Provider theme={(darkMode) ? darkTheme : theme}>
        <Header dark={darkMode} setDark={setDarkMode} />
        <Tabs theme={{
          colors: {
            primary: '#ffff',
          },
        }}>
          <TabScreen label="Today">
            <TodayTab dark={darkMode} />
          </TabScreen>
          <TabScreen label="week">
            <WeekTab dark={darkMode} />
          </TabScreen>
          <TabScreen label="Months">
            <MonthTab dark={darkMode} />
          </TabScreen>
        </Tabs>
      </Provider>
    </>
  )
}
