import Image from 'next/image'
import { ChangeEvent, FormEvent, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import Loading from './Loading'

type UploadProps = {
    name: string,
    img: string,
    descriprion: string,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
    handleSubmit?: (e: FormEvent<HTMLFormElement>) => void
    loading: boolean
}

const Upload = ({ name, img, descriprion, handleChange, handleSubmit, loading }: UploadProps) => {

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center flex-col mt-[100px] w-full h-screen">
            <div className="flex flex-col justify-center items-center shrink-0 mb-7 border-2 border-[#284B63] rounded-lg min-w-[400px] min-h-[250px]">
                <Image src={img} alt='Image' width={150} height={100} className='mb-4' />
                <p className='text-[#284B63] font-bold'>{descriprion}</p>
            </div>
            <label className="block">
                <span className="sr-only">Selecione o arquivo excel</span>
                <input
                    type="file"
                    name={name}
                    onChange={handleChange}
                    className="
                    block w-[500px] h-[44px] text-slate-500 file:cursor-pointer border-2 border-[#284B63] rounded-xl 
                    file:mr-4 file:py-2 
                    file:border-0
                    file:font-bold
                     file:text-white file:bg-[#284B63] file:h-[40px] file:rounded-lg
                     hover:file:bg-[#273550]"
                />
            </label>
            <button
                type='submit'
                className='bg-[#06A77D] text-white ml-64 mt-10 rounded-md cursor-pointer w-[55px] h-[35px] focus:bg-current/65'
            >
                Enviar
            </button>
            <ToastContainer />
            {
                loading && (
                    <Loading />
                )
            }
        </form>
    )
}

export default Upload