import React, { SetStateAction } from 'react'

type GenericInputProps = {
    label: string,
    value?: string,
    setValue?: React.Dispatch<SetStateAction<string>>
    styleContainer?: string,
    styleLabel?: string,
    styleInput?: string,
    disabled?: boolean
}

const GenericInput = ({label, value, setValue, styleContainer, styleInput, styleLabel, disabled} : GenericInputProps) => {
    return (
        <div className="flex flex-col justify-center items-center ">
            <label>{label}</label>
            <input type="text" className='focus:outline-none p-1 rounded-md border-2' disabled={disabled}/>
        </div>
    )
}

export default GenericInput