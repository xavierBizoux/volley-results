import { Box, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import Calendar from './components/Calendar'
import Ranking from './components/Ranking.tsx'
import Results from './components/Results'
import Selection, { Option } from './components/Selection'
import { Competition, Game, Team } from './utils/types'

const listTeams = (data: Game[]) => {
    const teams: Team[] = []
    let bestTeam: Team = {} as Team
    data.forEach((game: Game) => {
        if (typeof teams[game.team1.id] === 'undefined') {
            teams[game.team1.id] = game.team1
        }
        if (typeof teams[game.team2.id] === 'undefined') {
            teams[game.team2.id] = game.team2
        }
        if (game.team1.full_name.includes('Binchois')) {
            bestTeam = game.team1
        }
        if (game.team2.full_name.includes('Binchois')) {
            bestTeam = game.team2
        }
    })
    teams.sort((a: Team, b: Team) => a.full_name.localeCompare(b.full_name))
    return { teams: teams, bestTeam: bestTeam }
}

const App = () => {
    const [games, setGames] = useState<Game[]>([])
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [selectedCompetition, setSelectedCompetition] = useState<Option>({} as Option)
    const [competitionOptions, setCompetitionOptions] = useState<Option[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<Option>({} as Option)
    const [teamOptions, setTeamOptions] = useState<Option[]>([])
    const [lastUpdate, setLastUpdate] = useState<string>('')

    useEffect(() => {
        const getCompetitions = async (url: string) => {
            const competitions = await fetch(url).then((res) => res.json())
            competitions.sort((a: { name: string }, b: { name: string }) =>
                a.name.localeCompare(b.name)
            )
            setCompetitions(competitions)
            const options = competitions.map(
                (competition: Competition) =>
                    ({
                        label: competition.name,
                        value: competition.path,
                    } as Option)
            )
            setCompetitionOptions(options)
            setSelectedCompetition(options[0])
        }
        getCompetitions('./data/data.json')
    }, [])
    useEffect(() => {
        const getGames = async (competition: Option) => {
            const games = await fetch(competition.value).then((res) => res.json())
            setGames(games)
            const { teams, bestTeam } = listTeams(games)
            setTeams(teams)
            const options = teams.map(
                (team: Team) =>
                    ({
                        label: team.name + ' ' + team.subname,
                        value: team.id.toString(),
                    } as Option)
            )
            setTeamOptions(options)
            setSelectedTeam(
                options.find((option: Option) => option.value === bestTeam.id.toString())!
            )
        }
        if (selectedCompetition.value) {
            getGames(selectedCompetition)
            const competition = competitions.find(
                (competition: Competition) => competition.path === selectedCompetition.value
            )
            if (competition) {
                const lastUpdate = new Date(competition.last_update).toLocaleDateString('fr-BE', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Brussels',
                })
                setLastUpdate(lastUpdate)
            }
        }
    }, [selectedCompetition, competitions])
    return (
        <Container maxWidth='lg'>
            <Box>
                <Typography
                    variant='body2'
                    sx={{ textAlign: 'right' }}>
                    Dernière mise à jour : {lastUpdate}
                </Typography>
            </Box>
            <Grid
                container
                width='100%'
                spacing={1}
                sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                }}>
                {competitionOptions.length > 0 && selectedCompetition && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Selection
                            data={competitionOptions}
                            defaultValue={selectedCompetition.value}
                            handleSelection={setSelectedCompetition}
                        />
                    </Grid>
                )}
                {teamOptions.length > 0 && selectedTeam && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Selection
                            data={teamOptions}
                            defaultValue={selectedTeam.value}
                            handleSelection={setSelectedTeam}
                        />
                    </Grid>
                )}
            </Grid>
            <Ranking
                games={games}
                team={teams.find((team: Team) => team.id === parseInt(selectedTeam.value))!}
            />
            <Results
                games={games}
                team={teams.find((team: Team) => team.id === parseInt(selectedTeam.value))!}
            />
            <Calendar
                games={games}
                team={teams.find((team: Team) => team.id === parseInt(selectedTeam.value))!}
            />
        </Container>
    )
}

export default App
