import app from "./init";
import { collection, getDocs, doc, getDoc, addDoc, getFirestore, query, where, updateDoc, Timestamp } from "firebase/firestore";

const firestore =  getFirestore(app)

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface TrackingRequest {
  driverLocation : LocationData
  clientLocation : LocationData
  status: string
}

export async function addOrder(data : TrackingRequest){
  if(data){
    data.status = 'Sedang Mengantar' 
    const add = await addDoc(collection(firestore, 'delivery'),{...data,})
  return {id: add.id, status: true, message: 'Order shipped', statusCode: 200}
  } else {
    return {status: false, message: 'Order data not valid', statusCode: 400}
  }
}

export async function updateOrder({id, lat, lng} :  {id: string, lat : number,lng : number}){
  const q = query(collection(firestore,'delivery'), where('id','==',id))
  
  const snapshot = await getDocs(q)
  
  if(!snapshot.empty){
    const docRef = snapshot.docs[0].ref
    await updateDoc(docRef,{
      "driverLocation.lat": lat,
      "driverLocation.lng": lng,
    })

    return {status: true, message: 'Update Success', statusCode: 200}
  } else {
    return {status: false, message: 'Update Failed', statusCode: 400}
  }
}
