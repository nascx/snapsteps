'use client'

import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select'
import axios from 'axios'
import { urlAPi } from '@/urlApi'
import { ToastContainer, toast } from 'react-toastify'
import Loading from '@/components/Loading'

const postsOptions = [
    { label: '0', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' },
    { label: '32', value: '32' },
    { label: '33', value: '33' },
    { label: '34', value: '34' },
    { label: '35', value: '35' },
    { label: '36', value: '36' },
    { label: '37', value: '37' },
    { label: '38', value: '38' },
    { label: '39', value: '39' },
    { label: '40', value: '40' },
    { label: '41', value: '41' },
    { label: '42', value: '42' },
    { label: '43', value: '43' },
    { label: '44', value: '44' },
    { label: '45', value: '45' },
    { label: '46', value: '46' },
    { label: '47', value: '47' },
    { label: '48', value: '48' },
    { label: '49', value: '49' },
    { label: '50', value: '50' },
    { label: '51', value: '51' },
    { label: '52', value: '52' },
    { label: '53', value: '53' },
    { label: '54', value: '54' },
    { label: '55', value: '55' },
    { label: '56', value: '56' },
    { label: '57', value: '57' },
    { label: '58', value: '58' },
    { label: '59', value: '59' },
    { label: '60', value: '60' },
    { label: '61', value: '61' },
    { label: '62', value: '62' },
    { label: '63', value: '63' },
    { label: '64', value: '64' },
    { label: '65', value: '65' },
    { label: '66', value: '66' },
    { label: '67', value: '67' },
    { label: '68', value: '68' },
    { label: '69', value: '69' },
    { label: '70', value: '70' },
    { label: '71', value: '71' },
    { label: '72', value: '72' },
    { label: '73', value: '73' },
    { label: '74', value: '74' },
    { label: '75', value: '75' },
    { label: '76', value: '76' },
    { label: '77', value: '77' },
    { label: '78', value: '78' },
    { label: '79', value: '79' },
    { label: '80', value: '80' },
    { label: '81', value: '81' },
    { label: '82', value: '82' },
    { label: '83', value: '83' },
    { label: '84', value: '84' },
    { label: '85', value: '85' },
    { label: '86', value: '86' },
    { label: '87', value: '87' },
    { label: '88', value: '88' },
    { label: '89', value: '89' },
    { label: '90', value: '90' },
    { label: '91', value: '91' },
    { label: '92', value: '92' },
    { label: '93', value: '93' },
    { label: '94', value: '94' },
    { label: '95', value: '95' },
    { label: '96', value: '96' },
    { label: '97', value: '97' },
    { label: '98', value: '98' },
    { label: '99', value: '99' },
    { label: '100', value: '100' },
];

const GetPDF = () => {
    const [post, setPost] = useState<any>({label: 'Selecione o posto', value: ''})
    const handlePostChange = (e: string) => {
        setPost(e)
    }
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
        setPost({label: 'Selecione o posto', value: ''})
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
        setPost({label: 'Selecione o posto', value: ''})
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
        if (model.value !== '' && product.value !== '' && line.value !== '' && post.value !== '') {
            setLoading(true)
            await axios.get(`${urlAPi}/pdf-by-post`, {
                responseType: 'arraybuffer',
                params: {
                    model: model.value,
                    product: product.value,
                    line: line.value,
                    post: post.value
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
                toast.error('Erro ao obter a lista, verifique se os parâmetros estão corretos ou se a IT usada já está no banco de dados!')
            })
        } else {
            toast.error('Preencha todos os campos!')
        }
    }

    return (
        <div className='h-screen w-full flex justify-center items-center flex-col'>
            <h2 className='text-[#284B63] text-4xl font-bold mb-2'>
                Olá, Bem-vindo ao IT@
            </h2>
            <h2 className='text-[#284B63] text-2xl'>
                Selecione as opções para que seja exibida as suas instruções de trabalho
            </h2>
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
                <AsyncSelect
                    options={postsOptions}
                    className='rounded-md min-w-[200px] text-[#284b63]'
                    value={post}
                    onChange={handlePostChange}
                    placeholder='Selecione o posto'
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