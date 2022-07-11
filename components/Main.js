import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import { useRoute } from '../router';

import { stateChangeUser } from '../redux/auth/auth-operations';

const Main = () =>{
const {stateChange} = useSelector(state => state.auth)
const dispatch = useDispatch()


useEffect(()=> {
   (async () => {
    await onAuthStateChanged(auth, user => {
        if(user && !stateChange){
            dispatch(stateChangeUser())
        };
        // if (!user && !stateChange) {
        //     dispatch(logout());
        //   }
    })
   })()
}, [dispatch])

const routing = useRoute(stateChange)

return <NavigationContainer>{routing}</NavigationContainer>
}

export default Main