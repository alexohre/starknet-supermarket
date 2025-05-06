import { NextRequest, NextResponse } from 'next/server';
import PinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

// Initialize Pinata client with environment variables
const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY || '',
  pinataSecretApiKey: process.env.PINATA_API_SECRET || ''
});

export async function POST(request: NextRequest) {
  try {
    // Check if the API keys are set
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET) {
      return NextResponse.json(
        { error: 'Pinata API keys not configured' },
        { status: 500 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a readable stream from the buffer
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Signal the end of the stream

    // Prepare the file for upload
    const options = {
      pinataMetadata: {
        name: file.name,
      },
    };

    // Upload to Pinata using the stream
    const result = await pinata.pinFileToIPFS(stream, options);
    
    // Create gateway URL with the configured gateway
    const gateway = process.env.PINATA_GATEWAY || 'coral-chemical-peacock-81.mypinata.cloud';
    const gatewayUrl = `https://${gateway}/ipfs/${result.IpfsHash}`;

    // Return the IPFS hash (CID) and URLs
    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      ipfsUri: `ipfs://${result.IpfsHash}`,
      gatewayUrl: gatewayUrl,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { error: 'Failed to upload to IPFS', details: error },
      { status: 500 }
    );
  }
}

// For handling preflight requests (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
