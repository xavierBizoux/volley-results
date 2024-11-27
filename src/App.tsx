import { useEffect, useState } from 'react'

import './App.css'
import Calendar from './components/Calendar'
import CompetitionSelection from './components/CompetitionSelection'
import Ranking from './components/Ranking'
import Results from './components/Results'
import Selection from './components/TeamSelection'
import { Competition, Game, Team } from './utils/types'

function App() {
    const [data, setData] = useState<Game[]>([])
    const [competitionData, setCompetitionData] = useState<Competition[]>([])
    const [selectedCompetition, setSelectedCompetition] = useState<string>('')
    const [lastUpdate, setLastUpdate] = useState<string>('')
    const [teams, setTeams] = useState<Team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<Team['id']>(0)
    useEffect(() => {
        const getCompetition = async (url: string) => {
            const data = await fetch(url).then((res) => res.json())
            data.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
            setCompetitionData(data)
            setSelectedCompetition(data[0].path)
        }
        getCompetition('./data/data.json')
    }, [])
    useEffect(() => {
        const getData = async (url: string) => {
            const data = await fetch(url).then((res) => res.json())
            const teams: Team[] = []
            data.forEach((game: Game) => {
                if (typeof teams[game.team1.id] === 'undefined') {
                    teams[game.team1.id] = game.team1
                }
                if (typeof teams[game.team2.id] === 'undefined') {
                    teams[game.team2.id] = game.team2
                }
            })
            teams.sort((a: Team, b: Team) => a.full_name.localeCompare(b.full_name))
            if (teams.length > 0) {
                const bestTeam = teams.find((team: Team) => team.full_name.includes('Binchois'))
                setSelectedTeam(bestTeam ? bestTeam.id : 0)
            }
            setData(data)
            setTeams(teams)
        }
        getData(selectedCompetition)
        const competition = competitionData.find(
            (competition: Competition) => competition.path === selectedCompetition
        )
        if (competition) {
            const lastUpdate = new Date(competition.last_update).toLocaleDateString('fr-BE', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                timeZone: '+00:00',
            })
            setLastUpdate(lastUpdate)
        }
    }, [selectedCompetition, competitionData])
    return (
        <div className='flex flex-col w-full max-w-full items.center space-y-4'>
            <span className='justify-end text-gray-300'>Dernière mise à jour : {lastUpdate}</span>
            <CompetitionSelection
                data={competitionData}
                defaultValue={selectedCompetition}
                handleSelection={setSelectedCompetition}
            />
            <Ranking data={data} />
            <hr></hr>
            <Selection
                data={teams}
                defaultValue={selectedTeam}
                handleSelection={setSelectedTeam}
            />
            <Results
                data={data}
                filter={selectedTeam}
            />
            <hr></hr>
            <Calendar
                data={data}
                filter={selectedTeam}
            />
        </div>
    )
}

export default App
