import app from "./init";
import { collection, getDocs, doc, getDoc, addDoc, getFirestore, query, where, updateDoc, deleteDoc } from "firebase/firestore";

const firestore =  getFirestore(app)

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export interface TrackingRequest {
  id: string
  driverLocation : LocationData
  clientLocation : LocationData
  status: string
  tanggal: string
}

interface UpdateLocation {
  id: string;
  lat: number;
  lng: number;
  status?: string;
}

export async function retriveOrder(){
  const snapshot = await getDocs(collection(firestore,'delivery'))
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return data
}

export async function retriveOrderById(collectionName: string,orderId: string){
  const snapshot = await getDoc(doc(firestore,collectionName,orderId))
  const data = snapshot.data()
  return data
}

export async function addOrder(data : TrackingRequest){
  if(data){
    data.status = 'Sedang Mengantar'
    data.tanggal = new Date().toISOString()
    const add = await addDoc(collection(firestore, 'delivery'),{...data,})
    return {id: add.id, status: true, message: 'Order Shipped', statusCode: 200}
  } else {
    return {status: false, message: 'Order Failed', statusCode: 400}
  }
}

export async function updateOrder({id, lat, lng, status} : UpdateLocation){
  const q = query(collection(firestore,'delivery'), where('id','==',id))
  
  const snapshot = await getDocs(q)
  
  if(!snapshot.empty){
    const docRef = snapshot.docs[0].ref

    const payload = {
      "driverLocation.lat": lat,
      "driverLocation.lng": lng,
      ...(status !== undefined && {status}),
    }

    await updateDoc(docRef,payload)

    return {status: true, message: 'Update Success', statusCode: 200}
  } else {
    return {status: false, message: 'Update Failed', statusCode: 400}
  }
}

export async function deleteOrder({trip} : {trip: string}){
  try {
    const docRef = doc(firestore,'delivery',trip)
    await deleteDoc(docRef)
    return {status: true, message: 'Delete Success', statusCode: 200}
  } catch (error) {
    console.error('Error Deleting Docuement',error)
    return {status: false, message: 'Delete Failed', statusCode: 400}
  }
  
}