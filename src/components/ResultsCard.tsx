import { Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Game } from '../utils/types'

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
                <Grid
                    size={1}
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    alignContent={'center'}
                    textAlign={'center'}>
                    <img
                        src={game.team1.pic}
                        alt={game.team1.full_name}
                        width={'75rem'}
                    />
                </Grid>
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    alignContent={'center'}>
                    <Typography
                        variant='h6'
                        textAlign={{ xs: 'center', sm: 'left' }}>
                        {game.team1.name + ' ' + game.team1.subname}
                    </Typography>
                </Grid>
                <Grid
                    size={{ xs: 12, sm: 2 }}
                    alignContent={'center'}>
                    <Typography
                        variant='h6'
                        textAlign='center'>
                        {game.score1} - {game.score2}
                    </Typography>
                </Grid>
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    alignContent={'center'}>
                    <Typography
                        variant='h6'
                        textAlign={{ xs: 'center', sm: 'right' }}>
                        {game.team2.name + ' ' + game.team2.subname}
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    alignContent={'center'}
                    textAlign={'center'}>
                    <img
                        src={game.team2.pic}
                        alt={game.team2.full_name}
                        width={'75rem'}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ResultsCard
