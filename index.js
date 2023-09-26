const { createServer } = require ("http");
const { createSchema, createYoga } = require ("graphql-yoga");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let clientes = [
    {
        "name": "Federico",
        "lastname": "Gomez"
    },
    {
        "name": "Martin",
        "lastname": "Perez"
    },
    {
        "name": "Beto",
        "lastname": "Gonzalez"
    }
];

const typeDefinitions = `
type Query {
  clientes: [Cliente],
  asteroidsNear: AsteroidsNear
},
type Cliente {
    name: String,
    lastname: String
}, 
type Mutation { 
    addCliente (name: String, lastname: String): Cliente
},
type AsteroidsNear{
    element_count: Int,
    near_earth_objects: NearEarthObjects,
    links: Links
},

type MissDistance {
    astronomical: String,
    lunar: String,
    kilometers: String,
    miles: String,
},
  
type RelativeVelocity {
    kilometers_per_second: String,
    kilometers_per_hour: String,
    miles_per_hour: String,
},
  
type CloseApproachData {
    close_approach_date: String,
    close_approach_date_full: String,
    epoch_date_close_approach: Int,
    orbiting_body: String,
    miss_distance: MissDistance,
    relative_velocity: RelativeVelocity,
},
  
type Feet {
    estimated_diameter_min: Float,
    estimated_diameter_max: Float,
},
  
type Miles {
    estimated_diameter_min: Float,
    estimated_diameter_max: Float,
},
  
type Meters {
    estimated_diameter_min: Float,
    estimated_diameter_max: Float,
},
  
type Kilometers {
    estimated_diameter_min: Float,
    estimated_diameter_max: Float,
},
  
type EstimatedDiameter {
    feet: Feet,
    miles: Miles,
    meters: Meters,
    kilometers: Kilometers,
},
  
type Today {
    id: String,
    neo_reference_id: String,
    name: String,
    nasa_jpl_url: String,
    absolute_magnitude_h: Float,
    is_potentially_hazardous_asteroid: Boolean,
    is_sentry_object: Boolean,
    close_approach_data: [CloseApproachData],
    estimated_diameter: EstimatedDiameter,
    links: Links,
},
  
type NearEarthObjects {
    today: [Today]
},
  
type Links {
    next: String,
    prev: String,
    self: String,
}  
# Types with identical fields:
# Feet Miles Meters Kilometers
`;
const resolvers = {
    Query: {
        clientes: () => {
            return clientes;
        },
        asteroidsNear: async() => {
            let res = await fetch('https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-09-05&end_date=2023-09-05&api_key=DEMO_KEY');
            res = await res.text();
            console.log(res);
            res = res.replaceAll("2023-09-05", "today");
            res = JSON.parse(res);
            return res;    
        }
    },
    Mutation: {
        addCliente: (_, data) => {
            let newCliente = {
                'name' :  data.name,
                'lastname' : data.lastname
            }
            clientes.push(newCliente);
            return newCliente;
        } 
    }
  };

createServer(
  createYoga({
    schema: createSchema({
      typeDefs: /* GraphQL */ typeDefinitions,
      resolvers: resolvers
    }),
  })
).listen(4000, () => {
  console.info("GraphQL Yoga is listening on http://localhost:4000/graphql")
});