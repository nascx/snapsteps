import { host } from "./urlApi"

export const linksQA = [
    {
        label: 'Visualizar IT da Qualidade',
        url: `${host}/qa`
    },
    {
        label: 'Visualizar IT da Produção',
        url: `${host}/qa/get-pdf`
    },
    
]

export const linksProd = [
    {
        label: 'Baixar lista',
        url: `${host}/prod/get-list`
    },
    {
        label: 'Visualizar IT da Produção',
        url: `${host}/prod/get-pdf`
    },
    {
        label: 'Fazer upload de lista',
        url: `${host}/prod/list-upload`
    },
    {
        label: 'Visualizar IT original',
        url: `${host}/prod/original-it`
    },
]

export const linksEng = [
    {
        label: 'Incializar lista',
        url: `${host}/eng/list-upload`
    },
    {
        label: 'Visualizar IT da Produção',
        url: `${host}/eng/get-pdf`
    },
]

export const linksSGI = [
    {
        label: 'Salvar IT da Produção',
        url: `${host}/sgi/upload-it`
    },
    {
        label: 'Salvar IT da Qualidade',
        url: `${host}/sgi/upload-quality-file`
    },
    {
        label: 'Visualizar IT da Produção',
        url: `${host}/sgi/get-pdf`
    },
    {
        label: 'Visualizar IT da Qualidade',
        url: `${host}/sgi/view-it-qa`
    }
]