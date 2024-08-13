'use client'

import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { urlAPi } from "@/urlApi";
import Upload from "@/components/Upload";
import Navbar from "@/components/Navbar";
import { linksEng } from "@/links";

export default function Home() {

  const [list, setList] = useState<File | null>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const handleListChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setList(e.target.files[0])
      console.log(list)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    if (!list) {
      toast.error('Nenhum arquivo foi selecionado')
    }

    const formData = new FormData()

    await formData.append('list', list as Blob, list?.name)

    try {
      await axios.post(`${urlAPi}/eng/list-upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then((res) => {
          setLoading(false)
          toast.success('Arquivo enviado com sucesso!')
        }
        )
        .catch((err) => {
          setLoading(false)
          toast.error('Erro no envio do arquivo')
        }
        )
    } catch (error) {
      setLoading(false)
      console.error({ message: 'Uploading error', error: error })
    }
  }

  return (
    <>
      <Navbar links={linksEng}/>
      <Upload
        name="list"
        img="/excel.png"
        descriprion="Escolha abaixo a lista para fazer upload"
        handleChange={handleListChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
}
