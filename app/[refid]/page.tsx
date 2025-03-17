import React from 'react'

interface Props {
    params: {
        refid: string
    }
}

const page = ({ params }: Props) => {
    return (
        <div>page {params.refid}</div>
    )
}

export default page