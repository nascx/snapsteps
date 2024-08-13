import { useState, FormEvent, ChangeEvent } from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { urlAPi } from "@/urlApi";

const useUploadIT = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const [list, setList] = useState<File | null>(null)

    const handleListChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setList(e.target.files[0])
            console.log(list)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        setLoading(true)

        e.preventDefault()
        if (!list) {
            toast.error('Nenhum arquivo foi selecionado')
        }

        const formData = new FormData()

        await formData.append('it', list as Blob, list?.name)

        try {
            await axios.post(`${urlAPi}/sgi/upload-it`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then((res) => { 
                    toast.success('Arquivo enviado com sucesso!')
                    setLoading(false)
                })
                .catch((err) => { 
                    toast.error('Erro no envio do arquivo') 
                    setLoading(false)
                })
        } catch (error) {
            console.error({ message: 'Uploading error', error: error })
        }
    }
    return { handleListChange, handleSubmit, loading }
}

export default useUploadIT