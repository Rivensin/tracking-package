import { NextResponse } from "next/server"

let latestDriverLocation = {lat:0, lng:0}

export async function POST(req: Request){
  const body = await req.json()
  const {lat, lng} = body
  
  latestDriverLocation = {lat, lng}
  
  return NextResponse.json({success: true})
}

export async function GET(){
  return NextResponse.json(latestDriverLocation)
}