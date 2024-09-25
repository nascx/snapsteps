'use client'

import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select'
import axios from 'axios'
import { urlAPi } from '@/urlApi'
import { ToastContainer, toast } from 'react-toastify'
import Navbar from '../../../components/Navbar'
import { linksProd, linksSGI } from '@/links'
import Loading from '@/components/Loading'

const GetPDF = () => {

    const [loading, setLoading] = useState<boolean>(false)

    const [modelOptions, setModelOptions] = useState<any>()
    const [productOptions, setProductOptions] = useState<any>()

    const [model, setModel] = useState<any>({ label: 'Selecione o modelo', value: '' })

    const handleModelChange = async (e: { label: string, value: string }) => {
        setModel(e)
        setLine({ label: 'Selecione a linha', value: '' })
        setProduct({ label: 'Selecione o produto/processo' })
        setLineOptions([])
        setProductOptions([])
        await axios.get(`${urlAPi}/options/products`, {
            params: {
                model: e.value
            }
        }).then((res) => {
            const products = res.data
            setProductOptions(products)
        })
    }

    const [lineOptions, setLineOptions] = useState<any>()
    const [line, setLine] = useState<any>({ label: 'Selecione a linha', value: '' })
    const handleLineChange = (e: string) => {
        setLine(e)
    }

    const [product, setProduct] = useState<any>({ label: 'Selecione o produto/processo', value: '' })

    const handleProductChange = async (e: { label: string, value: string }) => {
        setProduct(e)
        setLine({ label: 'Selecione a linha', value: '' })
        setLineOptions([])
        await axios.get(`${urlAPi}/options/lines`, {
            params: {
                model: model.value,
                product: e.value
            }
        }).then((res) => {
            const lines = res.data
            setLineOptions(lines)
        })
    }


    useEffect(() => {
        axios.get(`${urlAPi}/options/models`).then((res) => {
            const models = res.data
            setModelOptions(models)
        })
    }, [])

    const viewIT = async () => {
        if (model.value !== '' && product.value !== '' && line.value !== '') {
            setLoading(true)
            await axios.get(`${urlAPi}/prod/get-production-it`, {
                responseType: 'arraybuffer',
                params: {
                    model: model.value,
                    product: product.value,
                    line: line.value
                } // Importante para obter a resposta como ArrayBuffer
            }).then((res) => {
                const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                // Cria uma URL temporária para o Blob
                const pdfUrl = URL.createObjectURL(pdfBlob);

                // Abre o PDF em uma nova aba
                window.open(pdfUrl);
                setLoading(false)
            }).catch((err) => {
                setLoading(false)
                console.log("Erro: ", err)
                toast.error('Erro ao obter a IT. Verifique se a lista está correta!')
            })
        } else {
            toast.error('Preencha todos os campos!')
        }
    }

    return (
        <div className='h-screen w-full flex justify-center items-center flex-col'>
            <Navbar links={linksSGI} />
            <h1 className='text-[#284B63] text-2xl mt-[120px]'>
                Olá, selecione as opções para que seja exibida as sua instrução de trabalho
            </h1>
            <div className="flex mt-[80px] gap-4">
                <AsyncSelect
                    options={modelOptions}
                    className='rounded-md min-w-[200px] text-[#284b63]'
                    value={model}
                    onChange={handleModelChange}
                    placeholder='Selecione o modelo'
                />
                <AsyncSelect
                    options={productOptions}
                    className='rounded-md min-w-[200px] text-[#284b63]'
                    value={product}
                    onChange={handleProductChange}
                    placeholder='Selecione o processo'
                />
                <AsyncSelect
                    options={lineOptions}
                    className='rounded-md min-w-[200px] text-[#284b63]'
                    value={line}
                    onChange={handleLineChange}
                    placeholder='Selecione o número da linha'
                />
            </div>
            <button
                className='bg-[#06A77D] text-white rounded-md h-[30px] w-[80px] mt-[100px] ml-[400px] focus:bg-current/80'
                onClick={viewIT}
            >
                Visualizar IT
            </button>
            {
                loading && (
                    <Loading />
                )
            }
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default GetPDF