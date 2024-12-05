import { Box, Divider, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Game } from '../utils/types'
import Team from './CardElements/Team'

type Props = {
    game: Game
}

const CalendarCard = ({ game }: Props) => {
    const matchDate = new Date(game.start_date)
    const reserveDate = new Date(matchDate.getTime() - 90 * 60 * 1000)
    let matchDateStr = matchDate.toLocaleDateString('fr-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        timeZone: '+00:00',
    })
    matchDateStr = matchDateStr.charAt(0).toUpperCase() + matchDateStr.slice(1)
    const matchTimeStr = matchDate.toLocaleTimeString('fr-BE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: '+00:00',
    })
    const reserveTimeStr = reserveDate.toLocaleTimeString('fr-BE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: '+00:00',
    })
    const wazeURL = `https://waze.com/ul?ll=${game.facility.lat}%2C${game.facility.lng}&navigate=yes&zoom=17`

    return (
        <Paper sx={{ width: '100%' }}>
            <Grid
                container
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                key={game.id}>
                <Team
                    team={game.team1}
                    align={'left'}
                />
                <Grid
                    size={{ xs: 12, sm: 2 }}
                    alignContent={'center'}>
                    <Typography sx={{ textAlign: 'center' }}>{matchDateStr}</Typography>
                    <Typography sx={{ textAlign: 'center' }}>
                        {matchTimeStr} (R: {reserveTimeStr})
                    </Typography>
                </Grid>
                <Team
                    team={game.team2}
                    align={'right'}
                />
            </Grid>
            <Divider variant='middle' />
            <Box>
                <a
                    href={wazeURL}
                    target='_blank'
                    rel='noreferrer'>
                    <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {game.facility.name}
                    </Typography>
                    <Typography sx={{ textAlign: 'center' }}>
                        {game.facility.venue_address}
                    </Typography>
                    <Typography sx={{ textAlign: 'center' }}>
                        {game.facility.venue_zip + ' ' + game.facility.venue_city}
                    </Typography>
                </a>
            </Box>
        </Paper>
    )
}

export default CalendarCard
