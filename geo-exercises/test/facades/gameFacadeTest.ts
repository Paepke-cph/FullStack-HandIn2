import { doesNotMatch } from 'assert'
import {expect} from 'chai'
import {getConnectedClient, closeConnection} from '../../src/config/setupDB'
import { ApiError } from '../../src/errors/apiError'
import GameFacade from '../../src/facades/gameFacade'
import UserFacade from '../../src/facades/userFacadeWithDB'

describe('GameFacade Test', function() {
    let client
    before(async function() {
        client = await getConnectedClient();
        await GameFacade.initDB(client)
        await UserFacade.initDB(client)
    })

    after(async function(){
        await closeConnection()
    })
    describe("Get Position", function() { 
        it('Should throw ApiError', async function() {
            try {
                await GameFacade.getPosition("lkasdlkjad","kasdkaælkdælk")
            }  catch(error) {
                expect(error instanceof ApiError).to.equal(true)
            }
        })

        it("Should get position", async function(){
            let position = await GameFacade.getPosition("t2","secret")
            expect(position.location.coordinates[0]).to.equal(12.49)
            expect(position.location.coordinates[1]).to.equal(55.77)
        })
    })

    describe("Get nearbyPlayers", function(){
        describe("Should return noone", async function(){
            let others = await GameFacade.nearbyPlayers("t1","secret",12.48,55.77,1)
            expect(others.length).to.equal(0)
        })
        describe("Should return 2 players", async function(){
            let others = await GameFacade.nearbyPlayers("t1","secret",12.48,55.77,300000)
            expect(others.length).to.equal(2);
        })
    }) 
})