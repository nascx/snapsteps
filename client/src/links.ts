import { host } from "./urlApi"

export const linksQA = [
    {
        label: 'Pesquisar IT',
        url: `${host}/qa`
    },
    {
        label: 'Visualizar IT da produção',
        url: `${host}/qa/get-pdf`
    },
]

export const linksProd = [
    {
        label: 'Baixar lista',
        url: `${host}/prod/get-list`
    },
    {
        label: 'Visualizar IT',
        url: `${host}/prod/get-pdf`
    },
    {
        label: 'Fazer upload de lista',
        url: `${host}/prod/list-upload`
    }
]

export const linksEng = [
    {
        label: 'Incializar lista',
        url: `${host}/eng/list-upload`
    },
    {
        label: 'Visualizar IT',
        url: `${host}/eng/get-pdf`
    },
]

export const linksSGI = [
    {
        label: 'Salvar IT da Produção',
        url: `${host}/sgi/upload-it`
    },
    {
        label: 'Salvar IT do Qualidade',
        url: `${host}/sgi/upload-quality-file`
    },
    {
        label: 'Visualizar IT da produção',
        url: `${host}/sgi/get-pdf`
    },
    {
        label: 'Visualizar IT da Qualidade',
        url: `${host}/sgi/view-it-qa`
    }
]