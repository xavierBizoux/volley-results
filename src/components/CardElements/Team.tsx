import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { Team as TTeam } from '../../utils/types'

type Props = {
    team: TTeam
    align: 'left' | 'right'
}

const Team = ({ team, align }: Props) => {
    return (
        <>
            {align === 'right' && (
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    alignContent={'center'}>
                    <Typography
                        variant='h6'
                        textAlign={{ xs: 'center', sm: align }}>
                        {team.name + ' ' + team.subname}
                    </Typography>
                </Grid>
            )}
            <Grid
                size={1}
                sx={{ display: { xs: 'none', sm: 'block' } }}
                alignContent={'center'}
                textAlign={'center'}>
                <img
                    src={team.pic}
                    alt={team.full_name}
                    width={'75rem'}
                />
            </Grid>
            {align === 'left' && (
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    alignContent={'center'}>
                    <Typography
                        variant='h6'
                        textAlign={{ xs: 'center', sm: align }}>
                        {team.name + ' ' + team.subname}
                    </Typography>
                </Grid>
            )}
        </>
    )
}

export default Team
