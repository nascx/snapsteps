import React, { ChangeEvent, useState } from 'react'

type SearchQualityFilesButtonProps = {
    description: string
    value: string,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const SearchQualityFilesButton = ({ description, value, handleChange }: SearchQualityFilesButtonProps) => {

    const [on, setOn] = useState<boolean>(false)

    return (
        <div className="flex justify-center items-center gap-2">
            <button className={`bg-[#${on ? '#06A77D' : '#284B63'}] text-white p-1 rounded-[5px]`}>{description}</button>
            {
                on && (
                    <input
                        type="text"
                        className='focus:outline-none p-2 border-2 h-[35px] rounded-[5px]'
                        value={value}
                        onChange={handleChange}
                    />
                )
            }
        </div>
    )
}

export default SearchQualityFilesButton