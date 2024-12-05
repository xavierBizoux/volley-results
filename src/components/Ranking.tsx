import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Game, Rank, Team } from '../utils/types'

type Props = {
    games: Game[]
    team: Team
}

const initializeRanking = (team: Team) => {
    return {
        id: team.id,
        name: team.name + ' ' + team.subname,
        points: 0,
        matchPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        setsWon: 0,
        setsLost: 0,
    }
}

const calculatePoints = (game: Game) => {
    let pointsTeam1 = 0
    let pointsTeam2 = 0
    if (game.score1! >= 2) {
        pointsTeam1 = 1
    }
    if (game.score2! >= 2) {
        pointsTeam2 = 1
    }
    if (game.score1! > game.score2!) {
        pointsTeam1 = 3 - pointsTeam2
    } else if (game.score1! < game.score2!) {
        pointsTeam2 = 3 - pointsTeam1
    }
    return { pointsTeam1: pointsTeam1, pointsTeam2: pointsTeam2 }
}

const updateRanking = (record: Rank, teamNumber: 1 | 2, game: Game) => {
    if (teamNumber === 2) {
        game = {
            ...game,
            team1: game.team2,
            team2: game.team1,
            score1: game.score2,
            score2: game.score1,
        }
    }
    const { pointsTeam1, pointsTeam2 } = calculatePoints(game)

    const ranking = {
        ...record,
        points: record.points + pointsTeam1,
        matchPlayed: record.matchPlayed + 1,
        matchesWon: pointsTeam1 > pointsTeam2 ? record.matchesWon + 1 : record.matchesWon,
        matchesLost: pointsTeam1 < pointsTeam2 ? record.matchesLost + 1 : record.matchesLost,
        setsWon: game.score1 ? record.setsWon + game.score1 : record.setsWon,
        setsLost: game.score2 ? record.setsLost + game.score2 : record.setsLost,
    }
    return ranking
}

const Ranking = ({ games, team }: Props) => {
    const ranking = [] as Rank[]
    games.forEach((game) => {
        if (!ranking[game.team1.id]) {
            ranking[game.team1.id] = initializeRanking(game.team1)
        }
        if (!ranking[game.team2.id]) {
            ranking[game.team2.id] = initializeRanking(game.team2)
        }
        if (!game.roster && new Date(game.start_date) < new Date() && !game.cancelled) {
            ranking[game.team1.id] = updateRanking(ranking[game.team1.id], 1, game)
            ranking[game.team2.id] = updateRanking(ranking[game.team2.id], 2, game)
        }
    })
    ranking.sort((a: Rank, b: Rank) => {
        if (a.points < b.points) {
            return 1
        }
        if (a.points > b.points) {
            return -1
        }
        const aRatio = a.setsWon / a.setsLost
        const bRatio = b.setsWon / b.setsLost
        if (aRatio < bRatio) {
            return 1
        }
        if (aRatio > bRatio) {
            return -1
        }
        return 0
    })

    return (
        <Grid
            container
            spacing={1}>
            <Grid
                container
                size={12}>
                <Grid size={1}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, textAlign: 'center' }}>
                        #
                    </Typography>
                </Grid>
                <Grid
                    size={{ xs: 7, sm: 4 }}
                    sx={{ textAlign: 'center' }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        Equipe
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ textAlign: 'center' }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        Pts
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ textAlign: 'center' }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        MJ
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ textAlign: 'center' }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        MG
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ textAlign: 'center' }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        MP
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        SG
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        SP
                    </Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        R
                    </Typography>
                </Grid>
            </Grid>
            {ranking &&
                ranking.map((rank: Rank, index: number) => {
                    return (
                        <Grid
                            container
                            key={rank.id}
                            sx={{
                                borderColor: rank.id === team.id ? 'primary.light' : '',
                                borderStyle: rank.id === team.id ? 'solid' : '',
                                borderWidth: rank.id === team.id ? '1px' : '',
                            }}
                            size={12}>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center' }}>
                                {index + 1}
                            </Grid>
                            <Grid size={{ xs: 7, sm: 4 }}>{rank.name}</Grid>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center' }}>
                                {rank.points}
                            </Grid>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center' }}>
                                {rank.matchPlayed}
                            </Grid>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center' }}>
                                {rank.matchesWon}
                            </Grid>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center' }}>
                                {rank.matchesLost}
                            </Grid>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
                                {rank.setsWon.toString()}
                            </Grid>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
                                {rank.setsLost.toString()}
                            </Grid>
                            <Grid
                                size={1}
                                sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
                                {(rank.setsWon / rank.setsLost).toFixed(4).toString()}
                            </Grid>
                        </Grid>
                    )
                })}
        </Grid>
    )
}

export default Ranking
