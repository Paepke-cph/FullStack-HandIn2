import {expect} from 'chai'
import {Server} from 'http'
import fetch from 'node-fetch'

let server: Server
const TEST_PORT =  '7777'

describe('Get Post if Reached', () => {
    let URL: string
    
    before((done) => {
        process.env['PORT'] = TEST_PORT
        server = require("../../src/app").server
        URL = `http://localhost:${process.env.PORT}`
        done()
    })

    after((done) => {
        server.close(done)
    })

    it('Should return with details of post 1', async () => {
        const payload = {
            postID: 'Post1',
            lon: 12.49,
            lat: 55.77
        }

        let promise = await fetch(`${URL}/api/game/getPostIfReached`,
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        let post = await promise.json()

        expect(post.postID).to.be.equal("Post1")
        expect(post.task).to.be.equal("1+1")
        expect(post.isUrl).to.be.equal(false)
    })
})

// describe('Nearby Players', () => {
//     let URL: string
    
//     before((done) => {
//         process.env['PORT'] = TEST_PORT
//         server = require("../../src/app").server
//         URL = `http://localhost:${process.env.PORT}`
//         done()
//     })

//     after((done) => {
//         server.close(done)
//     })

//     it('Should return 1 player', async () => {
//         const payload = {
//             username: "t1",
//             password: "secret",
//             lon: 12.49,
//             lat: 55.77,
//             distance: 10
//         }
        
//         const promise = await fetch(`${URL}/api/game/nearbyPlayers`, 
//         {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload)
//         })
//         const otherPlayers = await promise.json()
//         expect(otherPlayers['players'].length).to.equal(1)
//     })

//     it('Should return 0 players', async () => {
//         const payload = {
//             username: "t1",
//             password: "secret",
//             "lon": 10.49,
//             "lat": 55.77,
//             distance: 10
//         }
        
//         const partialResult = await fetch(`${URL}/api/game/nearbyPlayers`, 
//         {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload)
//         })
//         const otherPlayers = await partialResult.json()
//         expect(otherPlayers['players'].length).to.equal(0)
//     } )
// })