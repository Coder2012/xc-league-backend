
module.exports = {
    full: function(result) {
        return {
            count: result.docs.length,
            flights: result.docs.map(doc => {
                let { _id,
                    identifier,
                    pilot,
                    title,
                    club,
                    glider,
                    date,
                    start,
                    finish,
                    duration,
                    takeoff,
                    landing,
                    total,
                    multiplier,
                    score,
                    maxHeight,
                    lowHeight,
                    takeoffHeight,
                    maxClimb,
                    minClimb,
                    maxSpeed,
                    avgSpeedCourse,
                    link,
                } = doc;
    
                return {
                    _id,
                    identifier,
                    pilot,
                    title,
                    club,
                    glider,
                    date,
                    start,
                    finish,
                    duration,
                    takeoff,
                    landing,
                    total,
                    multiplier,
                    score,
                    maxHeight,
                    lowHeight,
                    takeoffHeight,
                    maxClimb,
                    minClimb,
                    maxSpeed,
                    avgSpeedCourse,
                    link,
                }
            })
        }
    },
    minimal: function(result) {
        return {
            count: result.docs.length,
            flights: result.docs.map(doc => {
                let { _id,
                    identifier,
                    pilot,
                    date,
                    total,
                    score,
                } = doc;
    
                return {
                    _id,
                    identifier,
                    pilot,
                    date,
                    total,
                    score
                }
            })
        }
    }
}



