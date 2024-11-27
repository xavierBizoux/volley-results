import { useEffect, useState } from 'react'
import { Game, Team } from '../utils/types'

type Props = {
    data: Game[]
    filter: Team['id']
}

const CalendarCard = ({ game }: { game: Game }) => {
    const date = new Date(game.start_date).toLocaleDateString('fr-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: '+00:00',
    })
    return (
        <div className='flex flex-col items-center justify-between w-full rounded-lg mt-2 p-4 border-blue-500 border space-y-4'>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row justify-start items-center text-xl w-2/5 gap-4'>
                    <img
                        src={game.team1.pic}
                        alt={game.team1.full_name}
                        className='object-scale-down w-10 h-10 max-w-10 max-h-10 hidden lg:block'
                    />
                    <span>{game.team1.full_name}</span>
                </div>
                <div className='flex flex-row items-center justify-center text-xl w-1/5 hidden lg:block'>
                    {date.charAt(0).toUpperCase() + date.slice(1)}
                </div>
                <div className='flex flex-row items-center justify-center text-xl w-1/5 block lg:hidden'>
                    vs
                </div>
                <div className='flex flex-row items-center justify-end text-xl w-2/5 gap-4 '>
                    <span>{game.team2.full_name}</span>
                    <img
                        src={game.team2.pic}
                        alt={game.team2.full_name}
                        className='object-scale-down w-10 h-10 max-w-10 max-h-10 hidden lg:block'
                    />
                </div>
            </div>
            <div className='items-center justify-center text-xl w-full block lg:hidden'>
                {date.charAt(0).toUpperCase() + date.slice(1)}
            </div>
            <div className='flex flex-col w-full text-sm border-top border-blue-500'>
                <span>{game.facility.name}</span>
                <span> {game.facility.venue_address}</span>
                <span> {game.facility.venue_zip + ' ' + game.facility.venue_city}</span>
                <span> {'Lat: ' + game.facility.lat + ', Lng: ' + game.facility.lng}</span>
            </div>
        </div>
    )
}
const Calendar = ({ data, filter }: Props) => {
    const [filteredData, setFilteredData] = useState<Game[]>(data)
    useEffect(() => {
        if (filter && filter !== 0) {
            setFilteredData(
                data.filter(
                    (game: Game) =>
                        (game.team1.id === filter || game.team2.id === filter) &&
                        !game.cancelled &&
                        new Date(game.start_date) > new Date()
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
        <div>
            <h2 className='bg-blue-500 text-white text-xl font-bold p-4 rounded'>Matchs à venir</h2>
            <ul className='flex flex-col w-full gap-2'>
                {filteredData &&
                    filteredData.map((game: Game) => {
                        return (
                            <li
                                key={game.id}
                                className='flex justify-between'>
                                <CalendarCard game={game} />
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}

export default Calendar
