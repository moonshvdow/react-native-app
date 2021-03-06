import { Provider } from 'react-redux';
import Main from './components/Main';

import { store } from './redux/store';

// import AppLoading from 'expo-app-loading';
// import { useFonts, 
//   Roboto_400Regular,
//   Roboto_500Medium,
//   Roboto_700Bold
//  } from '@expo-google-fonts/roboto';




export default function App() {

  // const [fontsLoaded] = useFonts({
  //   Roboto_400Regular,
  //   Roboto_500Medium,
  //   Roboto_700Bold
  // });

  // if (!fontsLoaded) {
  //   return <AppLoading/>;
  // }


  return (
    <Provider store={store}>
      <Main/>
    </Provider>
  );
}
