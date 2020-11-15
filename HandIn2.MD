# HandIn2

## Debug VS Console.log
Ved brug af Console.log, er problemet, når man når til at skulle i produktion med sine kode, at man skal rundt og fjene alle disse functionskald. Ved i stedet at gøre brug af Debug er det muligt at styre gennem vores .env miljøvariable at *tænde* og *slukket* for vores udprintninger. <br>
```
DEBUG=game-project,facade-no-db,facade-with-db,facade-with-db:test,user-endpoint,user-endpoint-test,db-setup
```
Igennem denne miljøvariable har vi mulighed for at *toggle* hvad vi gerne vil se og i hvilke sammenhæng vi ønsker at se dem.
```typescript
const debug = require("debug")("db-setup");
.
.
debug("This replaces the not so useful Console.log()")
```
I toppen af vores Database setup, har vi mulighed for at definerer vores debug-output, i dette tilfælde definerer vi vores *context* til at være db-setup, hvilke giver et output der giver til kende hvor det printed output kom fra.

## REST-API
### Routers
Et nem måde at lave endpoints på er igennem **express.Router()**, ved brug af dette kan man nemt defineret et API's endpoints (GET,POST,DELETE,...) og ligeledes definere hvilke middlewares der skal bruges ved hvert endpoint.
```typescript
const router = express.Router()

router.use((req,res,next) => {})
router.post('/', async function() {})
router.get('/', async function() {})
```
Det er altså meget nemt at definere hvilke endpoints vi har og skal vi til at tage dette endpoint i brug er det ligeledes nemt, da det kan klares med blot to linjer kode i vores **app.ts** for hvert API vi gerne vil stille til rådighed.
```typescript
let endpointRouter = requrire('./routes/endpointApi')
app.use('/api/myApi', endpointRouter)
```
## Basic Authentication
Til authentication, gør vi brug af det simple basic-auth middleware for at tjekke om en bruger er logget ind og derefter om de har rettigheder til at se det valgte indhold. Da dette er et meget simplet værktøj til authentication, så bliver brugeres credentials cache'ed i browseren. Da credentials bliver cached er der ikke nogen mulighed for at logge brugeren ud, uden at slette de cachede credentials.
<br>
Det er værd at noterer at basic-auth, ikke gør brug af hashing eller cryptering for at sikre credentials, det eneste der sker er at disse bliver encoded i base64 når de bliver sendt fra browseren til serveren. Det er derfor vigtigt at gøre brug af HTTPS for at encryptet kommunikationen mellem clienten og serveren.
<br>
Da basic-authentication er et middleware, så er processen hvormed det skal bruges forholdsvis simple, i vores tilfælde her gør vi også brug af vores .env fil til at specifiere om vi har authentication slået til eller fra. Igen ved brug af disse miljø variabler har vi mulighed for at, mens vi tester slå authentication fra og *speede* udviklingen lidt op.
```typescript
const USE_AUTHENTICATION = process.env["SKIP_AUTHENTICATION"] === 'False';
...
if(USE_AUTHENTICATION) {
    router.use(authMiddleware)
}
```

## Chai & Mocha
For at teste vores endpoints og facader gør vi brug af framworks'ne **Chai** og **Mocha**. Ligesom vi kender det fra testing med java, så kan vi ved brug af disse framworks, der automatisere vores testing, sikre adfærdren af vores kode forbliver korrekt, også når vi foretager ændringer i den bagvedliggende struktur/kode.
### Mocha
Mocha tager BDD (Behaviour Driven Development) tilgangen til testing, hvilke altså er med til både at teste, dokumentere og eksemplificere koden. For at faciliterer dette gør Mocha brug af følgende funtioner: **describe()**, **before()**, **after()**, og **it()**, som stillere koden op logisk og meget beskrivende af hvad udfaldene skal være.
- ***describe()*** kan bruges til at beskrive en større mængde kode, for eksemple ved at beskrive at nu bliver der testet alle metoder i vores GameAPI som f.eks:
```typescript
describe('Testing Game Endpoint', () => {
    ...
})
``` 
- ***before()*** bruges til at opstille alle de forudsætninger vores kode kræver, i vores tilfælde med tests af endpoints, så vil det være i vores before metode at vi starter vores server.
```typescript
before((done) => {
    ...
    process.env['PORT'] = TEST_PORT
    server = require("../../src/app").server
    URL = `http://localhost:${process.env.PORT}`
    ...
    done()
})
```
- ***after()***, og ligesom vi kan udfører opgaver før testne, så kan vi også definere, med after(), hvad der skal ske efter vores tests er blevet udført. Fortsat med samme eksemple som tidligere, som ville vi lukke ned igen for vores server, når alle tests er blevet kørt.
```typescript
after((done) => {
    ...
    server.close(done)
    ...
})
```
- ***it()** bruges til at udfører selve testene, it() kaldes med en streg og en metode (hvori testene udføres), stregen bliver brugt, ligesom describe til at beskrive hvad det forventede resultat skal være, altså den adfærd som vi tester for.
```typescript
it('nearbyPlayers should return 1 player',() => {
    ...
})
```
Det er værd at noterer at der også findes beforeEach og afterEach, som udføre en bestemt handling før og efter **hver** test, i stedet for før alle og efter all tests.
<br> Mocha supportere også async/await og promise -baseret kode i gennem callback metoden done(). Hvis man f.eks ikke er sikker på hvornår man får et resultat tilbage fra et site man fetcher fra, så kan man i sit then() chain, give done() med som callback, og når så fetch resolver bliver done() kaldt den vej igennem og derfra kan Mocha se at testen er blevet færdig.

### Chai
Sammen med Mocha har vi gjort godt brug af Chai, til at verificere vores resultater. Chai faciliterer forskellige måder at *asserte* sine værdier, på en måde der er meget læsevenligt og nemt kan forstås. Chai giver følgende måder at verificere sine resultater på:
- ***should()***
```typescript
const foo = 'BOO'

chai.should()
foo.should.be.a('string')       // type verfication
foo.should.equal('BOO')         // value verification
```
- ***expect()***
```typescript
const foo = 'BOO'

var expect = chai.expect
expect(foo).to.be.a('string')   // type verification
expect(foo).to.equal('BOO')     // value verification
```
- ***assert***
```typescript
const foo = 'BOO'

var assert = chai.assert
assert.typeof(foo,'string')     // type verification
assert.equal(foo, 'BOO')        // value verification
```
## MongoDB
Til vores backend har vi haft gjort brug af en MongoDB, dokument orienteret database. Vi har altså i stedet for en relationel database, brugt mongoDB som i stedet gemmer data som JSON-lignende dokumenter.
Forskellen mellem NoSQL og SQL, er at med f.eks mySql bliver en tabel defineret, og den data der skal ind i denne tabel **skal** overholde den specifikation tabelen er blevet udstyret med. Dette behøves ikke for en NoSql database, i disse collections kan der være sat en definition op for dokumenterne, men hvormod SQL ville brokke sig ved synet af noget der ikke *passede* ind, så tillader NoSQL disse forskelle. Følgende kunne være dokumenter der er indsat i den samme collection, men med forskellige data.
```json
{
    ISBN: 9780992461225,
    title: "JavaScript: Novice to Ninja",
    author: "Darren Jones",
    format: "ebook",
    price: 29.00,
    publisher_id: "SP001"
}
{
    ISBN: 1298737193781,
    title: "This is a very diffent book",
    author: "Unknown",
    format: "hardcover",
    avilability: "in-library",
    bookcase: "A99",
    row: 3
}
```
Havde dette skulle være blevet indsat i en relationel database, skulle all kolonner være defineret fra start og i den først bogs data ville *availability*,*bookcase*, og *row* være NULL. Hvormed i en document orienteret database, så er dette ikke et problem, vi kan blot indsætte begge bøger uden at det er et problem.
### Index
Ligesom i relationelle databaser, er index's et godt redskab til at optimerer søgning i vores databaser. I vores MongoDB database har vi også arbejdet med at oprette index's både til vores geolokations data og senest opdateret.
<br>
Da vi ønskede at vores spilleres position ikke skulle blive for gamle og dermed ikke længere være repræsentative, satte vi et index på 'lastUpdated' i vores gemte data. Dette betød at hvis en position i database, med feltet 'lastUpdated' overskred 60 sec så vil MongoDB selv fjerne dokumentet, da det nu ikke var brugbart mere. Måde vi oprettede dette index på var som følgende:

```typescript
let positionCollection: mongo.Collection
positionCollection = await client.db(dbName).collection(POSITION_COLLECTION)
...
positionCollection.createIndex({"lastUpdated":1}, {expireAfterSeconds:EXPIRES_AFTER})
```
Som førnævnt dannede vi også index til vores geo-data. MongoDB faciliterer dette igennem **2DSphere** indeksering. Ved brug af dette var det også muligt at indeksere vores positions data.

```typescript
let positionCollection: mongo.Collection
positionCollection = await client.db(dbName).collection(POSITION_COLLECTION)
positionCollection.createIndex({location:"2dsphere"})
```
### Facader
Vores MongoDB database blev brug af vores facader, til at gemme spiller positioner, spillere, og poster. Et eksemple på hvor vi gjorde brug af databasen, var når en spiller spurgte vores server om der var andre spillere i nærheden. Her kunne vi gøre brug af vores position-collection og finde alle de spillere der var inden for en bestemt radius af den spørgende spillers lokation, og samtidig undlade den spørgende spiller selv i responsen. Herunder er koden for hvordan denne søgning bliver fortage:
```typescript
static async findNearbyPlayers(clientUserName: string, point: IPoint, distance: number): Promise<Array<IPosition>> {
    GameFacade.isDbReady();
    try {
      const found = await positionCollection.find(
        {
            username: {$ne: clientUserName},
            location: {
                $near: point,
                $maxDistance: distance    
            }
        }
      )
      return found.toArray();
    } catch (err) {
      throw err;
    }
  }
```
I koden bruge vi **find()** metoden til at finde andre spilleres lokationer, det vi starter med er at specificere at vi ønsker all *undtagen* positionen fra den spørgende spiller.

```typescript
username: {$ne: clientUserName},
```
Derefter specificere vi at vi ønsker at finde spillerede i nærheden af det givne centrum,*point*, og at det skal være inden for en maks radius specificeret ud fra *distance*
```typescript
location: {
    $near: point,
    $maxDistance: distance    
}
```