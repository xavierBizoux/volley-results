import { Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Game } from '../utils/types'
import Team from './CardElements/Team'

type Props = {
    game: Game
}
const ResultsCard = ({ game }: Props) => {
    return (
        <Paper sx={{ width: '100%' }}>
            <Grid
                container
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                key={game.id}>
                <Team
                    team={game.team1}
                    align='left'
                />
                <Grid
                    size={{ xs: 12, sm: 2 }}
                    alignContent={'center'}>
                    <Typography
                        variant='h6'
                        textAlign='center'>
                        {game.score1} - {game.score2}
                    </Typography>
                </Grid>
                <Team
                    team={game.team2}
                    align='right'
                />
            </Grid>
        </Paper>
    )
}

export default ResultsCard
