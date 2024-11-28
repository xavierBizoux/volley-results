import { Game, Rank, Team } from '../utils/types'

type Props = {
    data: Game[]
}

const initializeRanking = (team: Team) => {
    return {
        id: team.id,
        name: team.full_name,
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
        setsWon: record.setsWon + game.score1!,
        setsLost: record.setsLost + game.score2!,
    }
    return ranking
}

const Ranking = ({ data }: Props) => {
    const ranking = [] as Rank[]
    data.forEach((game: Game) => {
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
        <>
            <div className='flex flex-col w-full min-w-full text-l'>
                <div className='flex flex-row w-full'>
                    <div className='w-1/12'>#</div>
                    <div className='flex justify-center w-7/12 sm:w-4/12'>Equipe</div>
                    <div className='w-1/12'>Pts</div>
                    <div className='w-1/12'>MJ</div>
                    <div className='w-1/12'>MG</div>
                    <div className='w-1/12'>MP</div>
                    <div className='w-1/12 hidden sm:block'>SG</div>
                    <div className='w-1/12 hidden sm:block'>SP</div>
                    <div className='w-1/12 hidden sm:block'>R</div>
                </div>
                {ranking &&
                    ranking.map((rank: Rank, index: number) => {
                        return (
                            <div
                                key={rank.id}
                                className='flex flex-row'>
                                <div className='w-1/12'>{index + 1}</div>
                                <div className='flex w-7/12 sm:w-4/12 justify-start'>
                                    {rank.name}
                                </div>
                                <div className='w-1/12'>{rank.points}</div>
                                <div className='w-1/12'>{rank.matchPlayed}</div>
                                <div className='w-1/12'>{rank.matchesWon}</div>
                                <div className='w-1/12'>{rank.matchesLost}</div>
                                <div className='w-1/12 hidden sm:block'>
                                    {rank.setsWon.toString()}
                                </div>
                                <div className='w-1/12 hidden sm:block'>
                                    {rank.setsLost.toString()}
                                </div>
                                <div className='w-1/12 hidden sm:block'>
                                    {(rank.setsWon / rank.setsLost).toFixed(4).toString()}
                                </div>
                            </div>
                        )
                    })}
            </div>
            <span className='text-xs text-gray-300'>
                Légende: Pts = Points, MJ = Matchs Joué, MP = Matchs Perdus, SG = Sets Gagné, SP =
                Sets Perdus, R = Ratio
            </span>
        </>
    )
}

export default Ranking
