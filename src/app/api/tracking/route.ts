import { addOrder, deleteOrder, retriveOrder, updateOrder } from "@/lib/firebase/services"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest){

  const data = await req.json()
  const id = req.nextUrl.searchParams.get('id')

  if(id){
    const res = await updateOrder({id,lat : data.lat, lng: data.lng, status: data.status})  
    if(res){
      return NextResponse.json({success: true, message: res.message})
    }
  }

  const res = await addOrder(data)

  if(res){
    return NextResponse.json({success: true, message: res.message, id: res.id})
  }
}

export async function DELETE(req: NextRequest){
  const id = req.nextUrl.searchParams.get('id')

  if(id){
    try{
      const res = await deleteOrder({trip: id})

      if(res){
        return NextResponse.json({success: true, message: res.message})
      }
    } catch(error){
      return NextResponse.json({success: false, message: error})
    }
  }
}

export async function GET(req: NextRequest){
  const data = await retriveOrder()

  return NextResponse.json({
    status: 200,
    message: 'retrive success',
    data: data
  })
}