const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} = graphql;

const VenueType = new GraphQLObjectType({
  name: 'Venue',
  fields: {
    id: { type:  GraphQLString},
    name: { type:  GraphQLString},
  }
});

const MenuType = new GraphQLObjectType({
  name: 'Menu',
  fields: {
    id: { type:  GraphQLString},
    eventTypeName: { type:  GraphQLString},
    venue: {
      type: VenueType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/venues/${parentValue.venueId}`)
          .then(res => res.data);
      }
    }
  }
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    menu: {
      type: MenuType,
      args: { id: { type: GraphQLString}},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/menus/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
})
