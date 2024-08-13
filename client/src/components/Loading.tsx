
import React from 'react'

import { RotatingLines } from 'react-loader-spinner'

const Loading = () => {
    return (
        <div className="absolute ml-[900px] mb-[400px]">
            <div className="flex flex-col w-[200px] h-[200px] justify-center items-center gap-2 bg-white">
                <p className='text-[#06A77D]'>Carregando arquivo...</p>
                <RotatingLines
                    visible={true}
                    width="96"
                    strokeWidth="5"
                    animationDuration="0.15"
                    ariaLabel="rotating-lines-loading"
                />
            </div>
        </div>
    )
}

export default Loading