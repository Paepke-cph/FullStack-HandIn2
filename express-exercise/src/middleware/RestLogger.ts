const restLogger = (req, res, next) => {
    let time = new Date()
    console.log(`[${time.toLocaleString()}] : [${req.method}] - ${req.originalUrl}`)
    next()
}

export {restLogger}