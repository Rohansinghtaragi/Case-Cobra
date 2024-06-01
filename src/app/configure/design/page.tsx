import React from 'react'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import DesignConfig from './DesignConfig'

interface PageProps {
  searchParams: {
    [key: string] : string | string[] | undefined
  }
}

const Page = async ({searchParams}: PageProps) => {
    const { id } = searchParams

    if(!id || typeof id !== 'string') {
      return notFound();
    }

    const configuration = await db.configuration.findUnique({
      where: {id}
    })

    if(!configuration){
      return notFound()
    }

    const {imageUrl, height, width} = configuration

  return (
    <div>
       <DesignConfig configId={configuration.id} imageUrl={imageUrl} imageDimension={{height, width}}/> 
    </div>
  )
}

export default Page