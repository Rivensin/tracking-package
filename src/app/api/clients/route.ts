import { retriveOrderById } from "@/lib/firebase/services"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest){
  const id = req.nextUrl.searchParams.get('id') ?? ''
  const data = await retriveOrderById('delivery',id)

  if(data){
    return NextResponse.json({
      status: 200,
      message: 'success',
      data: data
    })
  }

  
}
