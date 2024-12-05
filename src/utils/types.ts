export type Rank = {
    id: number
    name: string
    points: number
    matchPlayed: number
    matchesWon: number
    matchesLost: number
    setsWon: number
    setsLost: number
}

export type Club = {
    id: number
}

export type Facility = {
    id: number
    club: Club
    name: string
    facility_type: {
        id: number
    }
    venue_address: string
    venue_city: string
    venue_zip: string
    venue_country: {
        name: string
        id: number
    }
    lat: string
    lng: string
    public: boolean
}

export type Team = {
    pic: string
    pic_s: string
    pic_b: string
    season_type_id: number
    full_name: string
    ismain: boolean
    id: number
    name: string
    sport: {
        name: string
        season_type_id: number
        id: number
    }
    subname: string
    category: {
        name: string
        translate: string
        id: number
    }
    gender: number
    country: {
        name: string
        id: number
    }
    is_official: boolean
}

export type Championship = {
    season_type_id: number
    id: number
    sport: {
        name: string
        season_type_id: number
        id: number
    }
    name: string
    country: {
        name: string
        id: number
    }
    category: {
        name: string
        translate: string
        id: number
    }
}

export type Game = {
    invited: boolean
    id: number
    start_date: string
    club: Club
    cancelled: boolean
    facility: Facility
    roster: false
    team1: Team
    team2: Team
    score1?: number
    score2?: number
    competition: Competition
    phase: {
        id: number
        name: string
        type: string
    }
    duration?: number
}

export type Competition = { path: string; name: string; last_update: string }
