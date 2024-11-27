import { useEffect, useState } from 'react'

type Props = {
    data: { path: string; name: string }[]
    defaultValue: string
    handleSelection: React.Dispatch<React.SetStateAction<string>>
}
const CompetitionSelection = ({ data, defaultValue, handleSelection }: Props) => {
    const [selected, setSelected] = useState<string>()
    useEffect(() => {
        data.forEach((competition: { path: string; name: string }) => {
            if (competition.name === defaultValue) {
                setSelected(competition.path)
            }
        })
    }, [defaultValue, data])
    data.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
    return (
        <select
            id='competitionSelection'
            value={selected}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded'
            onChange={(event) => {
                setSelected(event.target.value)
                handleSelection(event.target.value)
            }}>
            {data &&
                data.map((competition: { path: string; name: string }) => {
                    return (
                        <option
                            key={competition.path}
                            value={competition.path}>
                            {competition.name}
                        </option>
                    )
                })}
        </select>
    )
}

export default CompetitionSelection
