const gameArea = {
    "type": "Polygon",
    "coordinates": 
    [
        [
            [
            12.48295783996582,
            55.6883025599682
            ],
            [
            12.477679252624512,
            55.684141460475985
            ],
            [
            12.480125427246094,
            55.678963660368765
            ],
            [
            12.488365173339844,
            55.67852811321872
            ],
            [
            12.490639686584473,
            55.683343059366
            ],
            [
            12.488751411437988,
            55.687697776496876
            ],
            [
            12.48295783996582,
            55.6883025599682
            ]
        ]
    ]
}

const players = [ 
    {
        "type": "Feature",
        "properties": {
            "name":"Peter"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
            12.477121353149414,
            55.68549628566729
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name":"Lotte"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
            12.488794326782227,
            55.68288336648455
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name":"Niels"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
            12.4824857711792,
            55.67968956150834
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name":"Dorrit"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
            12.491197586059569,
            55.68068160461293
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name":"Carl"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
            12.483129501342773,
            55.68801226506936
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "name":"Bo"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
            12.502741813659668,
            55.6936242511797
            ]
        }
    }
]

module.exports = {gameArea,players}