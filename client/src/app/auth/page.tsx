'use client'

// importação de React e alguns tipos e hooks
import React, { ChangeEvent, useState } from 'react'
// importação do next image
import Image from 'next/image'
// importação do axios (lib para requisições de api)
import axios from 'axios'
// importação das urls padrões aonde host é do lado do client e urlApi é do lado do servidor
import { host, urlAPi } from '@/urlApi'
// importação do container e do toast do react-toastify (lib para exbir notificações)
import { ToastContainer, toast } from 'react-toastify'
// importação do js-cookie (lib para trabalhar com cookies)
import Cookie from 'js-cookie'
// importação do useRouter (para redirecionar para páginas)
import { useRouter } from 'next/navigation'

const Auth = () => {

    // criação dos estados 
    // para armazenar a informação do setor
    const [sector, setSector] = useState<string>('')
    //para armazenar a informação da senha
    const [password, setPassword] = useState<string>('')
    //

    // criando uma váriavel para usar o useRouter
    const router = useRouter()

    // função para fazer checagem de credenciais
    const credentialsCheck = () => {

        // fazendo requisição
        axios.get(`${urlAPi}/auth`, {
            params: {
                password: password,
                sector: sector
            }
        }).then((res) => {
            // se a resposta for positiva
            if (sector === 'QA' || sector === 'qa') {
                // se o setor for QA, deve ser salvo o cokiie do QA e redirecionar para a página do QA
                Cookie.set('key', 'qa')
                router.push(`/qa`)
            } else if (sector === 'SGI' || sector === 'sgi') {
                // se o setor for SGI, deve ser salvo o cokiie do SGI e redirecionar para a página do SGI
                Cookie.set('key', 'sgi')
                router.push(`${host}/sgi/upload-it`)
            } else if (sector === 'ENG' || sector === 'eng') {
                // se o setor for ENG, deve ser salvo o cokiie do ENG e redirecionar para a página do ENG
                Cookie.set('key', 'eng')
                router.push(`/eng/list-upload`)
            } else if (sector === 'PROD' || sector === 'prod') {
                // se o setor for PROD, deve ser salvo o cokiie do PROD e redirecionar para a página do PROD
                Cookie.set('key', 'prod')
                router.push(`${host}/prod/get-pdf`)
            }
        }).catch((err) => {
            // caso ocorra algum erro deve mostrar a mensagem conrespondente.
            toast.error(err.response.data.message)
        })
    }

    return (
        <div className='h-screen w-full flex flex-col justify-center items-center'>
            <ToastContainer />
            <div className="flex flex-col justify-center items-center gap-2  p-8 rounded-lg -m-3 w-[400px] border-2">
                <h1 className='text-3xl font-bold text-[#284B63]'>Bem-vindo ao SnapSteps</h1>
                <Image src={'/s.png'} width={140} height={200} alt='branch' />
                <p className='text-[#284b63] -mt-4'>Insira suas credenciais para avançar</p>
                <div className="flex mt-8 gap-4">
                    <div className="flex flex-col justify-center items-center">
                        <label className='text-[#284b63] font-bold'>SETOR</label>
                        <input
                            type="text"
                            value={sector}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSector(e.target.value)}
                            className='border-2 rounded-md focus:outline-none h-[35px] w-[150px] text-[#284b63] pl-2'
                            placeholder='Digite seu setor aqui'
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label className='text-[#284b63] font-bold'>SENHA</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            className='border-2 rounded-md focus:outline-none h-[35px] w-[150px] text-[#284b63] pl-2'
                            placeholder='Digite sua senha aqui'
                        />
                    </div>
                </div>
                <button
                    onClick={credentialsCheck}
                    className='bg-[#06A77D] text-white p-1 rounded-md ml-[200px] mt-4'
                >
                    Entrar
                </button>
            </div>
        </div>
    )
}

export default Auth