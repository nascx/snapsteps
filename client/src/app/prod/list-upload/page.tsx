'use client'

import Navbar from '@/components/Navbar'
import Upload from '@/components/Upload'
import useUploadFile from '@/hooks/production/useUploadFile'
import { linksProd } from '@/links'
import React from 'react'

const ProdUploadList = () => {

  const {handleListChange, handleSubmit, loading} = useUploadFile()

  return (
    <div>
      <Navbar links={linksProd}/>
      <Upload
        name='list'
        img='/excel.png'
        descriprion="Escolha abaixo a lista para fazer upload"
        handleChange={handleListChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}


export default ProdUploadList