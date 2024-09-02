'use client'

import Navbar from '@/components/Navbar'
import { linksQA, linksSGI } from '@/links'
import { urlAPi } from '@/urlApi'
import axios from 'axios'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const SeacrQA = () => {

    const [loading, setLoading] = useState<boolean>(false)

    const [value, setValue] = useState<string>('')

    const [by, setBy] = useState<string>('')

    const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const [qaFiles, setQaFiles] = useState<{ code: string, title: string, path: string }[]>([])

    useEffect(() => {
        if (value !== '') {
            axios.get(`${urlAPi}/qa/get-qa-file-options`, {
                params: {
                    value: value,
                }
            }).then((res) => {
                setQaFiles(res.data)
            }).catch((err) => {
                setQaFiles([])
                console.log(err)
            })
        } else {
            setQaFiles([])
        }
    }, [value])

    const viewIT = async (path: string) => {
        try {
            setLoading(true)

            const response = await axios.get(`${urlAPi}/qa/view-it`, {
                responseType: 'arraybuffer',
                params: {
                    path: path
                } // Importante para obter a resposta como ArrayBuffer
            });

            // Cria um Blob a partir da resposta
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            // Cria uma URL temporária para o Blob
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Abre o PDF em uma nova aba
            window.open(pdfUrl);

            setLoading(false)

        } catch (err) {
            console.log("Erro: ", err)
            setLoading(false)
            toast.error('Erro ao obter a lista, verifique se os parâmetros estão corretos ou se a IT usada já está no banco de dados!')
        }
    }

    return (
            <div className='h-screen w-full flex justify-center flex-col items-center'>
                <Navbar links={linksSGI}/>
                <h2 className='text-[#284B63] text-2xl font-bold mt-[100px]'>Pesquise o arquivo por código ou título</h2>
                <input
                    type="text"
                    placeholder='Digite aqui o título ou código da IT'
                    className='mt-4 w-[400px] border h-[40px] pl-4 focus:outline-none rounded-md text-[#284b63]'
                    value={value}
                    onChange={handleValueChange}
                />
                <div className="flex flex-col h-[300px] mt-12 overflow-y-scroll max-w-[550px] min-w-[550px] rounded-md gap-8">
                    {
                        qaFiles.length > 0 ? qaFiles.map((it: { code: string, title: string, path: string }) => (
                            <div key={it.code} className='flex flex-row w-full min-h-[30px] max-h-[30px] gap-3 justify-between p-2'>
                                <div
                                    onClick={() => viewIT(it.path)}
                                    className='bg-[#284B63] text-white max-w-2/11 flex justify-center items-center h-[45px] rounded-md p-1 cursor-pointer text-sm'>{it.code}</div>
                                <div
                                    onClick={() => viewIT(it.path)}
                                    className='bg-[#d9d9d9] text-[#284B63] w-10/12 flex justify-center items-center h-[45px] rounded-md p-1 cursor-pointer text-sm'>{it.title}</div>
                            </div>
                        )) : <p className='ml-[200px] mt-4 text-[#284B63]'></p>
                    }
                </div>
                <ToastContainer />
            </div>
    )
}

export default SeacrQA