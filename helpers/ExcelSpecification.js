const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 14,
      bold: true
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  },
  cellDark: {
    fill: {
      fgColor: {
        rgb: 'FF1C1C1C'
      }
    }
  }
};

exports.ExcelSpecification = {
    pilot: {
      displayName: 'Pilot',
      headerStyle: styles.headerDark,
      width: 180
    },
    title: {
      displayName: 'Title',
      headerStyle: styles.headerDark,
      width: 180
    },
    club: {
      displayName: 'Club',
      headerStyle: styles.headerDark,
      width: 180
    },
    glider: {
      displayName: 'Glider',
      headerStyle: styles.headerDark,
      width: 180
    },
    date: {
      displayName: 'Date',
      headerStyle: styles.headerDark,
      width: 180
    },
    start: {
      displayName: 'Start time',
      headerStyle: styles.headerDark,
      width: 180
    },
    finish: {
      displayName: 'Finish time',
      headerStyle: styles.headerDark,
      width: 180
    },
    duration: {
      displayName: 'Duration',
      headerStyle: styles.headerDark,
      width: 180
    },
    takeoff: {
      displayName: 'Takeoff',
      headerStyle: styles.headerDark,
      width: 180
    },
    landing: {
      displayName: 'Landing',
      headerStyle: styles.headerDark,
      width: 180
    },
    total: {
      displayName: 'Total',
      headerStyle: styles.headerDark,
      width: 180
    },
    multiplier: {
      displayName: 'Multiplier',
      headerStyle: styles.headerDark,
      width: 180
    },
    score: {
      displayName: 'Score',
      headerStyle: styles.headerDark,
      width: 180
    },
    maxHeight: {
      displayName: 'Max Height',
      headerStyle: styles.headerDark,
      width: 180
    },
    lowHeight: {
      displayName: 'Low Height',
      headerStyle: styles.headerDark,
      width: 180
    },
    takeoffHeight: {
      displayName: 'Takeoff Height',
      headerStyle: styles.headerDark,
      width: 180
    },
    maxClimb: {
      displayName: 'Max Climb',
      headerStyle: styles.headerDark,
      width: 180
    },
    minClimb: {
      displayName: 'Min Climb',
      headerStyle: styles.headerDark,
      width: 180
    },
    maxSpeed: {
      displayName: 'Max Speed',
      headerStyle: styles.headerDark,
      width: 180
    },
    avgSpeedCourse: {
      displayName: 'Average Speed Course',
      headerStyle: styles.headerDark,
      width: 180
    }
  }