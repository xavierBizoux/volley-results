import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Game, Team } from '../utils/types'
import CalendarCard from './CalendarCard'

type Props = {
    games: Game[]
    team: Team
}
const Calendar = ({ games, team }: Props) => {
    const [filteredData, setFilteredData] = useState<Game[]>(games)
    useEffect(() => {
        if (team && team.id) {
            setFilteredData(
                games.filter(
                    (game: Game) =>
                        (game.team1.id === team.id || game.team2.id === team.id) &&
                        !game.cancelled &&
                        new Date(game.start_date) > new Date()
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
        <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />}
                sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography
                    variant='h6'
                    sx={{
                        textAlign: 'center',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: '5px',
                    }}>
                    Matchs à venir
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List sx={{ width: '100%' }}>
                    {filteredData.map((game: Game) => (
                        <ListItem key={game.id}>
                            <CalendarCard game={game} />
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}

export default Calendar
