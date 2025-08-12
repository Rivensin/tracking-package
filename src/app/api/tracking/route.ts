import { addOrder, updateOrder } from "@/app/lib/firebase/services"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest){
  const data = await req.json()

  const id = req.nextUrl.searchParams.get('id')

  if(id){
    const res = await updateOrder({id,lat : data.lat, lng: data.lng})  
    if(res){
    return NextResponse.json({success: true, message: 'Update Success'})
    }
  }

  const res = await addOrder(data)

  if(res){
    return NextResponse.json({success: true, message: 'Add Order Success', id: res.id})
  } 
  
  return NextResponse.json({success: false, message: 'Add Order Failed'})
  
}


// export async function GET(){
//   return NextResponse.json(latestDriverLocation)
// }