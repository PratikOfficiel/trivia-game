const players = []

const addPlayer = ({id, playerName:name, room}) => {
    
    if(!name || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingPlayer = players.find((player) => {
        return player.room === room && player.name === name
    })

    if(existingPlayer) {
        return {
            error: new Error('Username is in use')
        }
    }

    const newPlayer = {id, name, room}
    players.push(newPlayer)
    return { newPlayer }
}

const getPlayer = (id) => {

    const player = players.find((player)=> {
        return player.id==id
    });

    if (!player) {
        return {
            error: new Error("No player found with given id")
        }
    }

    return { player }
}

const getAllPlayers = (room) => {

    return players.filter((player)=> {
        return player.room === room;
    })
}

const removePlayer = (id) => {

    return players.find((p,idx)=> {

        if (p.id===id) {
            return players.splice(idx,1)[0]
        }

        return false;
    })

}

module.exports = {
    addPlayer,
    getPlayer,
    getAllPlayers,
    removePlayer
}