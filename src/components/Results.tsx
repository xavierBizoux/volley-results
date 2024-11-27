import { useEffect, useState } from 'react'
import { Game, Team } from '../utils/types'

type Props = {
    data: Game[]
    filter: Team['id']
}
const Results = ({ data, filter }: Props) => {
    const [filteredData, setFilteredData] = useState<Game[]>(data)
    useEffect(() => {
        if (filter && filter !== 0) {
            setFilteredData(
                data.filter(
                    (game: Game) =>
                        (game.team1.id === filter || game.team2.id === filter) &&
                        !game.cancelled &&
                        !game.roster &&
                        new Date(game.start_date) < new Date()
                )
            )
        } else {
            setFilteredData(
                data.filter(
                    (game: Game) =>
                        !game.cancelled && !game.roster && new Date(game.start_date) < new Date()
                )
            )
        }
    }, [filter, data])
    return (
        <ul className='flex flex-col w-full gap-2'>
            {filteredData &&
                filteredData.map((game: Game) => {
                    return (
                        <li
                            key={game.id}
                            className='flex justify-between'>
                            <div className='flex flex-row w-full'>
                                <div className='flex flex-row justify-start items-center text-xl w-2/5 gap-4'>
                                    <img
                                        src={game.team1.pic}
                                        alt={game.team1.full_name}
                                        className='object-scale-down w-10 h-10 max-w-10 max-h-10'
                                    />
                                    <span>{game.team1.full_name}</span>
                                </div>
                                <div className='flex flex-row items-center justify-center text-xl w-1/5'>
                                    {game.score1} - {game.score2}
                                </div>
                                <div className='flex flex-row items-center justify-end text-xl w-2/5 gap-4 '>
                                    <span>{game.team2.full_name}</span>
                                    <img
                                        src={game.team2.pic}
                                        alt={game.team2.full_name}
                                        className=' object-scale-down w-10 h-10 max-w-10 max-h-10'
                                    />
                                </div>
                            </div>
                        </li>
                    )
                })}
        </ul>
    )
}

export default Results
