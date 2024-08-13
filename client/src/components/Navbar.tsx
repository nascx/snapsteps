import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type NavbarProps = {
    links: { label: string, url: string }[],
}

const Navbar = ({ links }: NavbarProps) => {

    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.href);
        }
    }, [currentPath]);

    return (
        <nav className="flex items-center justify-between p-4 h-[60px] w-full">
            <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer h-[60px]">
                <span className="font-semibold text-2xl text-[#284B63] tracking-tight">Snap</span>
                <span className="font-semibold text-2xl text-[#06A77D] tracking-tight">Steps</span>
            </div>
            <div className="flex items-center justify-between">
                <ul className="text-md lg:flex-grow w-full flex flex-row gap-6 text-xl font-semibold text-[#284B63]">
                    {
                        links.map((link: { label: string, url: string }) => (
                            <li key={link.url}>
                                <Link
                                    href={link.url}
                                    className={`h-[60px] flex justify-center items-center focus:text-[#06a77d]  ${currentPath === link.url ? 'text-[#06a77d]' : 'text-[#284B63]'}`}>
                                    {link.label}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Navbar