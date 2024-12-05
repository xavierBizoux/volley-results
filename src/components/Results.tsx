import { List, ListItem, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Game, Team } from '../utils/types'
import ResultsCard from './ResultsCard'

type Props = {
    games: Game[]
    team: Team
}

const Results = ({ games, team }: Props) => {
    const [filteredData, setFilteredData] = useState<Game[]>(games)
    useEffect(() => {
        if (team && team.id) {
            setFilteredData(
                games.filter(
                    (game: Game) =>
                        (game.team1.id === team.id || game.team2.id === team.id) &&
                        !game.cancelled &&
                        !game.roster &&
                        new Date(game.start_date) < new Date()
                )
            )
        } else {
            setFilteredData(
                games.filter(
                    (game: Game) =>
                        !game.cancelled && !game.roster && new Date(game.start_date) < new Date()
                )
            )
        }
    }, [team, games])

    return (
        <Paper sx={{ mt: 2 }}>
            <Typography
                variant='h4'
                sx={{
                    textAlign: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '5px',
                }}>
                Résultats
            </Typography>
            <List sx={{ width: '100%' }}>
                {filteredData.map((game: Game) => (
                    <ListItem key={game.id}>
                        <ResultsCard game={game} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    )
}

export default Results
