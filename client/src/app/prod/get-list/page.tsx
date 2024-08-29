'use client'

import { urlAPi } from '@/urlApi'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select'
import saveAs from 'file-saver'
import { ToastContainer, toast } from 'react-toastify'
import Navbar from '@/components/Navbar'
import { linksProd } from '@/links'

const GetList = () => {

    const [modelOptions, setModelOptions] = useState()
    const [productOptions, setProductOptions] = useState()
    const [lineOptions, setLineOtions] = useState()

    const [model, setModel] = useState<any>()
    const handleModelChange = (e: string) => {
        setModel(e)
    }

    const [product, setProduct] = useState<any>()
    const handleProductChange = (e: string) => {
        setProduct(e)
    }

    const [line, setLine] = useState<any>()
    const handleLineChange = (e: string) => {
        setLine(e)
    }

    useEffect(() => {
        axios.get(`${urlAPi}/get-model-and-product-options`).then((res) => {
            const models = res.data.models
            const products = res.data.products
            const lines = res.data.lines
            setModelOptions(models)
            setProductOptions(products)
            setLineOtions(lines)
        })
    }, [])

    const downloadList = async () => {
        try {
            await axios.get(`${urlAPi}/prod/download-list`, {
                responseType: 'blob',
                params: {
                    model: model.value,
                    product: product.value,
                    line: line.value
                },
            }).then((res) => {
                const blob = new Blob([res.data]);
                console.log(res.headers['content-type'])
                saveAs(blob, `${res.headers['content-type']}.xlsx`);
            })
        } catch (err) {
            toast.error('Erro ao selecionar lista com esses parâmetros')
            console.log("Erro: ", err)
        }
    }

    return (
        <div className='h-screen w-full flex flex-col items-center justify-center'>
            <Navbar links={linksProd} />
            <h2 className='text-2xl text-[#284B63] font-bold'>
                Escolha as informações da lista que deseja editar
            </h2>
            <div className="flex mt-[100px] gap-4">
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
                onClick={downloadList}
            >
                Baixar lista
            </button>
            <ToastContainer />
        </div>
    )
}

export default GetList