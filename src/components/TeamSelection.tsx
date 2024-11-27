import { useEffect, useState } from 'react'
import { Team } from '../utils/types'

type Props = {
    data: Team[]
    defaultValue: Team['id']
    handleSelection: React.Dispatch<React.SetStateAction<Team['id']>>
}
const TeamSelection = ({ data, defaultValue, handleSelection }: Props) => {
    const [selected, setSelected] = useState<Team['id']>()
    useEffect(() => {
        setSelected(defaultValue)
    }, [defaultValue])
    return (
        <select
            id='teamSelection'
            value={selected}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded'
            onChange={(event) => {
                setSelected(parseInt(event.target.value))
                handleSelection(parseInt(event.target.value))
            }}>
            <option
                key={0}
                value={0}>
                Toutes les équipes
            </option>
            {data &&
                data.map((team: Team) => {
                    return (
                        <option
                            key={team.id}
                            value={team.id}>
                            {team.full_name}
                        </option>
                    )
                })}
        </select>
    )
}

export default TeamSelection
